import { ILoginFormState, ISignUpFormState } from "@/formHelpers/formTypes";
import { SignUpFormValidationResult } from "@/utils/forms/FormHelpers";
import { useState } from "react";

//Custom hook for SignUp Form
const useSignUpForm = (initialValues: {
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
}) => {
  const [formState, setFormState] = useState<ISignUpFormState>({
    userName: { value: initialValues.userName, error: "", touched: false },
    password: { value: initialValues.password, error: "", touched: false },
    confirmPassword: {
      value: initialValues.confirmPassword,
      error: "",
      touched: false,
    },
    firstName: { value: initialValues.password, error: "", touched: false },
    lastName: { value: initialValues.password, error: "", touched: false },
    email: { value: initialValues.password, error: "", touched: false },
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

    let result = SignUpFormValidationResult(field, value);

    if (field === "confirmPassword" && !result && value !== formState.password.value) {
      result = "Passwords do not match";
    }

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
          newState.userName.error === "" &&
          newState.userName.value.trim() !== "" &&
          newState.password.error === "" &&
          newState.password.value.trim() !== "" &&
          newState.confirmPassword.error === "" &&
          newState.confirmPassword.value.trim() !== "" &&
          newState.firstName.error === "" &&
          newState.firstName.value.trim() !== "" &&
          newState.lastName.error === "" &&
          newState.lastName.value.trim() !== "" &&
          newState.email.error === "" &&
          newState.email.value.trim() !== "";
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
          newState.userName.error === "" &&
          newState.userName.value.trim() !== "" &&
          newState.password.error === "" &&
          newState.password.value.trim() !== "" &&
          newState.confirmPassword.error === "" &&
          newState.confirmPassword.value.trim() !== "" &&
          newState.firstName.error === "" &&
          newState.firstName.value.trim() !== "" &&
          newState.lastName.error === "" &&
          newState.lastName.value.trim() !== "" &&
          newState.email.error === "" &&
          newState.email.value.trim() !== "";

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

export default useSignUpForm;
