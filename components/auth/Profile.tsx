import { User } from "@/types/types";

const Profile = ({ user }: { user: User }) => {
  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.userName.slice(0, 2).toUpperCase();

  const isAdmin = user.role === "admin";

  return (
    <section className="bg-gradient-to-br from-teal-50 to-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your account information and details
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

          {/* Avatar + name */}
          <div className="flex flex-col items-center mb-10">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.displayName ?? user.userName}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-100 mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-teal-600 ring-4 ring-teal-100 flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">{initials}</span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {user.displayName ?? user.userName}
            </h2>
            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
              isAdmin ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-500"
            }`}>
              {isAdmin ? "Admin" : "Member"}
            </span>

            <a
              href="/identity/profile/edit"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-teal-600 text-teal-600 text-sm font-semibold hover:bg-teal-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z" />
              </svg>
              Edit Profile
            </a>
          </div>

          <div className="border-t border-gray-100 pt-8 space-y-8">

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Username</p>
                <p className="text-lg text-gray-900 font-medium mt-0.5">@{user.userName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Email</p>
                <p className="text-lg text-gray-900 font-medium mt-0.5">{user.email}</p>
              </div>
            </div>

            {user.displayName && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Display Name</p>
                  <p className="text-lg text-gray-900 font-medium mt-0.5">{user.displayName}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Role</p>
                <p className="text-lg text-gray-900 font-medium mt-0.5">{isAdmin ? "Administrator" : "Member"}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
