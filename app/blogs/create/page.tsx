"use client";
import { FormMode } from "@/app/utils/FormHelpers";
import { AddOrEditPostForm } from "@/components/blog/AddOrEditPostForm";

const CreateBlogPage = () => {
  return (
    <>
      <AddOrEditPostForm mode={FormMode.Create} blogData={null} />
    </>
  );
};

export default CreateBlogPage;
