const NavBar = () => {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-600 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">
          <a href="/">Personal Blog</a>
        </span>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <a
            href="/blogs"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-100 hover:text-white mr-4"
          >
            View latest Posts
          </a>
          <a
            href="/blogs/create"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-100 hover:text-white mr-4"
          >
            Post new Blog
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
