import WritingTips from "./WritingTips";
import { InputFormField, TextAreaFormField } from "./InputFormField";
import { FormMode, IFormState } from "@/app/utils/FormHelpers";

import PublishArticleButton from "./PublishArticleButton";
import { useRouter } from "next/navigation";
import { savePostToLocalStorage } from "@/app/utils/InMemory";

const SaveFormCard = ({
  mode,
  formState,
  handleInputChange,
  handleBlur,
  idParam,
}: {
  mode: FormMode;
  formState: IFormState;
  handleInputChange: any;
  handleBlur: any;
  idParam?: string;
}) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          // Handle form submission logic here
          savePostToLocalStorage(mode, formState, idParam, router);
        }}
      >
        {/* Title Field */}
        <InputFormField
          formLabelProps={{
            htmlFor: "title",
            className: "block text-lg font-semibold text-gray-900 mb-3",
            children: "Article Title",
          }}
          inputFormProps={{
            type: "text",
            id: "title",
            name: "title",
            placeholder: "Enter an engaging title for your article...",
            value: formState.title.value,
            onChange: (value: string) => handleInputChange("title", value),
            onBlur: () => handleBlur("title"),
            className: `w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-0 outline-none transition-colors duration-200 ${
              formState.title.error
                ? "border-red-300 focus:border-red-500 hover:border-red-400"
                : "border-gray-200 focus:border-teal-500 hover:border-gray-300"
            }`,
            formError: formState.title.error,
          }}
        />
        {/* Preview Field */}
        <TextAreaFormField
          formLabelProps={{
            htmlFor: "preview",
            className: "block text-lg font-semibold text-gray-900 mb-3",
            children: (
              <>
                Article Summary
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Optional)
                </span>
              </>
            ),
          }}
          inputFormProps={{
            type: "text",
            id: "preview",
            name: "preview",
            rows: 4,
            placeholder:
              "Write a compelling summary that will entice readers to click and read more...",
            value: formState.preview.value,
            onChange: (value: string) => handleInputChange("preview", value),
            onBlur: () => handleBlur("preview"),
            className: `w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-0 outline-none transition-colors duration-200 resize-none ${
              formState.preview.error
                ? "border-red-300 focus:border-red-500 hover:border-red-400"
                : "border-gray-200 focus:border-teal-500 hover:border-gray-300"
            }`,
            formError: formState.preview.error,
          }}
        />
        {/* Content Field */}
        <TextAreaFormField
          formLabelProps={{
            htmlFor: "content",
            className: "block text-lg font-semibold text-gray-900 mb-3",
            children: "Article Content",
          }}
          inputFormProps={{
            type: "text",
            id: "content",
            name: "content",
            rows: 16,
            placeholder:
              "Start writing your article here. Share your insights, experiences, and expertise...",
            value: formState.content.value,
            onChange: (value: string) => handleInputChange("content", value),
            onBlur: () => handleBlur("content"),
            className: `w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-0 outline-none transition-colors duration-200 resize-y ${formState.content.error ? "border-red-300 focus:border-red-500 hover:border-red-400" : "border-gray-200 focus:border-teal-500 hover:border-gray-300"}`,
            formError: formState.content.error,
          }}
        />
        {/* Action Buttons */}
        <PublishArticleButton formState={formState} mode={mode} />
      </form>

      {/* Writing Tips */}
      <WritingTips />
    </div>
  );
};

export default SaveFormCard;
