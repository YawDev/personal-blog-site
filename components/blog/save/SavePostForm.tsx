"use client";

import { FormMode } from "@/utils/FormHelpers";
import useFormValidation from "@/hooks/useFormValidation";
import { Blog } from "@/utils/types";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/utils/LocalStorage";
import setPageTitle from "@/formHelpers/formUtils";
import BackToArticles from "../BackToArticles";
import SaveFormCard from "./SaveFormCard";
export function SavePostForm({
  mode,
  blogData,
}: {
  mode: FormMode;
  blogData: Blog | null;
}) {
  // Fetch BlogToEdit from localStorage using ID passed from server until we integrate API
  const [isLoading, setIsLoading] = useState(true);
  const [currentBlogData, setCurrentBlogData] = useState<Blog | null>(blogData);

  const { formState, handleInputChange, handleBlur, loadExistingData } =
    useFormValidation({
      title: currentBlogData?.title || "",
      preview: currentBlogData?.preview || "",
      content: currentBlogData?.content || "",
    });

  useEffect(() => {
    if (mode === FormMode.EditPublished) {
      // Remove localStorage once API is integrated and replace with fetchedBlog
      var localStorage: any = getFromLocalStorage("blogs");
      console.log("Local Storage Blogs:", localStorage);
      const blogToEdit = localStorage
        ? JSON.parse(localStorage).find(
            (b: { id: string }) => b.id === blogData?.id,
          )
        : null;
      if (blogToEdit) {
        setCurrentBlogData(blogToEdit);
        loadExistingData(blogToEdit);
      }
    } else if (mode === FormMode.EditDraft) {
      var localStorage: any = getFromLocalStorage("drafts");
      const draftToEdit = localStorage
        ? JSON.parse(localStorage).find(
            (d: { id: string }) => d.id === blogData?.id,
          )
        : null;
      if (draftToEdit) {
        setCurrentBlogData(draftToEdit);
        loadExistingData(draftToEdit);
      }
    }

    setIsLoading(false);
  }, [mode, blogData?.id]);

  setPageTitle(mode);

  if (isLoading) {
    return null; // Let the server loading handle this
  }

  return (
    <section className="bg-gradient-to-br from-teal-50 to-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <BackToArticles />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {setPageTitle(mode)}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your insights and expertise with the community
          </p>
        </div>

        {/* Form Card */}
        <SaveFormCard
          mode={mode}
          formState={formState}
          handleInputChange={handleInputChange}
          handleBlur={handleBlur}
          idParam={blogData?.id}
        />
      </div>
    </section>
  );
}
