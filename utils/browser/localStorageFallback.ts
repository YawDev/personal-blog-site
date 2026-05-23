import { Blog } from "@/types/types";
import { getFromLocalStorage } from "@/utils/browser/LocalStorage";

// Feature flag — flip to `true` to read blogs/drafts from localStorage when the
// API isn't available (handy for local dev before backend endpoints are wired up).
// Leave `false` in production.
export const USE_LOCAL_STORAGE_FALLBACK = false;

const STORAGE_KEYS = {
  blogs: "blogs",
  drafts: "drafts",
} as const;

export const getBlogsFromStorage = (): Blog[] => {
  const blogs = getFromLocalStorage(STORAGE_KEYS.blogs);
  return Array.isArray(blogs) ? blogs : [];
};

export const getBlogByIdFromStorage = (id: string): Blog | null => {
  return getBlogsFromStorage().find((b) => b.id === id) ?? null;
};

export const getDraftByIdFromStorage = (id: string): Blog | null => {
  const drafts = getFromLocalStorage(STORAGE_KEYS.drafts);
  if (!Array.isArray(drafts)) return null;
  return drafts.find((d: Blog) => d.id === id) ?? null;
};
