import { ILoginFormState } from "@/formHelpers/formTypes";
import { LoginFormValidationResult } from "@/utils/forms/FormHelpers";
import { useState } from "react";

// Custom hook for Login Form
//
// WHAT IS A CUSTOM HOOK?
// A custom hook is a plain JS function whose name starts with "use".
// The "use" prefix lets it call React hooks (useState, useEffect, etc.) inside.
// By extracting form logic here, the LoginForm component only handles JSX —
// all "what happens when the user types / blurs" lives in this file.
//
// HOW A COMPONENT USES THIS HOOK:
//   const { formState, handleInputChange, handleBlur } = useLoginForm(initialValues);
// Whenever formState changes React re-renders the component — the component
// always sees the freshest snapshot without managing any state itself.
const useLoginForm = (initialValues: {
  userName: string;
  password: string;
  resetPassword: boolean;
}) => {
  // useState gives us the current state snapshot (formState) and the setter
  // (setFormState). Calling setFormState never changes formState mid-execution —
  // it schedules a React re-render where formState will hold the new value.
  //
  // This form is simpler than SignUp: only two text fields.
  // resetPassword is a plain boolean (no value/error/touched shape) and is
  // guarded against in the handlers below just like validForSubmit.
  const [formState, setFormState] = useState<ILoginFormState>({
    userName: { value: initialValues.userName, error: "", touched: false },
    password: { value: initialValues.password, error: "", touched: false },
    resetPassword: false,
    validForSubmit: false,
  });

  // handleBlur fires when the user leaves (blurs) an input field.
  // Its sole purpose is to flip touched: true so the UI can start showing
  // validation errors for that field.
  //
  // RE-RENDER ORDER:
  //   1. User leaves the input → browser fires the blur event
  //   2. React calls handleBlur(field)
  //   3. setFormState(updater) queues the updater — formState is still unchanged
  //   4. handleBlur returns
  //   5. React applies the queued updater and re-renders once with touched: true
  const handleBlur = (field: string) => {
    // Functional updater form setFormState(prev => ...) ensures we always work
    // from the latest committed state, even if other updates are queued ahead.
    setFormState((prev) => {
      // 1. Tell TS 'field' is definitely one of the object keys
      const fieldKey = field as keyof typeof prev;

      // 2. Ensure we only spread if it's NOT the boolean 'validForSubmit'
      //    resetPassword is also a plain boolean — spreading it like an object
      //    would corrupt state, so we guard against it here too.
      if (fieldKey === "validForSubmit" || fieldKey === "resetPassword")
        return prev;

      return {
        ...prev,
        [fieldKey]: {
          ...prev[fieldKey], // Now TS knows this is the { error: string } object
          touched: true,
        },
      };
    });
  };

  // handleInputChange fires on every keystroke in any form field.
  //
  // EXECUTION ORDER (critical for understanding the two-setFormState pattern):
  //   Step 1 — First setFormState is QUEUED (not run). React schedules it.
  //   Step 2 — Validation runs synchronously against the raw `value` arg.
  //             formState still reflects the PREVIOUS render here.
  //   Step 3 — A second setFormState is QUEUED based on the validation result.
  //   Step 4 — handleInputChange returns.
  //   Step 5 — React runs both queued updaters in order:
  //               updater #1: current state → intermediate state
  //               updater #2: intermediate state → final state
  //   Step 6 — ONE re-render with the final state (React 18 automatic batching).
  const handleInputChange = (field: string, value: string) => {
    let input = value;

    // FIRST QUEUE: immediately write the typed value so the input feels live.
    // This runs before validation finishes — the second setFormState will
    // correct or clear the error in the same render batch.
    setFormState((prev) => {
      const newState = {
        ...prev,
        [field]: {
          value: input,
        },
      };

      return { ...newState };
    });

    // Validation is synchronous — result is an error string, or falsy if valid.
    let result = LoginFormValidationResult(field, value);

    if (result) {
      // SECOND QUEUE (error path): stamp the error onto the field and
      // recalculate whether the form as a whole is ready to submit.
      setFormState((prev) => {
        const fieldKey = field as keyof typeof prev;

        // 2. Safety check: Don't spread if it's the boolean 'validForSubmit'
        if (fieldKey === "validForSubmit" || fieldKey === "resetPassword")
          return prev;

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
        // Derived from newState (the about-to-be-committed snapshot), not from
        // the stale formState closure, so the gate is always accurate.
        const isFormValid =
          newState.userName.error === "" &&
          newState.userName.value.trim() !== "" &&
          newState.password.error === "" &&
          newState.password.value.trim() !== "";
        return {
          ...newState,
          validForSubmit: isFormValid,
        };
      });
    } else {
      // SECOND QUEUE (happy path): input is valid — clear any previous error,
      // mark touched, and recalculate validForSubmit.
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
          newState.password.value.trim() !== "";

        return { ...newState, validForSubmit: isFormValid as any };
      });
    }
  };

  // Return the state snapshot and both handlers so the component can:
  //   - Read formState to render current values, errors, and button disabled state
  //   - Pass handleInputChange to each input's onChange prop
  //   - Pass handleBlur to each input's onBlur prop
  //
  // Each time setFormState is called above, React re-runs this hook from the
  // top — useState restores formState to the latest value and fresh handler
  // functions are created and returned.
  return {
    formState,
    handleInputChange,
    handleBlur,
  };
};

export default useLoginForm;
