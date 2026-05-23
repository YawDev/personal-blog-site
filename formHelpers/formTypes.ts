export type TextAreaFormFieldProps = {
  type: string;
  id: string;
  name: string;
  rows?: number;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  formError?: string;
};

export type InputFormFieldProps = {
  type: string;
  id: string;
  name: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  formError?: string;
};

export type FormLabelProps = {
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
};

export interface IPostFormState {
  title: FormField;
  preview: FormField;
  content: FormField;
  validForSubmit: boolean;
}

export interface ILoginFormState {
  userName: FormField;
  password: FormField;
  resetPassword: boolean;
  validForSubmit: boolean;
}

export interface ISignUpFormState {
  userName: FormField;
  password: FormField;
  firstName: FormField;
  lastName: FormField;
  email: FormField;
  confirmPassword: FormField;
  validForSubmit: boolean;
}

export interface IEditProfileFormState {
  userName: FormField;
  firstName: FormField;
  lastName: FormField;
  email: FormField;
  validForSubmit: boolean;
}

export type FormField = {
  value: string;
  error: string;
  touched: boolean;
};
