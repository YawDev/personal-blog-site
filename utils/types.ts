// Domain Entities
export interface IPost {
  id: string;
  title: string;
  content: string;
  preview: string;
}

export type Blog = IPost & {
  datePosted: string;
  userId: string;
};

export type Draft = IPost & {
  createdOn: string;
  createdBy: string;
};

export type User = {
  id: string; // GUID
  username: string;
  email: string;
  displayName?: string; // Optional public name for profile display
  avatar?: string; // Optional profile picture URL
  role: "admin" | "user"; // Keep as union type for TypeScript type safety
};

// Pagination
export type IPagination = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
};
