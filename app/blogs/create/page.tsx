"use client";
import { FormMode } from "@/app/utils/FormHelpers";
import { AddOrEditPostForm } from "@/components/blog/saveBlogPost/AddOrEditPostForm";

const CreateBlogPage = () => {
  return (
    <>
      <AddOrEditPostForm mode={FormMode.Create} blogData={null} />
    </>
  );
};

export default CreateBlogPage;
