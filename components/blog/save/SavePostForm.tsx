"use client";

import { FormMode } from "@/utils/forms/FormHelpers";
import { Blog } from "@/types/types";
import { useEffect, useState } from "react";
import setPageTitle from "@/formHelpers/formUtils";
import BackToArticles from "../BackToArticles";
import SaveFormCard from "./SaveFormCard";
import {
  USE_LOCAL_STORAGE_FALLBACK,
  getBlogByIdFromStorage,
  getDraftByIdFromStorage,
} from "@/utils/browser/localStorageFallback";
import usePostForm from "@/hooks/usePostForm";
import BackToDrafts from "@/components/draft/BackToDrafts";
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
    usePostForm({
      title: currentBlogData?.title || "",
      preview: currentBlogData?.preview || "",
      content: currentBlogData?.content || "",
    });

  useEffect(() => {
    if (mode === FormMode.EditPublished) {
      // API provides blogData; fall back to localStorage only if the flag is on (dev-only).
      let blogToEdit = blogData;
      if (!blogToEdit && USE_LOCAL_STORAGE_FALLBACK && blogData?.id) {
        blogToEdit = getBlogByIdFromStorage(blogData.id);
      }
      if (blogToEdit) {
        setCurrentBlogData(blogToEdit);
        loadExistingData(blogToEdit);
      }
    } else if (mode === FormMode.EditDraft) {
      const draftToEdit = blogData?.id
        ? getDraftByIdFromStorage(blogData.id)
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
          {mode === FormMode.EditDraft ? (
            <BackToDrafts currentUserId={blogData?.userId || ""} />
          ) : (
            <BackToArticles />
          )}
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
          blogData={blogData ?? null}
        />
      </div>
    </section>
  );
}
