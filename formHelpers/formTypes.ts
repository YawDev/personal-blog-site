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
