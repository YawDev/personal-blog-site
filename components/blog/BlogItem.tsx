import { Blog, User } from "@/types/types";
import Link from "next/link";

const gradients = [
  "from-teal-100 to-teal-200",
  "from-blue-100 to-blue-200",
  "from-slate-100 to-teal-100",
  "from-teal-100 to-blue-100",
  "from-slate-100 to-slate-200",
];

const BlogItem = ({
  blog,
  currentUser,
}: {
  blog: Blog;
  currentUser: User | null;
}) => {
  const user = currentUser;
  const gradient = gradients[blog.id.charCodeAt(0) % gradients.length];
  return (
    // <article className="container mx-auto px-4 max-w-4xl">
    //   {/* Your blog post content goes here */}
    // </article>
    <div key={blog.id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
      {/* Very subtle background */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Placeholder cover image */}
        <div
          className={`bg-gradient-to-br ${gradient} h-40 w-full flex items-center justify-center`}
        >
          <svg
            className="w-12 h-12 text-teal-500 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div className="p-6 flex flex-col h-[calc(100%-10rem)]">
          <h2 className="text-xl font-bold mb-2 text-slate-800">
            {blog.title}
          </h2>
          <p className="text-slate-600 leading-relaxed">
            {blog.preview || "No Preview Available"}
          </p>
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
            <p className="text-xs font-medium text-teal-600">
              By <span className="font-semibold">{blog.author}</span>
            </p>
            <p className="text-xs text-slate-400">
              {new Date(blog.datePosted).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <Link
            href={`/blogs/${blog.id}`}
            className="text-blue-600 hover:text-blue-800 mt-3 inline-block font-semibold transition-colors cursor-pointer"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
