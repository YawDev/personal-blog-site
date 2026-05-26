import WritingTips from "./WritingTips";
import { InputFormField, TextAreaFormField } from "./InputFormField";

import PublishArticleButton from "./PublishArticleButton";
import { useRouter } from "next/navigation";
import { SaveDraftButton } from "./SaveDraftButton";
import { savePostToLocalStorage } from "@/utils/browser/InMemory";
import { FormMode } from "@/utils/forms/FormHelpers";
import { IPostFormState } from "@/formHelpers/formTypes";
import {
  createPostApi,
  editDraftApi,
  editPostApi,
  publishDraftApi,
} from "@/service/PersonalBlogService";
import { useAuth } from "@/providers/auth-provider";
import {
  Alert,
  Blog,
  PublishPostResponse,
  SaveDraftResponse,
  SavePostResponse,
} from "@/types/types";
import { useEffect, useState } from "react";
import AlertMessage from "@/components/shared/AlertMessage";

const SaveFormCard = ({
  mode,
  formState,
  handleInputChange,
  handleBlur,
  blogData,
}: {
  mode: FormMode;
  formState: IPostFormState;
  handleInputChange: any;
  handleBlur: any;
  blogData: Blog | null;
}) => {
  const postIdParam = blogData?.id;
  const router = useRouter();
  const { user } = useAuth();
  const [alert, setAlert] = useState<Alert>({
    show: false,
    message: "",
    apiStatus: 0,
  });

  const [autoSaveMessage, setAutoSaveMessage] = useState<string>("");

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  useEffect(() => {
    if (autoSaveMessage) {
      const timer = setTimeout(() => {
        setAutoSaveMessage("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [autoSaveMessage]);

  const handleCreatePost = async (): Promise<SavePostResponse> => {
    let result = await createPostApi(user?.id || "", {
      title: formState.title.value,
      content: formState.content.value,
      preview: formState.preview.value,
      id: "",
      datePosted: "",
      userId: user?.id || "",
    });

    return result;
  };

  const handleEditPost = async (): Promise<SavePostResponse> => {
    let result = await editPostApi(user?.id || "", {
      title: formState.title.value,
      content: formState.content.value,
      preview: formState.preview.value,
      id: postIdParam || "",
      datePosted: blogData?.datePosted || "",
      userId: blogData?.userId || "",
    });

    return result;
  };

  const handleAutoSaveDraft = async (): Promise<SaveDraftResponse> => {
    var draftId = postIdParam;
    let result = await editDraftApi(user?.id || "", {
      title: formState.title.value,
      content: formState.content.value,
      preview: formState.preview.value,
      id: draftId || "",
      createdOn: blogData?.datePosted || "",
      userId: blogData?.userId || "",
    });

    return result;
  };

  const handlePublishDraft = async (): Promise<PublishPostResponse> => {
    let result = await publishDraftApi(user?.id || "", {
      title: formState.title.value,
      content: formState.content.value,
      preview: formState.preview.value,
      draftId: postIdParam || "",
    });

    return result;
  };

  useEffect(() => {
    // Used to call edit draft api to autosave drafts after form changes and user stops typing for 5 seconds. Only applies to EditDraft mode.
    if (mode === FormMode.EditDraft && formState.validForSubmit) {
      const timer = setTimeout(async () => {
        let result = await handleAutoSaveDraft();
        if (result.status === 200) {
          setAutoSaveMessage("Draft auto-saved successfully.");
        } else {
          setAutoSaveMessage("Failed to auto-save draft.");
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [mode, formState]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <form
        className="space-y-8"
        onSubmit={async (e) => {
          e.preventDefault();
          // Handle form submission logic here
          //savePostToLocalStorage(mode, formState, idParam, router);
          if (mode === FormMode.Create) {
            let result = await handleCreatePost();
            if (result.status === 200) {
              router.push("/blogs");
            } else {
              //handle error case, show alert or something
              setAlert({
                show: true,
                message: result.message,
                apiStatus: result.status,
              });
            }
          }

          if (mode === FormMode.EditPublished) {
            let result = await handleEditPost();
            if (result.status === 200) {
              router.push(`/blogs/${postIdParam}`);
            } else {
              //handle error case, show alert or something
              setAlert({
                show: true,
                message: result.message,
                apiStatus: result.status,
              });
            }
          }

          if (mode === FormMode.EditDraft) {
            let result = await handlePublishDraft();
            if (result.status === 200) {
              router.push(`/blogs/${result.postGuid}`);
            } else {
              //handle error case, show alert or something
              setAlert({
                show: true,
                message: result.message,
                apiStatus: result.status,
              });
            }
          }
        }}
      >
        <div className="max-w-md mx-auto">
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              alert.show
                ? "mb-4 max-h-24 opacity-100"
                : "mb-0 max-h-0 opacity-0"
            }`}
          >
            <AlertMessage
              message={alert.message}
              variant={alert.apiStatus !== 200 ? "error" : "default"}
            />
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              autoSaveMessage
                ? "mb-4 max-h-24 opacity-100"
                : "mb-0 max-h-0 opacity-0"
            }`}
          >
            <AlertMessage message={autoSaveMessage} variant="default" />
          </div>
        </div>
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
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
          <SaveDraftButton
            formState={formState}
            mode={mode}
            userId={user?.id}
          />
          <PublishArticleButton formState={formState} mode={mode} />
        </div>
      </form>

      {/* Writing Tips */}
      <WritingTips />
    </div>
  );
};

export default SaveFormCard;
