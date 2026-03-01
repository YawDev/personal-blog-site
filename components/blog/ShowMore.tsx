import React from "react";

const ShowMoreButton = () => {
  return (
    <div className="flex justify-center w-full mt-10">
      <button className="px-8 py-3 bg-slate-100/60 backdrop-blur-md text-slate-700 font-semibold rounded-full shadow-sm hover:shadow-md hover:bg-slate-200/80 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 border border-white/20">
        Show More Posts
      </button>
    </div>
  );
};

export default ShowMoreButton;
