import { Metadata } from "next";
import Link from "next/dist/client/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Yaw Company — a personal blog exploring technology, leadership, and innovation.",
};

export default async function AboutPage() {
  return (
    <main className="bg-white">
      <section className="bg-gradient-to-br from-teal-50 to-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-teal-600">Yaw Company</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            A personal blog at the intersection of technology, leadership, and
            innovation — written to share what I learn as I build.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-14">
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-gray-900">Our mission</h2>
          <p>
            Yaw Company exists to turn hands-on engineering experience into
            clear, practical writing. Every article is grounded in real work —
            the decisions, trade-offs, and lessons that don&apos;t always make
            it into the documentation.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What you&apos;ll find here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Technology
              </h3>
              <p className="text-gray-600">
                Deep dives into backend systems, databases, and the
                architecture behind reliable software.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Leadership
              </h3>
              <p className="text-gray-600">
                Notes on working well with teams, communicating clearly, and
                growing as an engineer.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                Exploring emerging tools and ideas, and what they mean for the
                way we build.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6 text-lg text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-gray-900">About the author</h2>
          <p>
            I&apos;m Jason Ampah, a backend-focused software engineer and
            aspiring full-stack developer. I enjoy building dependable systems
            with .NET and relational databases — this blog runs on PostgreSQL,
            though I work across SQL databases more broadly — and I&apos;m
            steadily expanding into the front end. This site is both a place to
            share ideas and a working portfolio of the kind of software I like
            to build.
          </p>
          <p>
            Have a question, a correction, or just want to say hello?{" "}
            <Link
              href="/contact"
              className="text-teal-600 font-medium hover:text-teal-800"
            >
              Get in touch
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
