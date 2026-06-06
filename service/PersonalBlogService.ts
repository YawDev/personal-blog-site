import {
  IEditProfileFormState,
  ISignUpFormState,
} from "@/formHelpers/formTypes";
import {
  Blog,
  Draft,
  EditProfileRequest,
  EditProfileResponse,
  EmailShareLinkRequest,
  EmailShareLinkResponse,
  LoginRequest,
  LoginResponse,
  PublishPostResponse,
  RefreshTokenResponse,
  SaveDraftRequest,
  SaveDraftResponse,
  SavePostRequest,
  SavePostResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/types/types";
import axios from "axios";

const getBffBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return "";
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
};

const bffAxios = axios.create({
  timeout: 5000,
  withCredentials: true,
});

bffAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !(originalRequest as any)._retry &&
      !originalRequest.url?.includes("/api/auth/refresh")
    ) {
      (originalRequest as any)._retry = true;

      try {
        await bffAxios.post(`${getBffBaseUrl()}/api/auth/refresh`, null);
        return bffAxios(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export const GetAllPosts = async (): Promise<Blog[]> => {
  var posts = await bffAxios
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
  var post = await bffAxios
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
  var res = await bffAxios
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
          data: response.data.data ?? null,
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

  var user = await bffAxios
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

export const RefreshTokenApi = async (
  body: null,
): Promise<RefreshTokenResponse> => {
  var res = await bffAxios
    .post(`${getBffBaseUrl()}/api/auth/refresh`, null, {
      timeout: 5000,
    })
    .then((response) => {
      console.log("response", response);
      console.log("User authenticated: ", response.data);
      if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: "User session expired.",
        };
      } else {
        return {
          status: response.status,
          data: response.data.data ?? null,
          message: "Token refresh successful",
        };
      }
    })
    .catch((error) => {
      console.error("Error refreshing token: ", error);
      console.log(error.response);
      if (error.response?.status === 401) {
        return {
          status: error.response?.status,
          data: null,
          message: "User session expired.",
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

export const EditProfileApi = async (
  userId: string,
  data: IEditProfileFormState,
): Promise<EditProfileResponse> => {
  let body: EditProfileRequest = {
    UserName: data.userName.value,
    Email: data.email.value,
    FirstName: data.firstName.value,
    LastName: data.lastName.value,
  };

  var user = await bffAxios
    .put(`${getBffBaseUrl()}/api/auth/account/edit?id=${userId}`, body, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Account successfully edited!");
      return {
        status: response.status,
        message: "Account successfully edited!",
      };
    })
    .catch((error) => {
      if (error.response?.status === 400) {
        console.error("Account edit failed: ", error.response.data);
        return {
          status: error.response.status,
          message: error.response.data?.message ?? "Account Edit failed",
        };
      }

      console.error("Error editing account: ", error);
      return {
        status: error.response?.status ?? 500,
        message: "Error editing account.",
      };
    });
  return user;
};

export const logoutApi = async (): Promise<boolean> => {
  var user = await bffAxios
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

  var res = await bffAxios
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

export const shareLinkEmailApi = async (
  data: EmailShareLinkRequest,
): Promise<EmailShareLinkResponse> => {
  let body: EmailShareLinkRequest = data;

  var res = await bffAxios
    .post(`${getBffBaseUrl()}/api/blogs/sharelink`, body, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log(
        "Email sharelink sent successfully for this post!: ",
        response.data,
      );
      return {
        status: response.status,
        message: "Email sent successfully!",
      };
    })
    .catch((error) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        console.error(
          "Not able to share blog page via email: ",
          error.response.data,
        );
        return {
          status,
          message:
            error.response.data?.Message ??
            error.response.data?.message ??
            "Not able to send email to share blog page.",
        };
      }

      console.error("Error sharing blog: ", error);
      return {
        status: status ?? 500,
        message: "Error sending email to share blog.",
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

  console.log("Editing post with body: ", body);

  var res = await bffAxios
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

export const deletePostApi = async (
  postId: string,
  userId: string | null,
): Promise<boolean> => {
  return await bffAxios
    .delete(`${getBffBaseUrl()}/api/blogs/delete`, {
      data: { postId, userId },
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Blog deleted successfully: ", response.data);
      return response.data?.status === 200;
    })
    .catch((error) => {
      console.error("Not able to delete blog: ", error.response?.data);
      return false;
    });
};

export const deleteDraftApi = async (
  draftId: string,
  userId: string | null,
): Promise<boolean> => {
  return await bffAxios
    .delete(`${getBffBaseUrl()}/api/drafts/delete`, {
      data: { draftId, userId },
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Draft deleted successfully: ", response.data);
      return response.data?.status === 200;
    })
    .catch((error) => {
      console.error("Not able to delete draft: ", error.response?.data);
      return false;
    });
};

export const createDraftApi = async (
  userId: string,
  data: { title: string; content: string; preview: string },
): Promise<SaveDraftResponse> => {
  let body: SaveDraftRequest = {
    title: data.title,
    content: data.content,
    preview: data.preview,
    userId: userId,
  };

  var res = await bffAxios
    .post(`${getBffBaseUrl()}/api/drafts/create`, body, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Draft created successfully: ", response.data);
      return {
        status: response.status,
        message: "Draft created successfully",
        newDraftId: response.data.data?.draftGuid ?? null,
      };
    })
    .catch((error) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        console.error("Not able to create draft: ", error.response.data);
        return {
          status,
          message:
            error.response.data?.Message ??
            error.response.data?.message ??
            "Not able to create draft.",
          newDraftId: null,
        };
      }

      console.error("Error creating draft: ", error);
      return {
        status: status ?? 500,
        message: "Error creating draft.",
        newDraftId: null,
      };
    });
  return res;
};

export const editDraftApi = async (
  _userId: string,
  data: Draft,
): Promise<SaveDraftResponse> => {
  let body: SaveDraftRequest & { draftId: string } = {
    title: data.title,
    content: data.content,
    preview: data.preview,
    userId: data.userId,
    draftId: data.id,
  };

  var res = await bffAxios
    .put(`${getBffBaseUrl()}/api/drafts/edit`, body, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Draft edited successfully: ", response.data);
      return {
        status: response.status,
        message: "Draft edited successfully",
      };
    })
    .catch((error) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        console.error("Not able to edit draft: ", error.response.data);
        return {
          status,
          message:
            error.response.data?.Message ??
            error.response.data?.message ??
            "Not able to edit draft.",
        };
      }

      console.error("Error editing draft: ", error);
      return {
        status: status ?? 500,
        message: "Error editing draft.",
      };
    });
  return res;
};

export const GetAllDraftsByUser = async (userId: string): Promise<Draft[]> => {
  var drafts = await bffAxios
    .get(`${getBffBaseUrl()}/api/drafts/getAll?id=${userId}`, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      if (response?.status === 200) {
        console.log("Fetched drafts:", response.data);
        console.log("Drafts fetched successfully.");
        console.log(
          "Drafts data structure:",
          JSON.stringify(response.data, null, 2),
        );
        return response.data?.data ?? [];
      } else {
        console.log("Failed to fetch drafts.");
        return [];
      }
    })
    .catch((error) => {
      console.error("Error fetching drafts:", error);
      return [];
    });
  return drafts;
};

export const GetDraftById = async (
  draftId: string,
  userId: string,
): Promise<Draft | null> => {
  var draft = await bffAxios
    .get(
      `${getBffBaseUrl()}/api/drafts/getById?draftId=${draftId}&id=${userId}`,
      {
        timeout: 5000,
        withCredentials: true,
      },
    )
    .then((response) => {
      if (response?.status === 200) {
        console.log("Fetched draft:", response.data);
        console.log("Draft fetched successfully.");
        console.log(
          "Draft data structure:",
          JSON.stringify(response.data, null, 2),
        );
        return response.data?.data ?? null;
      } else {
        console.log("Failed to fetch draft.");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error fetching draft:", error);
      return null;
    });
  return draft;
};

export const publishDraftApi = async (
  userId: string,
  data: { draftId: string; title: string; content: string; preview: string },
): Promise<PublishPostResponse> => {
  let body = {
    draftId: data.draftId,
    title: data.title,
    content: data.content,
    preview: data.preview,
    userId: userId,
  };

  var res = await bffAxios
    .post(`${getBffBaseUrl()}/api/drafts/publish`, body, {
      timeout: 5000,
      withCredentials: true,
    })
    .then((response) => {
      console.log("Draft published successfully: ", response.data);
      return {
        status: response.status,
        message: "Draft published successfully",
        postGuid: response.data.data?.postGuid ?? null,
      };
    })
    .catch((error) => {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        console.error("Not able to publish draft: ", error.response.data);
        return {
          status,
          message:
            error.response.data?.Message ??
            error.response.data?.message ??
            "Not able to publish draft.",
          postGuid: null,
        };
      }

      console.error("Error publishing draft: ", error);
      return {
        status: status ?? 500,
        message: "Error publishing draft.",
        postGuid: null,
      };
    });
  return res;
};
