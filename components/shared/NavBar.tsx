"use client";
import { useAuth } from "@/providers/auth-provider";
import { logoutApi } from "@/service/PersonalBlogService";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { isLoggedIn, isLoading, setUser, user } = useAuth();
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-600 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">
          <Link
            href="/"
            className="transition-all duration-300 hover:scale-105 hover:text-teal-100 active:scale-95"
          >
            Personal Blog
          </Link>
        </span>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex lg:items-center lg:w-full">
          <div className="lg:flex-grow">
            <Link
              href="/blogs"
              className="relative block mt-4 lg:inline-block lg:mt-0 text-teal-100 hover:text-white mr-4 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-lg hover:scale-105 active:scale-95 active:bg-teal-800"
            >
              View latest Posts
            </Link>

            {!isLoading && isLoggedIn && (
              <>
                <Link
                  href="/blogs/create"
                  className="relative block mt-4 lg:inline-block lg:mt-0 text-teal-100 hover:text-white mr-4 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-lg hover:scale-105 active:scale-95 active:bg-teal-800"
                >
                  Post a Blog
                </Link>

                <Link
                  href={`/drafts?id=${user?.id}`}
                  className="relative block mt-4 lg:inline-block lg:mt-0 text-teal-100 hover:text-white mr-4 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-lg hover:scale-105 active:scale-95 active:bg-teal-800"
                >
                  Unpublished Posts
                </Link>
              </>
            )}
          </div>

          <div className="mt-4 flex gap-2 lg:mt-0 lg:ml-auto">
            {isLoading ? null : isLoggedIn ? (
              <>
                <button
                  onClick={async () => {
                    // Add your logout logic here
                    await logoutApi();
                    setUser(null);
                    router.push("/identity/login");
                  }}
                  className="inline-block rounded-lg border border-teal-200 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-teal-700"
                >
                  Logout
                </button>
                <Link
                  href="/identity/profile"
                  className="inline-block rounded-lg bg-white px-4 py-2 font-semibold text-teal-700 transition-colors duration-200 hover:bg-teal-50"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/identity/login"
                  className="inline-block rounded-lg border border-teal-200 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-teal-700"
                >
                  Login
                </Link>
                <Link
                  href="/identity/signup"
                  className="inline-block rounded-lg bg-white px-4 py-2 font-semibold text-teal-700 transition-colors duration-200 hover:bg-teal-50"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
