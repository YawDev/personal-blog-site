import React from "react";

const CallToAction = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
          Stay Ahead of the Curve
        </h2>
        <p className="text-xl text-black mb-8 leading-relaxed max-w-2xl mx-auto">
          Join thousands of professionals who rely on our insights to navigate
          the ever-evolving landscape of technology, leadership, and innovation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <div className="bg-white border border-gray-300 rounded-lg p-6 text-center max-w-sm">
            <h3 className="text-lg font-semibold text-black mb-2">
              Weekly Newsletter
            </h3>
            <p className="text-black text-sm mb-4">
              Curated insights delivered directly to your inbox every Tuesday.
            </p>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6 text-center max-w-sm">
            <h3 className="text-lg font-semibold text-black mb-2">
              Expert Analysis
            </h3>
            <p className="text-black text-sm mb-4">
              Deep dives into emerging trends and practical frameworks.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="email"
            placeholder="Enter your email address"
            className="px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-teal-300 outline-none min-w-80"
          />
          <button className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Subscribe Now
          </button>
        </div>
        <p className="text-black text-sm mt-4">
          No spam, ever. Unsubscribe anytime with one click.
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
