import React from "react";

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
          <a
            href="#about"
            className="text-teal-100 hover:text-white transition-colors"
          >
            About
          </a>
          <a
            href="#privacy"
            className="text-teal-100 hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a
            href="#contact"
            className="text-teal-100 hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
