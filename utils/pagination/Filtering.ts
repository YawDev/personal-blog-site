import { Blog, IPagination } from "../../types/types";

export const GetCurrentItems = (
  filteredBlogs: Blog[],
  paginationData: IPagination,
): Blog[] => {
  if (!Array.isArray(filteredBlogs)) {
    return [];
  }

  const indexOfLastItem =
    paginationData.currentPage * paginationData.itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - paginationData.itemsPerPage;

  const currenItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  return currenItems;
};
