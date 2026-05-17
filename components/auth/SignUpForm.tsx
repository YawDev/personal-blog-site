import BackToArticles from "../blog/BackToArticles";
import useSignUpForm from "@/hooks/useSignUpForm";
import { InputFormField } from "../blog/save/InputFormField";
import { SignUpApi } from "@/service/PersonalBlogService";
import router from "next/dist/shared/lib/router/router";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import { Alert, SignUpResponse } from "@/utils/types";
import AlertMessage from "../shared/AlertMessage";

const SignUpForm = () => {
  const { formState, handleInputChange, handleBlur } = useSignUpForm({
    userName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const router = useRouter();
  const [alert, setAlert] = useState<Alert>({
    show: false,
    message: "",
    apiStatus: 0,
  });

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alert.show]);
  return (
    <>
      {" "}
      <section className="bg-gradient-to-br from-teal-50 via-white to-teal-100/40 min-h-screen py-16 px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            {/* <BackToArticles /> */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
              {"Sign Up"}
            </h1>
            <p className="text-gray-500 text-base">
              Create an account to start posting
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              alert.show
                ? "mb-4 max-h-24 opacity-100"
                : "mb-0 max-h-0 opacity-0"
            }`}
          >
            <AlertMessage
              message={alert.message}
              variant={alert.apiStatus !== 200 ? "error" : "default"}
            />
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl shadow-[0_24px_60px_rgba(15,23,42,0.12)] border border-white/70 p-8 md:p-10">
            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                if (formState.validForSubmit) {
                  let result: SignUpResponse = await SignUpApi(formState);
                  if (result.status === 200 || result.status === 201) {
                    router.push("/identity/login?registered=true");
                  } else {
                    setAlert((prev) => ({
                      ...prev,
                      show: true,
                      message: result.message,
                      apiStatus: result.status,
                    }));
                  }
                }
              }}
            >
              {/* Username Field */}
              <InputFormField
                formLabelProps={{
                  htmlFor: "Username",
                  className:
                    "block text-sm font-semibold uppercase tracking-[0.08em] text-gray-600 mb-2",
                  children: "Username",
                }}
                inputFormProps={{
                  type: "text",
                  id: "Username",
                  name: "Username",
                  placeholder: "Choose a unique username",
                  value: formState.userName.value,
                  onChange: (value: string) =>
                    handleInputChange("userName", value),
                  onBlur: () => handleBlur("userName"),
                  className: `w-full bg-gray-50/70 px-4 py-3 text-base text-gray-900 border rounded-2xl focus:ring-0 outline-none transition-colors duration-200 ${
                    formState.userName.error
                      ? "border-red-300 focus:border-red-500 hover:border-red-400"
                      : "border-gray-200 focus:border-teal-500 hover:border-teal-300"
                  }`,
                  formError: formState.userName.error,
                }}
              />
              <p className="-mt-4 text-xs text-gray-500">
                Use 3-20 characters with letters, numbers, or underscores.
              </p>
              {/* FirstName Field */}
              <InputFormField
                formLabelProps={{
                  htmlFor: "First Name",
                  className:
                    "block text-sm font-semibold uppercase tracking-[0.08em] text-gray-600 mb-2",
                  children: "First Name",
                }}
                inputFormProps={{
                  type: "text",
                  id: "First Name",
                  name: "First Name",
                  placeholder: "Enter your first name",
                  value: formState.firstName.value,
                  onChange: (value: string) =>
                    handleInputChange("firstName", value),
                  onBlur: () => handleBlur("firstName"),
                  className: `w-full bg-gray-50/70 px-4 py-3 text-base text-gray-900 border rounded-2xl focus:ring-0 outline-none transition-colors duration-200 ${
                    formState.firstName.error
                      ? "border-red-300 focus:border-red-500 hover:border-red-400"
                      : "border-gray-200 focus:border-teal-500 hover:border-teal-300"
                  }`,
                  formError: formState.firstName.error,
                }}
              />
              <p className="-mt-4 text-xs text-gray-500">
                Enter the name shown on your profile.
              </p>
              {/* LastName Field */}
              <InputFormField
                formLabelProps={{
                  htmlFor: "Last Name",
                  className:
                    "block text-sm font-semibold uppercase tracking-[0.08em] text-gray-600 mb-2",
                  children: "Last Name",
                }}
                inputFormProps={{
                  type: "text",
                  id: "Last Name",
                  name: "Last Name",
                  placeholder: "Enter your last name",
                  value: formState.lastName.value,
                  onChange: (value: string) =>
                    handleInputChange("lastName", value),
                  onBlur: () => handleBlur("lastName"),
                  className: `w-full bg-gray-50/70 px-4 py-3 text-base text-gray-900 border rounded-2xl focus:ring-0 outline-none transition-colors duration-200 ${
                    formState.lastName.error
                      ? "border-red-300 focus:border-red-500 hover:border-red-400"
                      : "border-gray-200 focus:border-teal-500 hover:border-teal-300"
                  }`,
                  formError: formState.lastName.error,
                }}
              />
              <p className="-mt-4 text-xs text-gray-500">
                This helps personalize your author profile.
              </p>

              {/* Email Field */}
              <InputFormField
                formLabelProps={{
                  htmlFor: "Email",
                  className:
                    "block text-sm font-semibold uppercase tracking-[0.08em] text-gray-600 mb-2",
                  children: "Email",
                }}
                inputFormProps={{
                  type: "email",
                  id: "Email",
                  name: "Email",
                  placeholder: "Enter your email address",
                  value: formState.email.value,
                  onChange: (value: string) =>
                    handleInputChange("email", value),
                  onBlur: () => handleBlur("email"),
                  className: `w-full bg-gray-50/70 px-4 py-3 text-base text-gray-900 border rounded-2xl focus:ring-0 outline-none transition-colors duration-200 ${
                    formState.email.error
                      ? "border-red-300 focus:border-red-500 hover:border-red-400"
                      : "border-gray-200 focus:border-teal-500 hover:border-teal-300"
                  }`,
                  formError: formState.email.error,
                }}
              />
              <p className="-mt-4 text-xs text-gray-500">
                We will use this for account verification and sign-in alerts.
              </p>

              {/* Password Field */}
              <InputFormField
                formLabelProps={{
                  htmlFor: "Password",
                  className:
                    "block text-sm font-semibold uppercase tracking-[0.08em] text-gray-600 mb-2",
                  children: "Password",
                }}
                inputFormProps={{
                  type: "password",
                  id: "Password",
                  name: "Password",
                  placeholder: "Create a strong password",
                  value: formState.password.value,
                  onChange: (value: string) =>
                    handleInputChange("password", value),
                  onBlur: () => handleBlur("password"),
                  className: `w-full bg-gray-50/70 px-4 py-3 text-base text-gray-900 border rounded-2xl focus:ring-0 outline-none transition-colors duration-200 ${
                    formState.password.error
                      ? "border-red-300 focus:border-red-500 hover:border-red-400"
                      : "border-gray-200 focus:border-teal-500 hover:border-teal-300"
                  }`,
                  formError: formState.password.error,
                }}
              />
              <p className="-mt-4 text-xs text-gray-500">
                Must include uppercase, lowercase, number, and symbol.
              </p>
              {/* Confirm Password Field */}
              <InputFormField
                formLabelProps={{
                  htmlFor: "Confirm Password",
                  className:
                    "block text-sm font-semibold uppercase tracking-[0.08em] text-gray-600 mb-2",
                  children: "Confirm Password",
                }}
                inputFormProps={{
                  type: "text",
                  id: "Confirm Password",
                  name: "Confirm Password",
                  placeholder: "Re-enter your password",
                  value: formState.confirmPassword.value,
                  onChange: (value: string) =>
                    handleInputChange("confirmPassword", value),
                  onBlur: () => handleBlur("confirmPassword"),
                  className: `w-full bg-gray-50/70 px-4 py-3 text-base text-gray-900 border rounded-2xl focus:ring-0 outline-none transition-colors duration-200 ${
                    formState.confirmPassword.error
                      ? "border-red-300 focus:border-red-500 hover:border-red-400"
                      : "border-gray-200 focus:border-teal-500 hover:border-teal-300"
                  }`,
                  formError: formState.confirmPassword.error,
                }}
              />
              <p className="-mt-4 text-xs text-gray-500">
                Re-enter the exact same password to confirm.
              </p>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full bg-teal-600 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 shadow-sm mt-2 ${
                  formState.validForSubmit
                    ? "hover:bg-teal-700 cursor-pointer"
                    : "opacity-40 blur-[0.5px] cursor-not-allowed"
                }`}
                disabled={!formState.validForSubmit}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUpForm;
