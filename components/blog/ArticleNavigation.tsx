import Link from "next/dist/client/link";

/**
 * Prev/next article navigation.
 *
 * PARKED — not currently rendered. The markup below is placeholder only
 * (dead "#" links, hardcoded titles). Date-adjacent navigation isn't useful
 * to readers; revisit this with a "related posts" grouping instead of
 * chronological prev/next before wiring it back into BlogDetails.
 */
const ArticleNavigation = () => {
  return (
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
  );
};

export default ArticleNavigation;
