import BlogList from "@/components/blog/Blogs";
import { fetchAllDraftsByUser, fetchAllPosts } from "@/utils/serverApi";
import { getInitialUser } from "@/utils/authUtil";
import DraftList from "@/components/draft/Drafts";

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

  return (
    <>
      <DraftList fetchedDrafts={fetchedDrafts} currentUser={user} />
    </>
  );
}
