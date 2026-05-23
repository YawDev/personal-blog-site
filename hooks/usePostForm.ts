import { useState } from "react";
import { IPostFormState } from "@/formHelpers/formTypes";
import { PostFormValidationResult } from "@/utils/forms/FormHelpers";

// Custom hook for the Blog Post Form (create and edit flows).
//
// WHAT IS A CUSTOM HOOK?
// A plain JS function whose name starts with "use" — this lets it call React
// hooks (useState, useEffect, etc.) inside. Logic lives here so the form
// component only needs to handle JSX.
//
// THIS HOOK VS. THE OTHERS:
// usePostForm adds a fourth export — loadExistingData — that the edit-post
// flow uses to populate the form with data fetched from the API. The create-
// post flow never calls it (the initialValues cover that case).
//
// HOW A COMPONENT USES THIS HOOK:
//   const { formState, handleInputChange, handleBlur, loadExistingData }
//     = usePostForm(initialValues);
// Every setFormState call triggers React to re-render the component with the
// latest formState snapshot.
const usePostForm = (initialValues: {
  title: string;
  preview: string;
  content: string;
}) => {
  // useState returns the current state snapshot and the updater function.
  // Calling setFormState does NOT mutate formState immediately — it queues an
  // update and React re-renders the component with the new value afterward.
  //
  // Field shape: { value, error, touched }
  //   value   — what the user has typed
  //   error   — validation message ("" means no error)
  //   touched — true once the user has focused + left the field; errors are
  //             only shown after touched=true to avoid nagging on first load
  const [formState, setFormState] = useState<IPostFormState>({
    title: { value: initialValues.title, error: "", touched: false },
    preview: { value: initialValues.preview, error: "", touched: false },
    content: { value: initialValues.content, error: "", touched: false },
    validForSubmit: false,
  });

  // handleBlur fires when the user clicks away from (or tabs out of) a field.
  // It only sets touched: true — validation errors will appear on the NEXT
  // render because the component reads formState.field.touched to decide
  // whether to render the error message.
  //
  // RE-RENDER ORDER:
  //   1. User leaves the field → blur event fires
  //   2. handleBlur(field) is called
  //   3. setFormState(updater) is QUEUED — formState still unchanged right now
  //   4. handleBlur returns
  //   5. React runs the queued updater and re-renders once with touched: true
  const handleBlur = (field: string) => {
    // Functional updater (prev => ...) ensures we base the new state on the
    // latest committed snapshot, not a potentially stale closure.
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

  // handleInputChange fires on every keystroke inside any field.
  //
  // EXECUTION ORDER:
  //   Step 1 — First setFormState is QUEUED (writes the raw typed value).
  //   Step 2 — PostFormValidationResult runs synchronously.
  //             formState still reflects the PREVIOUS render at this point
  //             because the first setFormState hasn't been applied yet.
  //   Step 3 — A second setFormState is QUEUED (writes the error or clears it).
  //   Step 4 — handleInputChange returns.
  //   Step 5 — React applies both queued updaters in order:
  //               updater #1 runs → produces intermediate state
  //               updater #2 runs against intermediate state → final state
  //   Step 6 — ONE re-render with the final state (React 18 automatic batching).
  const handleInputChange = (field: string, value: string) => {
    let input = value;

    // FIRST QUEUE: optimistically write the new value so the input feels live.
    setFormState((prev) => {
      const newState = {
        ...prev,
        [field]: {
          value: input,
        },
      };

      return { ...newState };
    });

    // Validation runs synchronously — result is an error string or falsy.
    let result = PostFormValidationResult(field, value);

    if (result) {
      // SECOND QUEUE (error path): stamp the error onto the field and
      // recalculate whether the whole form can be submitted.
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
        // Using newState (the about-to-commit snapshot) keeps this accurate.
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
          newState.title.error === "" &&
          newState.title.value.trim() !== "" &&
          newState.preview.error === "" &&
          newState.content.error === "" &&
          newState.content.value.trim() !== "";

        return { ...newState, validForSubmit: isFormValid as any };
      });
    }
  };

  // loadExistingData is unique to this hook — it's used by the edit-post flow
  // when the component fetches a post from the API and needs to pre-fill the
  // form with the existing title, preview, and content.
  //
  // Unlike handleInputChange, this passes a plain object (not a functional
  // updater) to setFormState because we're replacing the entire form state at
  // once — there's no need to merge with `prev`. validForSubmit starts as true
  // because the data came from the server and is assumed valid.
  //
  // RE-RENDER ORDER:
  //   1. API response arrives → component calls loadExistingData(data)
  //   2. setFormState(plainObject) is called — React queues the full replacement
  //   3. loadExistingData returns
  //   4. React applies the queued update → one re-render with all fields populated
  const loadExistingData = (data: {
    title: string;
    preview: string;
    content: string;
  }) => {
    setFormState({
      title: { value: data.title, error: "", touched: false },
      preview: { value: data.preview, error: "", touched: false },
      content: { value: data.content, error: "", touched: false },
      validForSubmit: true,
    });
  };

  // Return the state snapshot and all handlers. The component wires:
  //   formState         → rendered values, error messages, submit button state
  //   handleInputChange → input onChange prop
  //   handleBlur        → input onBlur prop
  //   loadExistingData  → called once after an API fetch in the edit flow
  return {
    formState,
    handleInputChange,
    handleBlur,
    loadExistingData,
  };
};

export default usePostForm;
