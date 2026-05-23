import Profile from "@/components/auth/Profile";
import { getInitialUser } from "@/utils/authUtil";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const user = await getInitialUser();
  if (!user) {
    redirect("/identity/login");
  }

  return <Profile user={user} />;
};

export default ProfilePage;
