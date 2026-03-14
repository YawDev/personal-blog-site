import { Blog, IPagination } from "../types";

export const GetCurrentItems = (
  filteredBlogs: Blog[],
  paginationData: IPagination,
): Blog[] => {
  const indexOfLastItem =
    paginationData.currentPage * paginationData.itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - paginationData.itemsPerPage;

  const currenItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  return currenItems;
};
