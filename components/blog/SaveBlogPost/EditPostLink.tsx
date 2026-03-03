import React from "react";

const EditPostLink = ({ id }: { id: string }) => {
  return (
    <div className="mb-4">
      <a
        href={`/blogs/edit/${id}`}
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
        Edit Post
      </a>
    </div>
  );
};

export default EditPostLink;
