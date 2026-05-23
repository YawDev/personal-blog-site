import EditProfileForm from "@/components/auth/EditProfileForm";
import { getInitialUser } from "@/utils/authUtil";
import { redirect } from "next/navigation";

const EditProfilePage = async () => {
  const user = await getInitialUser();
  if (!user) {
    redirect("/identity/login");
  }

  return (
    <>
      <EditProfileForm currentUser={user} />
    </>
  );
};

export default EditProfilePage;
