import React from "react";

const ArticleFooter = () => {
  return (
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
  );
};

export default ArticleFooter;
