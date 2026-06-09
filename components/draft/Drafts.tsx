"use client";

import { Draft, User } from "@/types/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConfirmDeleteModal } from "../shared/ConfirmDeleteModal";
import { deleteDraftApi } from "@/service/PersonalBlogService";
import NumberedPagination from "../shared/NumberedPagination";
import { maxValueToDisplay } from "@/utils/pagination/VisiblePostSetttings";
import AlertMessage from "../shared/AlertMessage";

// const dummyDrafts: Draft[] = [
//   {
//     id: "1",
//     title: "Getting Started with TypeScript",
//     content: "TypeScript is a typed superset of JavaScript...",
//     preview: "An introduction to TypeScript and why you should use it in your next project.",
//     createdOn: "2026-05-10T14:23:00Z",
//     userId: "user-1",
//   },
//   {
//     id: "2",
//     title: "Understanding React Server Components",
//     content: "React Server Components allow you to render components on the server...",
//     preview: "A deep dive into how React Server Components work and when to use them.",
//     createdOn: "2026-05-15T09:41:00Z",
//     userId: "user-1",
//   },
//   {
//     id: "3",
//     title: "Building a REST API with .NET 8",
//     content: "In this post we will build a fully functional REST API...",
//     preview: "Step-by-step guide to building a production-ready REST API using .NET 8 minimal APIs.",
//     createdOn: "2026-05-20T17:05:00Z",
//     userId: "user-1",
//   },
//   {
//     id: "4",
//     title: "Tailwind CSS Tips and Tricks",
//     content: "Tailwind CSS is a utility-first CSS framework...",
//     preview: "Practical tips to get the most out of Tailwind CSS in your projects.",
//     createdOn: "2026-05-22T11:30:00Z",
//     userId: "user-1",
//   },
// ];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const wordCount = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

const readingTime = (text: string) => {
  const words = wordCount(text);
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const DraftList = ({
  fetchedDrafts,
  currentUser: _currentUser,
}: {
  fetchedDrafts: Draft[];
  currentUser: User | null;
}) => {
  const drafts = fetchedDrafts.length > 0 ? fetchedDrafts : []; // Fallback to empty array if no drafts found or API returns null
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDrafts, setCurrentDrafts] = useState<Draft[]>(drafts); // Local state to manage drafts list
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDraftResult, setDeleteDraftResult] = useState<string | null>(
    null,
  );
  const [showToast, setShowToast] = useState(false);

  const totalPages = Math.max(
    1,
    Math.ceil(currentDrafts.length / maxValueToDisplay),
  );

  // Keep the page in range when drafts shrink (e.g. deleting the last item on a page).
  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  // Fade the delete result toast in, hold it, then fade out and unmount.
  useEffect(() => {
    if (!deleteDraftResult) return;
    // Flip to visible on the next frame so the opacity/slide transition runs.
    const fadeIn = requestAnimationFrame(() => setShowToast(true));
    const fadeOut = setTimeout(() => setShowToast(false), 4000);
    const unmount = setTimeout(() => setDeleteDraftResult(null), 4300);
    return () => {
      cancelAnimationFrame(fadeIn);
      clearTimeout(fadeOut);
      clearTimeout(unmount);
    };
  }, [deleteDraftResult]);

  const indexOfLast = currentPage * maxValueToDisplay;
  const paginatedDrafts = currentDrafts.slice(
    indexOfLast - maxValueToDisplay,
    indexOfLast,
  );

  const handleDelete = async (draftid: string) => {
    // Implement delete logic here, e.g., call API to delete draft
    var success = await deleteDraftApi(draftid, _currentUser?.id ?? "");
    if (success) {
      setDeleteDraftResult("Draft deleted successfully.");
      // Optionally, you can also remove the deleted draft from the local state to update the UI immediately
      setCurrentDrafts((prevDrafts) =>
        prevDrafts.filter((draft) => draft.id !== draftid),
      );
    } else {
      setDeleteDraftResult("Failed to delete draft. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Transient toast for delete result — auto-dismisses after a few seconds. */}
      {deleteDraftResult && (
        <div
          className={`fixed top-6 left-1/2 z-50 w-full max-w-md px-4 transition-all duration-300 ease-out ${
            showToast
              ? "-translate-x-1/2 translate-y-0 opacity-100"
              : "-translate-x-1/2 -translate-y-2 opacity-0"
          }`}
        >
          <AlertMessage
            message={deleteDraftResult}
            variant={
              deleteDraftResult.includes("successfully") ? "default" : "error"
            }
          />
        </div>
      )}

      {/* Page header */}
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Unpublished Blog Drafts
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {currentDrafts.length}{" "}
              {currentDrafts.length === 1
                ? "unpublished draft"
                : "unpublished drafts"}
            </p>
          </div>
          {currentDrafts.length > 0 && (
            <Link
              href="/blogs/create"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              New Post
            </Link>
          )}
        </div>
      </div>

      {/* Draft list */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <p className="text-slate-800 font-semibold text-lg">
              No drafts yet
            </p>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">
              Start writing and save a draft — it will appear here.
            </p>
            <Link
              href="/blogs/create"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors duration-150"
            >
              Write your first post
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {paginatedDrafts.map((draft) => (
              <li
                key={draft.id}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors duration-150"
              >
                {/* Left accent bar */}
                <div className="hidden sm:block w-1 self-stretch rounded-full bg-amber-400 shrink-0" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Draft
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(draft.createdOn)}
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">
                      {readingTime(draft.content)}
                    </span>
                  </div>

                  <Link
                    href={`/blogs/draft/${draft.id}`}
                    className="block font-semibold text-slate-900 text-base leading-snug truncate hover:text-teal-700 transition-colors duration-150"
                  >
                    {draft.title}
                  </Link>

                  <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                    {draft.preview}
                  </p>
                </div>
                <ConfirmDeleteModal
                  isOpen={isDeleteModalOpen}
                  setIsOpen={setIsDeleteModalOpen}
                  onClose={() => setIsDeleteModalOpen(false)}
                  onConfirm={() => handleDelete(draft.id)}
                  mode="draft"
                />

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                  <Link
                    href={`/blogs/draft/${draft.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 hover:border-teal-300 transition-colors duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474ZM4.75 3.5A2.25 2.25 0 0 0 2.5 5.75v5.5A2.25 2.25 0 0 0 4.75 13.5h5.5A2.25 2.25 0 0 0 12.5 11.25V9a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-5.5a.75.75 0 0 1 .75-.75H7a.75.75 0 0 0 0-1.5H4.75Z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors duration-150"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {currentDrafts.length > 0 && (
          <div className="mt-8">
            <NumberedPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftList;
