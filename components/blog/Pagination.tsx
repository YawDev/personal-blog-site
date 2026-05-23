import { IPagination } from "@/types/types";
import { PageArrow } from "./PageArrow";

const Pagination = ({
  paginationData,
  setPaginationData,
  setVisiblePostsCount,
}: {
  paginationData: IPagination;
  setPaginationData: (paginationData: IPagination) => void;
  setVisiblePostsCount: (value: number) => void;
}) => {
  const { totalItems, itemsPerPage, currentPage } = paginationData;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't show pagination if there's only 1 page or no items
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    // Use < - > icon to navigate between pages
    <nav className="flex justify-between items-center w-full">
      <PageArrow
        direction="left"
        paginationData={paginationData}
        setPaginationData={setPaginationData}
        setVisiblePostsCount={setVisiblePostsCount}
      />

      <PageArrow
        direction="right"
        paginationData={paginationData}
        setPaginationData={setPaginationData}
        setVisiblePostsCount={setVisiblePostsCount}
      />
    </nav>
  );
};

export default Pagination;
