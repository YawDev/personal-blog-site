import { fetchAllDraftsByUser } from "@/utils/serverApi";
import { getInitialUser } from "@/utils/authUtil";
import DraftList from "@/components/draft/Drafts";
import { redirect, unauthorized } from "next/navigation";

export default async function DraftsPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  const [fetchedDrafts, user] = await Promise.all([
    fetchAllDraftsByUser(id),
    getInitialUser(),
  ]);

  const isLoggedIn = !!user;

  if(!isLoggedIn){
    redirect("/identity/login")
  }

  if(id !== user?.id)
    return unauthorized()

  return (
    <>
      <DraftList fetchedDrafts={fetchedDrafts} currentUser={user} />
    </>
  );
}
