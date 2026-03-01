import ErrorMessage from "@/components/shared/ErrorMessage";
import {
  FormLabelProps,
  InputFormFieldProps,
  TextAreaFormFieldProps,
} from "@/formHelpers/formTypes";

const InputFormField = ({
  formLabelProps,
  inputFormProps,
}: {
  formLabelProps: FormLabelProps;
  inputFormProps: InputFormFieldProps;
}) => {
  return (
    <>
      <div>
        <label
          htmlFor={formLabelProps.htmlFor}
          className={formLabelProps.className}
        >
          {formLabelProps.children}
        </label>
        <input
          type={inputFormProps.type}
          id={inputFormProps.id}
          name={inputFormProps.name}
          placeholder={inputFormProps.placeholder}
          className={inputFormProps.className}
          required
          value={inputFormProps.value}
          onChange={(e) => inputFormProps.onChange(e.target.value)}
          onBlur={inputFormProps.onBlur}
        />
      </div>
      {inputFormProps.formError && (
        <ErrorMessage message={inputFormProps.formError} />
      )}
    </>
  );
};

const TextAreaFormField = ({
  formLabelProps,
  inputFormProps,
}: {
  formLabelProps: FormLabelProps;
  inputFormProps: TextAreaFormFieldProps;
}) => {
  return (
    <>
      <div>
        <label
          htmlFor={formLabelProps.htmlFor}
          className={formLabelProps.className}
        >
          {formLabelProps.children}
        </label>
        <textarea
          id={inputFormProps.id}
          name={inputFormProps.name}
          rows={inputFormProps.rows}
          placeholder={inputFormProps.placeholder}
          className={inputFormProps.className}
          value={inputFormProps.value}
          onChange={(e) => inputFormProps.onChange(e.target.value)}
          onBlur={inputFormProps.onBlur}
        />
      </div>
      {inputFormProps.formError && (
        <ErrorMessage message={inputFormProps.formError} />
      )}
    </>
  );
};

export { InputFormField, TextAreaFormField };
