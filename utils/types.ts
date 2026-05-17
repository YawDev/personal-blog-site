import { Dispatch, SetStateAction } from "react";

// General Types
export type Alert = {
  show: boolean;
  message: string;
  apiStatus: number;
};

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
  userName: string;
  email: string;
  displayName?: string; // Optional public name for profile display
  avatar?: string; // Optional profile picture URL
  role: "admin" | "user"; // Keep as union type for TypeScript type safety
};

//User Auth
export type LoginRequest = {
  userName: string;
  password: string;
};

export type SignUpRequest = {
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
};

// Pagination
export type IPagination = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
};

// API Error Response
export type LoginResponse = {
  status: number;
  data: User | null;
  message: string;
};

export type SignUpResponse = {
  status: number;
  message: string;
};

// User Context
export interface IUserContext {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (value: User | null) => void;
}

// BFF types
export type UpstreamLoginResponse = {
  user?: {
    id?: string;
    userName?: string;
    email?: string;
    Email?: string;
  };
  message?: string;
};

export type UpstreamBlogsResponse = {
  blogs?: [];
  message?: string;
};

export type UpstreamBlogByIdResponse = {
  blog?: {
    id: string;
    title: string;
    content: string;
    preview: string;
    datePosted: string;
    userId: string;
  };
  message?: string;
};
