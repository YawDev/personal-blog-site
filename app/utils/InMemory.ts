import { getFromLocalStorage, saveToLocalStorage } from "./LocalStorage";
import { Blog } from "./types";

export const blogsData: Blog[] = [
  {
    id: "1",
    title: "First Blog Post",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    datePosted: new Date("2024-01-01").toISOString(),
    preview:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "2",
    title: "Second Blog Post",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    datePosted: new Date("2024-02-01").toISOString(),
    preview:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "3",
    title: "Third Blog Post",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    datePosted: new Date("2024-03-01").toISOString(),
    preview:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export const savePostsToLocalStorage = (newBlog: Blog) => {
  // For now, we'll just log the form state. Replace with API call when ready.

  const storedBlogs = getFromLocalStorage("blogs");
  let blogsData: Blog[] = [];

  try {
    if (storedBlogs) {
      const parsed = JSON.parse(storedBlogs);
      blogsData = Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn("Invalid blogs data in localStorage, starting fresh:", error);
    blogsData = [];
  }

  blogsData.push(newBlog);
  saveToLocalStorage("blogs", JSON.stringify(blogsData));
};
