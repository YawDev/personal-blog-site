import { FormMode, IFormState } from "@/app/utils/FormHelpers";

const PublishArticleButton = ({
  formState,
  mode,
}: {
  formState: IFormState;
  mode: FormMode;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
      {/* Once save draft functionality is implemented, button will be triggered when form input is valid */}
      <button
        type="submit"
        className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
          !formState.validForSubmit
            ? "text-gray-400 bg-gray-300 cursor-not-allowed opacity-60 shadow-none"
            : "text-white bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl cursor-pointer"
        }`}
        disabled={!formState.validForSubmit}
      >
        {mode === FormMode.EditPublished ? "Update Article" : "Publish Article"}
      </button>
    </div>
  );
};

export default PublishArticleButton;
