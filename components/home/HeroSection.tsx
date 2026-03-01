import React from "react";
import CallToAction from "./CallToAction";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-teal-50 to-white py-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Insights, Ideas, and <span className="text-teal-600">Innovation</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
          Exploring the intersection of technology, creativity, and professional
          growth through thoughtful analysis and practical insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/blogs"
            className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Read Latest Articles
          </a>
          <a
            href="#featured"
            className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-600 hover:text-white transition-colors duration-300"
          >
            Featured Content
          </a>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
            <div className="text-gray-600">Quality Articles</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">10K+</div>
            <div className="text-gray-600">Monthly Readers</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">5+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
