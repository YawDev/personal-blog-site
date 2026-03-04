"use client";
import { FormMode } from "@/utils/FormHelpers";
import { SavePostForm } from "@/components/blog/save/SavePostForm";

const CreateBlogPage = () => {
  return (
    <>
      <SavePostForm mode={FormMode.Create} blogData={null} />
    </>
  );
};

export default CreateBlogPage;
