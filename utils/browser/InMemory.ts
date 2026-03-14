import { FormMode } from "../forms/FormHelpers";
import { Blog } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "./LocalStorage";
import { v4 as uuid } from "uuid";

export const savePostToLocalStorage = (
  mode: FormMode,
  formState: any,
  idParam?: string,
  router?: any,
) => {
  switch (mode) {
    case FormMode.Create:
      // For now, we'll just log the form state. Replace with API call when ready.
      const newBlog: Blog = {
        id: uuid(),
        title: formState.title.value,
        preview: formState.preview.value,
        content: formState.content.value,
        datePosted: new Date().toISOString(),
        userId: "",
      };
      saveNewPostToLocalStorage(newBlog);
      router.push(`/blogs/${newBlog.id}`);
      break;
    case FormMode.EditDraft:
      //Delete draft before publishing post
      deleteDraftFromLocalStorage(idParam as string);

      let newBlogId = uuid();
      saveNewPostToLocalStorage({
        id: newBlogId,
        title: formState.title.value,
        preview: formState.preview.value,
        content: formState.content.value,
        datePosted: new Date().toISOString(),
        userId: "",
      });
      router.push(`/blogs/${newBlogId}`);
      break;
    case FormMode.EditPublished:
      idParam &&
        editPostInLocalStorage({
          idParam: idParam!,
          title: formState.title.value,
          preview: formState.preview.value,
          content: formState.content.value,
        });
      router.push(`/blogs/${idParam}`);
      break;
    default:
      console.error("Unknown form mode:", mode);
  }
};

export const saveNewPostToLocalStorage = (newBlog: Blog) => {
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

export const editPostInLocalStorage = ({
  idParam,
  title,
  preview,
  content,
}: {
  idParam: string;
  title: string;
  preview: string;
  content: string;
}) => {
  const storedBlogs = getFromLocalStorage("blogs");
  let blogsData: Blog[] = [];

  try {
    if (storedBlogs) {
      const parsed = JSON.parse(storedBlogs);
      blogsData = Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn("Invalid blogs data in localStorage, cannot edit:", error);
    return;
  }

  const blogIndex = blogsData.findIndex((b) => b.id === idParam);
  if (blogIndex !== -1) {
    blogsData[blogIndex] = {
      ...blogsData[blogIndex],
      title: title,
      preview: preview,
      content: content,
    };
    saveToLocalStorage("blogs", JSON.stringify(blogsData));
  } else {
    console.error("Blog not found for updating draft:", idParam);
  }
};

const SaveDraftToLocalStorage = (newDraft: any) => {
  const storedDrafts = getFromLocalStorage("drafts");
  let draftsData = [];

  try {
    if (storedDrafts) {
      const parsed = JSON.parse(storedDrafts);
      draftsData = Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn("Invalid drafts data in localStorage, starting fresh:", error);
    draftsData = [];
  }

  draftsData.push(newDraft);
  saveToLocalStorage("drafts", JSON.stringify(draftsData));
};

export default SaveDraftToLocalStorage;

export function deleteDraftFromLocalStorage(idParam: string) {
  const storedDrafts = getFromLocalStorage("drafts");
  let foundDrafts: any[] = [];

  try {
    if (storedDrafts) {
      const parsed = JSON.parse(storedDrafts);
      foundDrafts = Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn("Invalid draft in localStorage, cannot delete:", error);
    return;
  }

  foundDrafts = foundDrafts.filter((d: any) => d.id !== idParam);
  saveToLocalStorage("drafts", JSON.stringify(foundDrafts));
  console.log("draft with id: " + { idParam } + " deleted");
}
