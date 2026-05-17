"use client";
import { LoginApi } from "@/service/PersonalBlogService";
import { InputFormField } from "../blog/save/InputFormField";
import useLoginForm from "@/hooks/useLoginForm";
import AlertMessage from "../shared/AlertMessage";
import { useEffect, useState } from "react";
import { LoginResponse, User } from "@/utils/types";
import { useAuth } from "@/providers/auth-provider";
import {
  useRouter,
  useSearchParams,
} from "next/dist/client/components/navigation";

const LoginForm = () => {
  const { setUser } = useAuth();
  const router = useRouter();

  const { formState, handleInputChange, handleBlur } = useLoginForm({
    userName: "",
    password: "",
    resetPassword: false,
  });

  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    apiStatus: number;
  }>({
    show: false,
    message: "",
    apiStatus: 0,
  });

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // Check for "registered=true" in query params to show success message after registration
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setAlert({
        show: true,
        message: "Account created! Please log in.",
        apiStatus: 200,
      });
    }
  }, [searchParams]);

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 via-white to-teal-100/40 min-h-screen py-16 px-6 lg:px-8">
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

          {/* Header */}
          <div className="text-center mb-9">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
              Login
            </h1>
            <p className="text-gray-500 text-base">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_24px_60px_rgba(15,23,42,0.12)] border border-white/70 p-8 md:p-10">
            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                if (formState.validForSubmit) {
                  let result: LoginResponse = await LoginApi({
                    userName: formState.userName.value,
                    password: formState.password.value,
                  });
                  if (
                    result.status === 200 //&&
                    //result.data &&
                    //"id" in result.data
                  ) {
                    //successfully log user in. set loggedInState, userContext, redirect to /blogs
                    setUser(result.data);
                    router.push("/blogs");
                  } else if (result.status === 401) {
                    setAlert((prev) => ({
                      ...prev,
                      show: true,
                      message: "Login failed! Please check your credentials.",
                    }));
                  } else {
                    console.log("test: ", result.status);
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
                  className: "block text-sm font-semibold text-gray-700 mb-2",
                  children: "Username",
                }}
                inputFormProps={{
                  type: "text",
                  id: "Username",
                  name: "Username",
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

              {/* Password Field */}
              <InputFormField
                formLabelProps={{
                  htmlFor: "Password",
                  className: "block text-sm font-semibold text-gray-700 mb-2",
                  children: "Password",
                }}
                inputFormProps={{
                  type: "password",
                  id: "Password",
                  name: "Password",
                  placeholder: "Password",
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

              <div className="-mt-2 flex justify-end">
                <button
                  type="button"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-2xl transition-colors duration-200 shadow-sm mt-2"
              >
                Sign In
              </button>

              {/* Sign up link */}
              <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <a
                  href="/identity/signup"
                  className="text-teal-600 font-semibold hover:text-teal-700"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginForm;
