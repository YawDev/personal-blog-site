"use client";
import { FormMode } from "@/utils/forms/FormHelpers";
import { SavePostForm } from "@/components/blog/save/SavePostForm";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect } from "react";

const CreateBlogPage = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/identity/login");
    }
  }, [isLoggedIn]);

  // Prevent rendering the form if user is not logged in (in case of slow redirect)
  if (!isLoggedIn) return null;

  return (
    <>
      <SavePostForm mode={FormMode.Create} blogData={null} />
    </>
  );
};

export default CreateBlogPage;
