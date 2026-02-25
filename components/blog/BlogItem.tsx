import { Blog } from "@/app/utils/types";

const BlogItem = ({ blog }: { blog: Blog }) => {
  return (
    // <article className="container mx-auto px-4 max-w-4xl">
    //   {/* Your blog post content goes here */}
    // </article>
    <div key={blog.id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
      {/* Very subtle background */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2 text-slate-800">
            {blog.title}
          </h2>
          <p className="text-slate-600 leading-relaxed">
            {blog.preview ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
          </p>
          <a
            href={`/blogs/${blog.id}`}
            className="text-blue-600 hover:text-blue-800 mt-4 inline-block font-semibold transition-colors cursor-pointer"
          >
            Read More →
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
