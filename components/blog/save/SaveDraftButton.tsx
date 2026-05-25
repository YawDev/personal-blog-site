import { IPostFormState } from "@/formHelpers/formTypes";
import { createDraftApi } from "@/service/PersonalBlogService";
import { Draft } from "@/types/types";
import SaveDraftToLocalStorage from "@/utils/browser/InMemory";
import { FormMode } from "@/utils/forms/FormHelpers";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";

export function SaveDraftButton({
  formState,
  mode,
  userId,
}: {
  formState: IPostFormState;
  mode: FormMode;
  userId: string | undefined;
}) {
  const router = useRouter();

  return formState.validForSubmit && mode === FormMode.Create ? (
    <button
      type="button"
      className="px-8 py-4 text-lg font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
      onClick={() => handleOnClick(router, formState, userId)}
    >
      Save Draft
    </button>
  ) : (
    <></>
  );
}

async function handleOnClick(
  router: AppRouterInstance,
  formState: IPostFormState,
  userId: string | undefined,
) {
  let formData = {
    title: formState.title.value,
    preview: formState.preview.value,
    content: formState.content.value,
  };

  var result = await createDraftApi(userId ?? "", formData);

  // // For demonstration, we'll save the draft to localStorage
  // SaveDraftToLocalStorage(formData);

  // Optionally, navigate to a drafts page or show a success message
  if (result.status === 200 || result.status === 201)
    router.push(`/blogs/draft/${result.newDraftId}`);
  else {
    // Show an Alert box or error message to the user if saving the draft failed
    alert("Failed to save draft.");
  }
}
