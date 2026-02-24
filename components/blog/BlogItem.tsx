const BlogItem = () => {
  return (
    // <article className="container mx-auto px-4 max-w-4xl">
    //   {/* Your blog post content goes here */}
    // </article>
    <div key={1} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
      {/* Very subtle background */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2 text-slate-800">
            {"test title"}
          </h2>
          <p className="text-slate-600 leading-relaxed">
            {"Article preview here."}
          </p>
          <a className="text-blue-600 hover:text-blue-800 mt-4 inline-block font-semibold transition-colors cursor-pointer">
            Read More →
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
