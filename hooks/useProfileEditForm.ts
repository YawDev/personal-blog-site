import { IEditProfileFormState } from "@/formHelpers/formTypes";
import { EditProfileValidationResult } from "@/utils/forms/FormHelpers";
import { useState } from "react";

// Custom hook for Edit Profile Form
// Initial values on form populated by the current user's data.
//
// WHAT IS A CUSTOM HOOK?
// A plain JS function whose name starts with "use". The prefix allows it to
// call React hooks (useState, useEffect, etc.) internally. Logic lives here
// so the EditProfile component only has to render JSX — it doesn't manage
// any state itself.
//
// HOW A COMPONENT USES THIS HOOK:
//   const { formState, handleInputChange, handleBlur } = useEditProfileForm(user);
// The component passes the currently logged-in user's data as initialValues
// so the form is pre-filled on first render. After that, every setFormState
// call causes React to re-render the component with the updated formState.
const useEditProfileForm = (initialValues: {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}) => {
  // UseState hook used to set default form state with current user's data.
  //
  // useState returns two things:
  //   formState     — current snapshot of all field values, errors, and flags
  //   setFormState  — function to schedule an update to that snapshot
  //
  // Calling setFormState does NOT change formState immediately in the current
  // execution. React queues the update and re-renders the component afterward.
  //
  // Each field object has three properties:
  //   value   — what the user has typed (or the pre-filled value from the user's profile)
  //   error   — validation message shown under the input ("" means no error)
  //   touched — true once the user has focused then left the field; the component
  //             waits for touched=true before showing errors so users aren't
  //             scolded before they've had a chance to fill anything in
  const [formState, setFormState] = useState<IEditProfileFormState>({
    userName: { value: initialValues.userName, error: "", touched: false },
    firstName: { value: initialValues.firstName, error: "", touched: false },
    lastName: { value: initialValues.lastName, error: "", touched: false },
    email: { value: initialValues.email, error: "", touched: false },
    validForSubmit: false,
  });

  // HandleBlur function used to set the 'touched' property of form fields to true when user clicks away from an input field. This is used to determine when to show validation error messages.
  //
  // RE-RENDER ORDER for handleBlur:
  //   1. User leaves the input → browser fires the blur event
  //   2. React calls handleBlur(field)
  //   3. setFormState(updater) is QUEUED — formState is still the previous value
  //   4. handleBlur returns
  //   5. React applies the updater and re-renders once with touched: true for
  //      this field — the component can now display the error message if one exists
  const handleBlur = (field: string) => {
    // Functional updater form (prev => ...) guarantees we work from the latest
    // committed state even when multiple state updates are queued at once.
    setFormState((prev) => {
      // 1. Tell TS 'field' is definitely one of the object keys
      const fieldKey = field as keyof typeof prev;

      // 2. Ensure we only spread if it's NOT the boolean 'validForSubmit'
      if (fieldKey === "validForSubmit") return prev;

      // Spread the full previous state, then override just this field.
      // Inside the field, spread its existing properties before adding touched: true
      // so value and error are preserved.
      return {
        ...prev,
        [fieldKey]: {
          ...prev[fieldKey], // Now TS knows this is the { error: string } object
          touched: true,
        },
      };
    });
  };

  // Used to set correct form state based on user input and validate form fields as user types.
  //
  // EXECUTION ORDER (two-setFormState pattern):
  //   Step 1 — First setFormState is QUEUED (writes raw typed value). Not run yet.
  //   Step 2 — EditProfileValidationResult runs synchronously against `value`.
  //             formState still reflects the PREVIOUS render here because the
  //             first setFormState hasn't been applied yet.
  //   Step 3 — A second setFormState is QUEUED based on the validation outcome.
  //   Step 4 — handleInputChange returns.
  //   Step 5 — React processes both queued updaters in order:
  //               updater #1 runs with committed state → intermediate state
  //               updater #2 runs with intermediate state → final state
  //   Step 6 — ONE re-render with the final state (React 18 automatic batching
  //             merges multiple setFormState calls in an event handler into one render).
  const handleInputChange = (field: string, value: string) => {
    let input = value;

    // FIRST QUEUE: optimistically write the new value so the input stays live
    // as the user types without waiting for validation to finish.
    setFormState((prev) => {
      const newState = {
        ...prev,
        [field]: {
          value: input,
        },
      };

      return { ...newState };
    });

    // Validate form input fields as User types.
    // This is plain JS — no React involved. result is an error string or falsy.
    let result = EditProfileValidationResult(field, value);

    if (result) {
      // SECOND QUEUE (error path): write the validation error and recalculate
      // whether the full form is ready to submit.
      setFormState((prev) => {
        const fieldKey = field as keyof typeof prev;

        // Safety check: Don't spread if it's the boolean 'validForSubmit'
        if (fieldKey === "validForSubmit") return prev;

        // Perform the update to the specific field that was changed, while keeping the rest of the form state intact.
        // Spread prev first so unrelated fields are untouched, then override
        // just the changed field — and inside it, spread the field's existing
        // properties before adding error and touched.
        const newState = {
          ...prev,
          [fieldKey]: {
            ...prev[fieldKey], // Now TS knows this is an object { error: string, ... }
            error: result,
            touched: true,
          },
        };

        // Recalculate validForSubmit (Exclude it from the loop).
        // We check newState (the post-update snapshot) not the stale formState
        // closure — this keeps the submit gate accurate on every keystroke.
        const isFormValid =
          newState.userName.error === "" &&
          newState.userName.value.trim() !== "" &&
          // newState.firstName.error === "" &&
          // newState.firstName.value.trim() !== "" &&
          // newState.lastName.error === "" &&
          // newState.lastName.value.trim() !== "" &&
          newState.email.error === "" &&
          newState.email.value.trim() !== "";
        return {
          ...newState,
          validForSubmit: isFormValid,
        };
      });
    } else {
      // SECOND QUEUE (happy path): clear any previous error, mark touched,
      // and recalculate validForSubmit.
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
          // newState.firstName.error === "" &&
          // newState.firstName.value.trim() !== "" &&
          // newState.lastName.error === "" &&
          // newState.lastName.value.trim() !== "" &&
          newState.email.error === "" &&
          newState.email.value.trim() !== "";

        return { ...newState, validForSubmit: isFormValid as any };
      });
    }
  };

  // Return formstate, and handlers for onBlur and onChange events.
  // The component wires these up like:
  //   <input onChange={(e) => handleInputChange("userName", e.target.value)}
  //          onBlur={() => handleBlur("userName")} />
  //
  // Each time setFormState runs above, React re-runs this hook top to bottom —
  // useState restores formState to the latest committed value and fresh handler
  // functions are returned to the component.
  return {
    formState,
    handleInputChange,
    handleBlur,
  };
};

export default useEditProfileForm;
