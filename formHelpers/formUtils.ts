import { FormMode } from "@/app/utils/FormHelpers";

const setPageTitle = (mode: FormMode) => {
  switch (mode) {
    case FormMode.Create:
      return "Create New Article";
    case FormMode.EditDraft:
      return "Edit Saved Draft";
    case FormMode.EditPublished:
      return "Edit Published Article";
    default:
      return "Article Form";
  }
};

export default setPageTitle;
