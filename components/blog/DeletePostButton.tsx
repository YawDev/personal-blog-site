import { deletePostApi } from "@/service/PersonalBlogService";
import { useRouter } from "next/dist/client/components/navigation";
import router from "next/dist/shared/lib/router/router";

const DeletePostButton = ({
  postId,
  userId,
  handleDeleteClick,
}: {
  postId: string;
  userId: string;
  handleDeleteClick?: () => void;
}) => {
  const router = useRouter();
  // const handleDelete = async () => {
  //   // if (!confirm("Are you sure you want to delete this post?")) {
  //   //   return;
  //   // }
  //   const response = await deletePostApi(postId, userId);
  //   if (response) {
  //     alert("Post deleted successfully.");
  //     router.push("/blogs"); // Redirect to homepage or posts list
  //   } else {
  //     alert("Failed to delete the post. Please try again.");
  //   }
  // };

  const handleDelete = async () => {};

  return (
    <button
      type="button"
      onClick={handleDeleteClick}
      className="inline-flex items-center gap-2 text-red-600 text-sm font-semibold hover:text-red-800 transition-colors duration-200 cursor-pointer"
    >
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
        />
      </svg>{" "}
      Delete Post
    </button>
  );
};

export default DeletePostButton;
