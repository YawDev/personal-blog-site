import SaveDraftToLocalStorage from "@/utils/browser/InMemory";
import { FormMode, IFormState } from "@/utils/forms/FormHelpers";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";

export function SaveDraftButton({
  formState,
  mode,
}: {
  formState: IFormState;
  mode: FormMode;
}) {
  const router = useRouter();

  return formState.validForSubmit && mode === FormMode.Create ? (
    <button
      type="button"
      className="px-8 py-4 text-lg font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
      onClick={() => handleOnClick(router, formState)}
    >
      Save Draft
    </button>
  ) : (
    <></>
  );
}

function handleOnClick(router: AppRouterInstance, formState: IFormState) {
  // Implement save draft logic here, such as saving to localStorage or making an API call
  console.log("Save Draft button clicked");
  let formData = {
    id: uuid(), // Generate a unique ID for the draft
    title: formState.title.value,
    preview: formState.preview.value,
    content: formState.content.value,
    dateSaved: new Date().toISOString(),
  };

  // For demonstration, we'll save the draft to localStorage
  SaveDraftToLocalStorage(formData);

  // Optionally, navigate to a drafts page or show a success message
  router.push(`/blogs/draft/${formData.id}`); // Navigate to drafts page (you would need to create this page)
}
