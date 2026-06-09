"use client";

import { Blog } from "@/types/types";
import CallToAction from "../home/CallToAction";
import { useEffect, useState } from "react";
import BackToArticles from "./BackToArticles";
import EditPostLink from "./save/EditPostLink";
import DeletePostButton from "./DeletePostButton";
import { useAuth } from "@/providers/auth-provider";
import { deletePostApi } from "@/service/PersonalBlogService";
import { useRouter } from "next/dist/client/components/navigation";
import { ConfirmDeleteModal } from "../shared/ConfirmDeleteModal";
import AlertMessage from "../shared/AlertMessage";
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
  const authorName: string = fetchedBlog?.author ?? "Anonymous Author";

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
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    setDeleteError(null);
    // The actual delete logic will be handled in the DeletePostButton component
    const response = await deletePostApi(postid, currentArticle?.userId ?? "");
    if (response) {
      router.push("/blogs?deletedPost=true"); // Redirect to homepage or posts list
    } else {
      setDeleteError("Failed to delete the post. Please try again.");
    }
  };
  console.log(fetchedBlog, "Blog response detail");

  return (
    <article className="bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-teal-50 to-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <BackToArticles />
            {isLoggedIn && isAuthor && <EditPostLink id={currentArticle?.id} />}
          </div>
          {deleteError && (
            <div className="mb-8">
              <AlertMessage message={deleteError} variant="error" />
            </div>
          )}
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
          {/* Article Footer           
          // Add Article Footer once fully functional
           */}
          {/* Prev/next article navigation parked in ArticleNavigation —
              not rendered until we replace date-adjacency with related posts. */}
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
