"use client";

import { FormMode, IFormState } from "@/app/utils/FormHelpers";
import { SaveDraftButton } from "./SaveDraftButton";
import { useState } from "react";
import { Blog } from "@/app/utils/types";
export function AddOrEditPostForm({
  mode,
  blogData,
}: {
  mode: FormMode;
  blogData: Blog | null;
}) {
  const [formInputState, setFormInputState] = useState<IFormState>({
    title: { value: "", error: "" },
    preview: { value: "", error: "" },
    content: { value: "", error: "" },
    validForSubmit: false,
  });

  return (
    <section className="bg-gradient-to-br from-teal-50 to-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <a
              href="/blogs"
              className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Articles
            </a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create New Article
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
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 outline-none transition-colors duration-200 hover:border-gray-300"
                required
              />
            </div>

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
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 outline-none transition-colors duration-200 hover:border-gray-300 resize-none"
              ></textarea>
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
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 outline-none transition-colors duration-200 hover:border-gray-300 resize-y"
                required
              ></textarea>
              <p className="text-sm text-gray-500 mt-2">
                Tip: Use clear paragraphs and headings to improve readability
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
              {/* Once save draft functionality is implemented, button will be triggered when form input is valid */}
              <button
                type="submit"
                className="px-8 py-4 text-lg font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Publish Article
              </button>
            </div>
          </form>

          {/* Writing Tips */}
          <div className="mt-12 p-6 bg-teal-50 rounded-xl border-l-4 border-teal-600">
            <h3 className="text-lg font-semibold text-teal-900 mb-2">
              Writing Tips
            </h3>
            <ul className="text-teal-800 space-y-1 text-sm">
              <li>• Start with a compelling hook to grab readers' attention</li>
              <li>• Use subheadings to organize your content clearly</li>
              <li>• Include practical examples and actionable insights</li>
              <li>• End with a strong conclusion or call-to-action</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
