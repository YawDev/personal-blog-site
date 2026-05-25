import Link from "next/link";

const BackToDrafts = ({ currentUserId }: { currentUserId: string }) => {
  return (
    <div className="mb-4">
      <Link
        href={`/drafts?id=${currentUserId}`}
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
        Back to Drafts
      </Link>
    </div>
  );
};

export default BackToDrafts;
