"use client";

import { Blog } from "@/types/types";
import CallToAction from "../home/CallToAction";
import { useEffect, useState } from "react";
import BackToArticles from "./BackToArticles";
import EditPostLink from "./save/EditPostLink";
import Link from "next/dist/client/link";
import DeletePostButton from "./DeletePostButton";
import { useAuth } from "@/providers/auth-provider";
import { deletePostApi } from "@/service/PersonalBlogService";
import { useRouter } from "next/dist/client/components/navigation";
import { ConfirmDeleteModal } from "../shared/ConfirmDeleteModal";
const BlogDetails = ({
  fetchedBlog,
  isLoggedIn,
  isAuthor,
}: {
  fetchedBlog: Blog | null;
  isLoggedIn: boolean;
  isAuthor: boolean | null; // null means we don't know yet (e.g. still loading), true means user is author, false means user is not author
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const authorName: string =
    isAuthor && user
      ? user.displayName || user.userName || "Author"
      : "Anonymous Author";
  const authorAvatar = isAuthor ? user?.avatar : undefined;
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatDate = (date: string | undefined) => {
    if (date) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date));
    }
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [currentArticle, setCurrentArticle] = useState<Blog | null>(
    fetchedBlog ?? null,
  );

  const articleContent = currentArticle?.content ?? "";
  const words = articleContent.trim()
    ? articleContent.trim().split(/\s+/).length
    : 0;
  const estimatedReadTime = words > 0 ? Math.ceil(words / 200) : 0;

  useEffect(() => {
    if (fetchedBlog) {
      setCurrentArticle(fetchedBlog);
    }
    setIsLoading(false);
  }, [fetchedBlog]);

  if (isLoading) {
    return null; // Let the server loading handle this
  }

  const handleDelete = async (postid: string) => {
    setIsDeleteModalOpen(false);
    // The actual delete logic will be handled in the DeletePostButton component
    const response = await deletePostApi(postid, currentArticle?.userId ?? "");
    if (response) {
      alert("Post deleted successfully.");
      router.push("/blogs"); // Redirect to homepage or posts list
    } else {
      alert("Failed to delete the post. Please try again.");
    }
  };

  return (
    <article className="bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-teal-50 to-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <BackToArticles />
            {isLoggedIn && isAuthor && <EditPostLink id={currentArticle?.id} />}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {currentArticle?.title}
          </h1>

          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {authorInitials}
                  </span>
                </div>
              )}
              <span className="text-gray-900 font-medium">{authorName}</span>
            </div>
            {isLoggedIn && isAuthor && (
              <>
                <DeletePostButton
                  postId={currentArticle?.id ?? ""}
                  userId={currentArticle?.userId ?? ""}
                  handleDeleteClick={() => setIsDeleteModalOpen(true)}
                />
              </>
            )}
          </div>
          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            setIsOpen={setIsDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => handleDelete(currentArticle?.id ?? "")}
            mode="post"
          />
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
              {formatDate(currentArticle?.datePosted)}
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
          {currentArticle?.preview && (
            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mb-8 rounded-r-lg">
              <h2 className="text-lg font-semibold text-teal-900 mb-2">
                Article Summary
              </h2>
              <p className="text-teal-800 leading-relaxed">
                {currentArticle?.preview}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg prose-gray max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-700 text-lg">
              {currentArticle?.content}
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
                <Link
                  href="#"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  ← Exploring Modern Web Development
                </Link>
              </div>
              <div className="flex-1 pl-4 text-right">
                <p className="text-sm text-gray-500 mb-1">Next Article</p>
                <Link
                  href="#"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  The Future of AI in Business →
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </main>

      {/* Call to Action - Perfect placement after engaging content! */}
      <CallToAction
        postId={fetchedBlog?.id ?? ""}
        currentUserId={user?.id ?? null}
      />
    </article>
  );
};

export default BlogDetails;
