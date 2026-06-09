import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Yaw Company handles your data.",
};

export default async function PrivacyPage() {
  return (
    <main className="bg-white">
      <section className="bg-gradient-to-br from-teal-50 to-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy <span className="text-teal-600">Policy</span>
          </h1>
          <p className="text-lg text-gray-600">Last updated: June 8, 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 lg:px-8 py-14">
        <div className="space-y-10 text-gray-700 leading-relaxed">
          <p className="text-lg">
            This is a personal portfolio project, and this policy reflects what
            the application actually does — nothing more. It explains the
            limited data the site handles and how it&apos;s used.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Information we collect
            </h2>
            <p>
              We only collect what&apos;s needed for the features you choose to
              use:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <span className="font-medium">Account details</span> — if you
                register, we store your email address, username, and an optional
                display name so you can sign in and publish posts.
              </li>
              <li>
                <span className="font-medium">Content you create</span> — the
                blog posts you write are saved so they can be displayed on the
                site.
              </li>
            </ul>
            <p className="mt-3">
              We don&apos;t use analytics, tracking pixels, or advertising, and
              we never sell your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Cookies and authentication
            </h2>
            <p>
              When you log in, the site sets a single secure, HttpOnly session
              cookie that keeps you signed in for a short period. It exists only
              to authenticate your requests — it isn&apos;t used to track you
              across the web, and there are no third-party cookies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              How your data is stored
            </h2>
            <p>
              Account information and posts are stored in a PostgreSQL database.
              Passwords are never stored in plain text — authentication is
              handled through ASP.NET Core Identity, which hashes credentials.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your choices
            </h2>
            <p>
              You can stop using your account at any time. If you&apos;d like
              your account and associated content removed, reach out via the{" "}
              <a
                href="/contact"
                className="text-teal-600 font-medium hover:text-teal-800"
              >
                contact page
              </a>{" "}
              and we&apos;ll take care of it.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              A note on this demo
            </h2>
            <p>
              Because this is a portfolio demonstration rather than a production
              service, please avoid submitting real sensitive information. Use a
              throwaway email and password if you&apos;d like to try the
              account features.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
