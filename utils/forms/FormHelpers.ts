export enum FormMode {
  Create = "create",
  EditDraft = "edit-draft",
  EditPublished = "edit-published",
}

export const PostFormValidationResult = (
  field: string,
  value: string,
): string => {
  return getPostFieldError(field, value);
};

const getPostFieldError = (field: string, value: string): string => {
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

export const LoginFormValidationResult = (field: string, value: string) => {
  return getCommonAuthFieldError(field, value);
};

export const SignUpFormValidationResult = (field: string, value: string) => {
  return getSignUpFieldError(field, value);
};

const getSignUpFieldError = (field: string, value: string): string => {
  // Letters, hyphens, apostrophes, spaces — covers names like "O'Brien" or "Mary-Jane"
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ'\- ]{1,50}$/;

  var commonFieldErrorResult = getCommonAuthFieldError(field, value);

  if (commonFieldErrorResult !== "") return commonFieldErrorResult;

  switch (field) {
    case "firstName":
      if (!value) return "First name is required";
      if (!nameRegex.test(value))
        return "First name may only contain letters, hyphens, or apostrophes";
      return "";

    case "lastName":
      if (!value) return "Last name is required";
      if (!nameRegex.test(value))
        return "Last name may only contain letters, hyphens, or apostrophes";
      return "";

    default:
      return "";
  }
};

const getCommonAuthFieldError = (field: string, value: string): string => {
  // Alphanumeric + underscore only, 3–20 chars
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  // Min 8 chars, at least: 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  // Standard email format
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  switch (field) {
    case "userName":
      if (!value) return "Username is required";
      if (!usernameRegex.test(value))
        return "Username must be 3–20 characters: letters, numbers, or underscores only";
      return "";

    case "password":
      if (!value) return "Password is required";
      if (!passwordRegex.test(value))
        return "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character";
      return "";

    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (!passwordRegex.test(value))
        return "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character";
      return "";

    case "email":
      if (!value) return "Email is required";
      if (!emailRegex.test(value)) return "Enter a valid email address";
      return "";

    default:
      return "";
  }
};
