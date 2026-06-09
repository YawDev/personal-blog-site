import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Yaw Company.",
};

// TODO: confirm these point at your real profiles before sharing the site.
const socials = {
  email: "jason.ampah.dev@gmail.com",
  github: "https://github.com/YawDev",
  linkedin: "https://www.linkedin.com/in/jasonampah",
};

export default async function ContactPage() {
  return (
    <main className="bg-white">
      <section className="bg-gradient-to-br from-teal-50 to-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in <span className="text-teal-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Questions, feedback, or just want to connect? I&apos;d love to hear
            from you — pick whichever channel works best.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href={`mailto:${socials.email}`}
            className="block bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:border-teal-300 hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Email</h2>
            <p className="text-teal-600 break-words">{socials.email}</p>
          </a>

          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:border-teal-300 hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">GitHub</h2>
            <p className="text-teal-600">See what I&apos;m building</p>
          </a>

          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:border-teal-300 hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              LinkedIn
            </h2>
            <p className="text-teal-600">Let&apos;s connect</p>
          </a>
        </div>

        <p className="mt-10 text-center text-gray-600">
          I read every message and usually reply within a few days. This site is
          a personal portfolio project, so please don&apos;t share sensitive
          information.
        </p>
      </section>
    </main>
  );
}
