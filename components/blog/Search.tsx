export default function BlogSearch({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title..."
            className="w-full pl-14 pr-32 py-4 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
          />

          {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <button
              type="button"
              className="px-5 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 shadow-sm"
            >
              Search
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
