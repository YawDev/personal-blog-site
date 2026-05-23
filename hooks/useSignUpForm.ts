import { ISignUpFormState } from "@/formHelpers/formTypes";
import { SignUpFormValidationResult } from "@/utils/forms/FormHelpers";
import { useState } from "react";

// Custom hook for SignUp Form
//
// WHAT IS A CUSTOM HOOK?
// A custom hook is just a plain JS function whose name starts with "use".
// The "use" prefix tells React (and linters) that this function is allowed to
// call other hooks (like useState, useEffect, etc.) inside it.
//
// WHY EXTRACT LOGIC INTO A HOOK?
// The component file (SignUpForm.tsx) only has to worry about rendering JSX.
// All of the "what happens when the user types / blurs / submits" logic lives
// here, keeping the component clean and this logic reusable.
//
// HOW A COMPONENT USES THIS HOOK:
//   const { formState, handleInputChange, handleBlur } = useSignUpForm(initialValues);
// Every time formState changes (via setFormState), React re-renders the
// component automatically — the component always sees the freshest state.
const useSignUpForm = (initialValues: {
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
}) => {
  // useState gives us two things:
  //   formState     — the current snapshot of all field values, errors, and flags
  //   setFormState  — the function we call to schedule an update to that snapshot
  //
  // Calling setFormState does NOT change formState immediately in the current
  // execution. It tells React "next time you render this component, use this
  // new value". React then re-renders the component and formState holds the
  // updated data from that point on.
  //
  // Each field object has three properties:
  //   value   — what the user typed
  //   error   — validation message shown under the input ("" means no error)
  //   touched — whether the user has focused then left the field at least once
  //             (we wait for touched=true before showing errors so we don't
  //              yell at the user before they've had a chance to type)
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

  // handleBlur fires when the user clicks away from (or tabs out of) an input.
  // Its only job is to flip touched: true for that field so the UI can start
  // showing validation errors for it.
  //
  // RE-RENDER ORDER for handleBlur:
  //   1. User leaves the input → browser fires the blur event
  //   2. React calls handleBlur(field)
  //   3. setFormState(updater) is called — React QUEUES the updater; the
  //      current formState is still unchanged at this point
  //   4. handleBlur returns
  //   5. React runs the queued updater (prev → new state) and re-renders the
  //      component once with touched: true for this field
  const handleBlur = (field: string) => {
    // We pass a function (updater) to setFormState instead of a plain object.
    // React calls this function with the LATEST state as `prev`, which is
    // important when multiple updates are batched — it prevents stale closures.
    setFormState((prev) => {
      // 1. Tell TS 'field' is definitely one of the object keys
      const fieldKey = field as keyof typeof prev;

      // 2. Ensure we only spread if it's NOT the boolean 'validForSubmit'
      if (fieldKey === "validForSubmit") return prev;

      // Spread the entire previous state first (...prev), then override just
      // this one field, and inside the field spread its existing properties
      // (...prev[fieldKey]) before setting touched: true so nothing else is lost.
      return {
        ...prev,
        [fieldKey]: {
          ...prev[fieldKey], // Now TS knows this is the { error: string } object
          touched: true,
        },
      };
    });
  };

  // handleInputChange fires on every keystroke inside any form field.
  //
  // EXECUTION ORDER (important for mental model):
  //   Step 1 — First setFormState call is QUEUED (not run yet).
  //             React doesn't execute updaters synchronously; it schedules them.
  //   Step 2 — Validation runs synchronously against the raw `value` argument.
  //             Note: formState here still reflects the PREVIOUS render's state
  //             because the first setFormState hasn't been applied yet.
  //   Step 3 — A second setFormState call is QUEUED based on the validation result.
  //   Step 4 — handleInputChange returns.
  //   Step 5 — React processes both queued updaters in order:
  //               updater #1 runs with the current committed state → intermediate state
  //               updater #2 runs with the intermediate state → final state
  //   Step 6 — The component re-renders ONCE with the final state.
  //             React 18 automatic batching means multiple setFormState calls
  //             inside an event handler produce only one re-render.
  const handleInputChange = (field: string, value: string) => {
    let input = value;

    // FIRST QUEUE: optimistically write the new value to this field right away.
    // This keeps the input "live" as the user types without waiting for validation.
    setFormState((prev) => {
      const newState = {
        ...prev,
        [field]: {
          value: input,
        },
      };

      return { ...newState };
    });

    // Validation runs synchronously here — this is plain JS, not a React thing.
    // result is either an error string or falsy (null / undefined / "").
    let result = SignUpFormValidationResult(field, value);

    // Passwords-match check can't live inside SignUpFormValidationResult because
    // it needs the current password value from formState. We read formState
    // directly here — it still reflects the PREVIOUS render (see execution order
    // above), which is fine because password wasn't what just changed.
    if (
      field === "confirmPassword" &&
      !result &&
      value !== formState.password.value
    ) {
      result = "Passwords do not match";
    }

    if (result) {
      // SECOND QUEUE (error path): write the validation error onto the field
      // and recalculate whether the whole form is ready to submit.
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
        // Every field must have no error AND a non-empty value.
        // We derive this from newState (the post-update snapshot) not from
        // formState (the pre-update snapshot) so the check is always fresh.
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
      // SECOND QUEUE (happy path): input is valid — clear any previous error,
      // mark the field touched, and recalculate validForSubmit.
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

  // The hook returns an object so the consuming component can destructure only
  // what it needs. Returning formState gives the component the current snapshot
  // to render. Returning the handlers lets the component wire them up to JSX
  // event props (onChange, onBlur).
  //
  // Whenever setFormState is called anywhere above, React re-renders the
  // component and this hook re-runs top to bottom — useState restores formState
  // to the latest committed value, and fresh handler functions are created.
  return {
    formState,
    handleInputChange,
    handleBlur,
  };
};

export default useSignUpForm;
