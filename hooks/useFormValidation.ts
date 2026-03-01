import { useState } from "react";
import { FormValidationResult, IFormState } from "@/app/utils/FormHelpers";

const useFormValidation = (initialValues: {
  title: string;
  preview: string;
  content: string;
}) => {
  const [formState, setFormState] = useState<IFormState>({
    title: { value: initialValues.title, error: "", touched: false },
    preview: { value: initialValues.preview, error: "", touched: false },
    content: { value: initialValues.content, error: "", touched: false },
    validForSubmit: false,
  });

  const handleBlur = (field: string) => {
    setFormState((prev) => {
      // 1. Tell TS 'field' is definitely one of the object keys
      const fieldKey = field as keyof typeof prev;

      // 2. Ensure we only spread if it's NOT the boolean 'validForSubmit'
      if (fieldKey === "validForSubmit") return prev;

      return {
        ...prev,
        [fieldKey]: {
          ...prev[fieldKey], // Now TS knows this is the { error: string } object
          touched: true,
        },
      };
    });
  };

  const handleInputChange = (field: string, value: string) => {
    let input = value;
    setFormState((prev) => {
      const newState = {
        ...prev,
        [field]: {
          value: input,
        },
      };

      return { ...newState };
    });

    let result = FormValidationResult(field, value);

    if (result) {
      setFormState((prev) => {
        const fieldKey = field as keyof typeof prev;

        // 2. Safety check: Don't spread if it's the boolean 'validForSubmit'
        if (fieldKey === "validForSubmit") return prev;

        // 3. Perform the update
        const newState = {
          ...prev,
          [fieldKey]: {
            ...prev[fieldKey], // Now TS knows this is an object { error: string, ... }
            error: result,
            touched: true,
          },
        };

        // 4. Recalculate validForSubmit (Exclude it from the loop)
        const isFormValid =
          newState.title.error === "" &&
          newState.title.value.trim() !== "" &&
          newState.preview.error === "" &&
          newState.content.error === "" &&
          newState.content.value.trim() !== "";
        newState.content.error === "";

        return {
          ...newState,
          validForSubmit: isFormValid,
        };
      });
    } else {
      setFormState((prev) => {
        const newState = {
          ...prev,
          [field]: {
            value,
            error: "",
            touched: true,
          },
        };
        // Update validForSubmit based on all fields
        const isFormValid =
          newState.title.error === "" &&
          newState.title.value.trim() !== "" &&
          newState.preview.error === "" &&
          newState.content.error === "" &&
          newState.content.value.trim() !== "";

        return { ...newState, validForSubmit: isFormValid as any };
      });
    }
  };

  return {
    formState,
    handleInputChange,
    handleBlur,
  };
};

export default useFormValidation;
