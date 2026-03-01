export enum FormMode {
  Create = "create",
  EditDraft = "edit-draft",
  EditPublished = "edit-published",
}

export interface IFormState {
  title: FormField;
  preview: FormField;
  content: FormField;
  validForSubmit: boolean;
}

export type FormField = {
  value: string;
  error: string;
  touched: boolean;
};

export const FormValidationResult = (field: string, value: string): string => {
  return getFieldError(field, value);
};

const getFieldError = (field: string, value: string): string => {
  const alphaumericRegex = /^[a-zA-Z0-9\s.,!?':"()-]+$/;

  switch (field) {
    case "title":
      if (!value) return "Title is required";
      if (!alphaumericRegex.test(value))
        return "Only letters, numbers, and basic punctuation allowed";
      if (value.length < 5) return "Title must be at least 5 characters";

      return "";

    case "preview":
      if (value && !alphaumericRegex.test(value))
        return "Only letters, numbers, and basic punctuation allowed";
      if (value && value.length > 100)
        return "Preview must be under 100 characters";

      return "";

    case "content":
      if (!value) return "Content is required";
      if (!alphaumericRegex.test(value))
        return "Only letters, numbers, and basic punctuation allowed";
      if (value.length < 20) return "Content is too short";
      return "";

    default:
      return "";
  }
};
