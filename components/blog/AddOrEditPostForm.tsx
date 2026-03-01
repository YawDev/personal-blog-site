"use client";

import { FormMode } from "@/app/utils/FormHelpers";
import useFormValidation from "@/hooks/useFormValidation";
//import { SaveDraftButton } from "./SaveDraftButton";
import { Blog } from "@/app/utils/types";
import ErrorMessage from "@/components/shared/ErrorMessage";
import WritingTips from "./WritingTips";
import BackToArticles from "./BackToArticles";
import { useRouter } from "next/navigation";
import { savePostsToLocalStorage } from "@/app/utils/InMemory";
import { v4 as uuid } from "uuid";
export function AddOrEditPostForm({
  mode,
  blogData,
}: {
  mode: FormMode;
  blogData: Blog | null;
}) {
  const router = useRouter();
  const { formState, handleInputChange, handleBlur } = useFormValidation({
    title: blogData?.title || "",
    preview: blogData?.preview || "",
    content: blogData?.content || "",
  });

  const setPageTitle = () => {
    switch (mode) {
      case FormMode.Create:
        return "Create New Article";
      case FormMode.EditDraft:
        return "Edit Saved Draft";
      case FormMode.EditPublished:
        return "Edit Published Article";
      default:
        return "Article Form";
    }
  };

  return (
    <section className="bg-gradient-to-br from-teal-50 to-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <BackToArticles />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {setPageTitle()}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your insights and expertise with the community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission logic here

              if (FormMode.Create === mode) {
                // For now, we'll just log the form state. Replace with API call when ready.
                const newBlog: Blog = {
                  id: uuid(),
                  title: formState.title.value,
                  preview: formState.preview.value,
                  content: formState.content.value,
                  datePosted: new Date().toISOString(),
                };
                savePostsToLocalStorage(newBlog);
                router.push(`/blogs/${newBlog.id}`);
              }
            }}
          >
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-gray-900 mb-3"
              >
                Article Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter an engaging title for your article..."
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-0 outline-none transition-colors duration-200 ${
                  formState.title.error
                    ? "border-red-300 focus:border-red-500 hover:border-red-400"
                    : "border-gray-200 focus:border-teal-500 hover:border-gray-300"
                }`}
                required
                value={formState.title.value}
                onChange={(e) => handleInputChange("title", e.target.value)}
                onBlur={() => handleBlur("title")}
              />
            </div>
            {formState.title.error && (
              <ErrorMessage message={formState.title.error} />
            )}
            {/* Preview Field */}
            <div>
              <label
                htmlFor="preview"
                className="block text-lg font-semibold text-gray-900 mb-3"
              >
                Article Summary
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Optional)
                </span>
              </label>
              <textarea
                id="preview"
                name="preview"
                rows={4}
                placeholder="Write a compelling summary that will entice readers to click and read more..."
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-0 outline-none transition-colors duration-200 resize-none ${
                  formState.preview.error
                    ? "border-red-300 focus:border-red-500 hover:border-red-400"
                    : "border-gray-200 focus:border-teal-500 hover:border-gray-300"
                }`}
                value={formState.preview.value}
                onChange={(e) => handleInputChange("preview", e.target.value)}
                onBlur={() => handleBlur("preview")}
              ></textarea>
              {formState.preview.error && (
                <ErrorMessage message={formState.preview.error} />
              )}
            </div>

            {/* Content Field */}
            <div>
              <label
                htmlFor="content"
                className="block text-lg font-semibold text-gray-900 mb-3"
              >
                Article Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={16}
                placeholder="Start writing your article here. Share your insights, experiences, and expertise..."
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-0 outline-none transition-colors duration-200 resize-y ${
                  formState.content.error
                    ? "border-red-300 focus:border-red-500 hover:border-red-400"
                    : "border-gray-200 focus:border-teal-500 hover:border-gray-300"
                }`}
                required
                value={formState.content.value}
                onChange={(e) => handleInputChange("content", e.target.value)}
                onBlur={() => handleBlur("content")}
              ></textarea>
              <p className="text-sm text-gray-500 mt-2">
                Tip: Use clear paragraphs and headings to improve readability
              </p>
              {formState.content.error && (
                <ErrorMessage message={formState.content.error} />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
              {/* Once save draft functionality is implemented, button will be triggered when form input is valid */}
              <button
                type="submit"
                className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                  !formState.validForSubmit
                    ? "text-gray-400 bg-gray-300 cursor-not-allowed opacity-60 shadow-none"
                    : "text-white bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl cursor-pointer"
                }`}
                disabled={!formState.validForSubmit}
              >
                Publish Article
              </button>
            </div>
          </form>

          {/* Writing Tips */}
          <WritingTips />
        </div>
      </div>
    </section>
  );
}
