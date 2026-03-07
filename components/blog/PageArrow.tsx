import { IPagination } from "@/utils/types";
import { minValueToDisplay } from "@/utils/VisiblePostSetttings";

export function PageArrow({
  direction,
  paginationData,
  setPaginationData,
  setVisiblePostsCount,
}: {
  direction: string;
  paginationData: IPagination;
  setPaginationData: (paginationData: IPagination) => void;
  setVisiblePostsCount: (value: number) => void;
}) {
  const { totalItems, itemsPerPage, currentPage } = paginationData;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (
    direction: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setPaginationData({
      ...paginationData,
      currentPage:
        direction === "right"
          ? paginationData.currentPage + 1
          : paginationData.currentPage - 1,
    });
  };

  const buttonBaseClasses =
    "px-4 py-2 text-base text-teal-600 font-medium hover:text-teal-700 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out rounded-md hover:bg-teal-50";
  const disabledClasses =
    "opacity-50 cursor-not-allowed hover:text-teal-600 hover:scale-100 hover:bg-transparent";

  return direction === "left" ? (
    <button
      onClick={(e) => {
        paginate(direction, e);
        //Reset number of visible posts back to minimum value when user clicks navigates between pages.
        setVisiblePostsCount(minValueToDisplay);
      }}
      className={`${buttonBaseClasses} ${currentPage <= 1 ? `${disabledClasses} invisible` : ""}`}
    >
      ← Previous
    </button>
  ) : (
    <button
      onClick={(e) => {
        paginate(direction, e);
        setVisiblePostsCount(minValueToDisplay);
      }}
      className={`${buttonBaseClasses} ${currentPage >= totalPages ? `${disabledClasses} invisible` : ""}`}
    >
      Next →
    </button>
  );
}
