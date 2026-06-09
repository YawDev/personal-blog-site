"use client";
import { Alert, EditProfileResponse, User } from "@/types/types";
import { InputFormField } from "../blog/save/InputFormField";
import useEditProfileForm from "@/hooks/useProfileEditForm";
import Link from "next/link";
import { EditProfileApi } from "@/service/PersonalBlogService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AlertMessage from "../shared/AlertMessage";

export default function EditProfileForm({
  currentUser,
}: {
  currentUser: User;
}) {
  const router = useRouter();
  const { formState, handleInputChange, handleBlur } = useEditProfileForm({
    userName: currentUser.userName,
    email: currentUser.email,
    firstName: "",
    lastName: "",
  });
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
      <section className="bg-gradient-to-br from-teal-50 via-white to-teal-100/40 min-h-screen py-16 px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/identity/profile"
              className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Profile
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Edit Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Edit your account information and details
            </p>
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

          <div className="bg-white rounded-3xl shadow-[0_24px_60px_rgba(15,23,42,0.12)] border border-white/70 p-8 md:p-10">
            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                if (formState.validForSubmit) {
                  let result: EditProfileResponse = await EditProfileApi(
                    currentUser.id,
                    formState,
                  );
                  if (result.status === 200 || result.status === 201) {
                    router.push("/identity/profile?editSuccess=true");
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
                  htmlFor: "username",
                  className: "block text-sm font-semibold text-gray-700 mb-2",
                  children: "Username",
                }}
                inputFormProps={{
                  type: "text",
                  id: "username",
                  name: "username",
                  placeholder: "Username",
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
              {/* TODO: Backend doesnt support fields currently. DB table Changes required to edit/save first and last name fields, need to update API and DB before enabling these fields on the form */}
              {/* First Name Field
              <InputFormField
                formLabelProps={{
                  htmlFor: "firstName",
                  className: "block text-sm font-semibold text-gray-700 mb-2",
                  children: "First name",
                }}
                inputFormProps={{
                  type: "text",
                  id: "firstName",
                  name: "firstName",
                  placeholder: "First name",
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

              {/* Last Name Field */}
              {/* <InputFormField
                formLabelProps={{
                  htmlFor: "lastName",
                  className: "block text-sm font-semibold text-gray-700 mb-2",
                  children: "Last name",
                }}
                inputFormProps={{
                  type: "text",
                  id: "lastName",
                  name: "lastName",
                  placeholder: "Last name",
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
              /> */}

              {/* Email Field */}
              <InputFormField
                formLabelProps={{
                  htmlFor: "email",
                  className: "block text-sm font-semibold text-gray-700 mb-2",
                  children: "Email",
                }}
                inputFormProps={{
                  type: "email",
                  id: "email",
                  name: "email",
                  placeholder: "Email",
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
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
