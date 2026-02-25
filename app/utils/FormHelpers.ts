export enum FormMode {
  Create = "create",
  EditDraft = "edit-draft",
  EditPublished = "edit-published",
}

export interface IFormState {
  title: FormField;
  preview: FormField;
  content: FormField;
  validForSubmit: false;
}

export type FormField = {
  value: string;
  error: string;
};
