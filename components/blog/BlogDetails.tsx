"use client";

import { Blog } from "@/app/utils/types";
import CallToAction from "../home/CallToAction";

const BlogDetails = ({ blog }: { blog: Blog }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const estimatedReadTime = Math.ceil(blog.content.split(" ").length / 200);

  return (
    <article className="bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-teal-50 to-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
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

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(blog.datePosted)}
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {estimatedReadTime} min read
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <main className="py-12 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Preview/Summary */}
          {blog.preview && (
            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mb-8 rounded-r-lg">
              <h2 className="text-lg font-semibold text-teal-900 mb-2">
                Article Summary
              </h2>
              <p className="text-teal-800 leading-relaxed">{blog.preview}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg prose-gray max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-700 text-lg">
              {blog.content}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">PB</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Personal Blog</p>
                  <p className="text-gray-600 text-sm">
                    Insights on technology and innovation
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex items-center text-gray-600 hover:text-teal-600 transition-colors duration-200">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Like
                </button>
                <button className="flex items-center text-gray-600 hover:text-teal-600 transition-colors duration-200">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </footer>

          {/* Navigation to other articles */}
          <nav className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between">
              <div className="flex-1 pr-4">
                <p className="text-sm text-gray-500 mb-1">Previous Article</p>
                <a
                  href="#"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  ← Exploring Modern Web Development
                </a>
              </div>
              <div className="flex-1 pl-4 text-right">
                <p className="text-sm text-gray-500 mb-1">Next Article</p>
                <a
                  href="#"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  The Future of AI in Business →
                </a>
              </div>
            </div>
          </nav>
        </div>
      </main>

      {/* Call to Action - Perfect placement after engaging content! */}
      <CallToAction />
    </article>
  );
};

export default BlogDetails;
