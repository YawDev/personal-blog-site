import React from "react";

const SentEmailCheckmark = () => {
  return (
    <div className="flex items-center justify-center gap-2 text-teal-600">
      <span className="animate-check-pop flex h-7 w-7 items-center justify-center rounded-full bg-teal-600">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            className="animate-check-draw"
            d="M5 13l4 4L19 7"
            style={{ strokeDasharray: 24 }}
          />
        </svg>
      </span>
      <span className="text-sm font-semibold">Email sent!</span>
    </div>
  );
};

export default SentEmailCheckmark;
