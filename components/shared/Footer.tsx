import React from "react";
import Link from "next/dist/client/link";

const Footer = () => {
  return (
    <footer className="bg-teal-600 p-6 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-tight">
            Yaw Company
          </span>
          <span className="text-teal-100">|</span>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex gap-6">
          <Link
            href="/about"
            className="text-teal-100 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-teal-100 hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="text-teal-100 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
