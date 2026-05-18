import { ISignUpFormState } from "@/formHelpers/formTypes";
import {
  Blog,
  LoginRequest,
  LoginResponse,
  SavePostRequest,
  SavePostResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/types/types";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";

const httpClient = createHttpClient();

const getBffBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return "";
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
};

export const GetAllPosts = async (): Promise<Blog[]> => {
  var posts = await axios
    .get(`${getBffBaseUrl()}/api/blogs`, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      if (response?.status === 200) {
        console.log("Fetched posts:", response.data);
        console.log("Posts fetched successfully.");
        console.log(
          "Posts data structure:",
          JSON.stringify(response.data, null, 2),
        );
        return response.data?.data ?? [];
      } else {
        console.log("Failed to fetch posts.");
        return [];
      }
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      return [];
    });
  return posts;
};

export const GetPostsById = async (id: string): Promise<Blog | null> => {
  var post = await axios
    .get(`${getBffBaseUrl()}/api/blogById?id=${id}`, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Fetched post by Id: ", response.data);
      return response.data?.data ?? null;
    })
    .catch((error) => {
      console.error("Error fetching post: ", error);
      return null;
    });
  return post;
};

export const LoginApi = async (body: LoginRequest): Promise<LoginResponse> => {
  var res = await axios
    .post(`${getBffBaseUrl()}/api/auth/login`, body, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("response", response);
      console.log("User authenticated: ", response.data);
      if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: "Credentials failed authentication.",
        };
      } else {
        return {
          status: response.status,
          data: response.data, //normalizeUser(response.data),
          message: "Login successful",
        };
      }
    })
    .catch((error) => {
      console.error("Error authenticating user: ", error);
      console.log(error.response);
      if (error.response?.status === 401) {
        return {
          status: error.response?.status,
          data: null,
          message: "Credentials failed authentication.",
        };
      }
      return {
        status: error.response?.status,
        data: null,
        message: "Server is currently down.",
        error: error,
      };
    });

  return res;
};

export const SignUpApi = async (
  data: ISignUpFormState,
): Promise<SignUpResponse> => {
  let body: SignUpRequest = {
    userName: data.userName.value,
    password: data.password.value,
    confirmPassword: data.confirmPassword.value,
    email: data.email.value,
    firstName: data.firstName.value,
    lastName: data.lastName.value,
  };

  var user = await axios
    .post(`${getBffBaseUrl()}/api/auth/register`, body, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Account successfully registered!");
      return {
        status: response.status,
        message: "Account successfully registered!",
      };
    })
    .catch((error) => {
      if (error.response?.status === 400) {
        console.error("Registration failed: ", error.response.data);
        return {
          status: error.response.status,
          message: error.response.data?.message ?? "Registration failed",
        };
      }

      console.error("Error signing up user: ", error);
      return {
        status: error.response?.status ?? 500,
        message: "Error signing up user.",
      };
    });
  return user;
};

export const logoutApi = async (): Promise<boolean> => {
  var user = await axios
    .post(`${getBffBaseUrl()}/api/auth/logout`, null, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("logout success");
      return true;
    })
    .catch((error) => {
      console.error("Error logging out: ", error);
      return false;
    });
  return user;
};

export const createPostApi = async (
  id: string,
  data: Blog,
): Promise<SavePostResponse> => {
  let body: SavePostRequest = {
    title: data.title,
    content: data.content,
    preview: data.preview,
    userId: data.userId,
  };

  var res = await axios
    .post(`${getBffBaseUrl()}/api/blogs/create`, body, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Blog created successfully: ", response.data);
      return {
        status: response.status,
        message: "Blog created successfully",
      };
    })
    .catch((error) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        console.error("Not able to create blog: ", error.response.data);
        return {
          status,
          message:
            error.response.data?.Message ??
            error.response.data?.message ??
            "Not able to create blog.",
        };
      }

      console.error("Error creating blog: ", error);
      return {
        status: status ?? 500,
        message: "Error creating blog.",
      };
    });
  return res;
};

export const editPostApi = async (
  _userId: string,
  data: Blog,
): Promise<SavePostResponse> => {
  let body: SavePostRequest & { postId: string } = {
    title: data.title,
    content: data.content,
    preview: data.preview,
    userId: data.userId,
    postId: data.id,
  };

  var res = await axios
    .put(`${getBffBaseUrl()}/api/blogs/edit`, body, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Blog edited successfully: ", response.data);
      return {
        status: response.status,
        message: "Blog edited successfully",
      };
    })
    .catch((error) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        console.error("Not able to edit blog: ", error.response.data);
        return {
          status,
          message:
            error.response.data?.Message ??
            error.response.data?.message ??
            "Not able to edit blog.",
        };
      }

      console.error("Error editing blog: ", error);
      return {
        status: status ?? 500,
        message: "Error editing blog.",
      };
    });
  return res;
};
