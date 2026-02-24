import BlogItem from "./BlogItem";
import ShowMoreButton from "./ShowMore";

const BlogList = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Posts</h2>
      </div>
      <div className="flex flex-wrap -mx-4">
        <BlogItem />
        <BlogItem />
        <BlogItem />
        <BlogItem />
        <BlogItem /> <BlogItem />
        <ShowMoreButton />
      </div>
    </section>
  );
};

export default BlogList;
