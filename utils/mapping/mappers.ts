import { Blog, Draft, User } from "../../types/types";

export const normalizePosts = (payload: any): Blog[] => {
  const data = payload?.blogs || [];

  return data.map((item: any) => ({
    id: item.id || item.id,
    title: item.title || item.Title,
    content: item.content || item.Content,
    preview: item.preview || item.Preview,
    datePosted: item.datePosted || item.DatePosted,
    author: item.author || item.Author,
    userId: item.userId || item.UserId,
  }));
};

export const normalizePost = (payload: any): Blog => {
  const data = payload?.blog;
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    preview: data.preview,
    datePosted: data.datePosted,
    author: data.author || data.Author,
    userId: data.userId,
  };
};

export const normalizeUser = (payload: any): User => {
  const data = payload?.User || payload?.user; // Handle both cases
  console.log(payload, "payload received");

  if (!data) {
    throw new Error("User data not found in response");
  }

  return {
    id: data.Id || data.id,
    userName: data.UserName || data.userName,
    email: data.Email || data.email,
    displayName: data.displayName,
    avatar: data.avatar,
    role: data.role || "user", // Default role since backend doesn't provide it
  };
};

export const normalizeDrafts = (payload: any): Draft[] => {
  const data = payload?.unfinishedDrafts || [];

  return data.map((item: any) => ({
    id: item.id || item.id,
    title: item.title || item.Title,
    content: item.content || item.Content,
    preview: item.preview || item.Preview,
    createdOn: item.createdOn || item.CreatedOn,
    userId: item.userId || item.UserId,
  }));
};

export const normalizeDraft = (payload: any): Draft => {
  const data = payload?.draft;
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    preview: data.preview,
    createdOn: data.createdOn,
    userId: data.userId,
  };
};
