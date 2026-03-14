import {
  maxValueToDisplay,
  minValueToDisplay,
} from "@/utils/pagination/VisiblePostSetttings";

const ShowMoreButton = ({
  visiblePostsCount,
  setVisiblePostsCount,
  totalPostsOnThisPage,
}: {
  visiblePostsCount: number;
  setVisiblePostsCount: (value: number) => void;
  totalPostsOnThisPage: number;
}) => {
  // Click logic: toggle between min and smartMaximum
  // Button text: based on current vs smartMaximum
  // Max value calculated based on actual number of available posts on the current page.
  const smartMaximum = Math.min(totalPostsOnThisPage, maxValueToDisplay);

  return (
    <div className="flex justify-center w-full mt-10">
      <button
        className="px-8 py-3 bg-slate-100/60 backdrop-blur-md text-slate-700 font-semibold rounded-full shadow-sm hover:shadow-md hover:bg-slate-200/80 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 border border-white/20"
        onClick={() => {
          if (visiblePostsCount === minValueToDisplay) {
            setVisiblePostsCount(smartMaximum);
          } else {
            setVisiblePostsCount(minValueToDisplay);
          }
        }}
      >
        {visiblePostsCount === minValueToDisplay
          ? "Show More Posts"
          : "Show Less Posts"}
      </button>
    </div>
  );
};

export default ShowMoreButton;
