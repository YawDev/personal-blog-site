# Architecture & Data Flow

This document explains how the entire application works — from a user clicking a button in the browser all the way to the database and back. Written for beginners, juniors, and anyone new to this codebase.

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
2. [What Each Layer Does](#2-what-each-layer-does)
3. [The BFF Pattern — Why It Exists](#3-the-bff-pattern--why-it-exists)
4. [How Authentication Works](#4-how-authentication-works)
5. [CRUD Operations — Step by Step](#5-crud-operations--step-by-step)
6. [Auth Flows](#6-auth-flows)
7. [Route Map — Quick Reference](#7-route-map--quick-reference)
8. [Glossary](#8-glossary)
9. [BFF Boilerplate — Code Reference & Patterns](#9-bff-boilerplate--code-reference--patterns)
10. [Form Component Boilerplate — Code Reference & Patterns](#10-form-component-boilerplate--code-reference--patterns)

3. [The BFF Pattern — Why It Exists](#3-the-bff-pattern--why-it-exists)
4. [How Authentication Works](#4-how-authentication-works)
5. [CRUD Operations — Step by Step](#5-crud-operations--step-by-step)
   - [Read — Browse all posts](#read--browse-all-posts)
   - [Read — Open a single post](#read--open-a-single-post)
   - [Create — Write a new post](#create--write-a-new-post)
   - [Update — Edit an existing post](#update--edit-an-existing-post)
   - [Delete — Remove a post](#delete--remove-a-post)
6. [Auth Flows](#6-auth-flows)
   - [Sign Up](#sign-up)
   - [Log In](#log-in)
   - [Log Out](#log-out)
   - [Session Check on Page Load](#session-check-on-page-load)
7. [Route Map — Quick Reference](#7-route-map--quick-reference)
8. [Glossary](#8-glossary)

---

## 1. The Big Picture

There are **three layers** between the user's screen and the data.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│   YOUR BROWSER                                                             │
│   ┌─────────────────────────────────────────┐                             │
│   │  React UI  (Next.js, components, hooks) │                             │
│   │  What you see and click                 │                             │
│   └──────────────────┬──────────────────────┘                             │
│                      │  HTTP request (same domain, no external URL)        │
│                      ▼                                                     │
│   ┌─────────────────────────────────────────┐                             │
│   │  BFF — Backend For Frontend             │                             │
│   │  (Next.js Route Handlers in app/api/)   │                             │
│   │  A thin relay layer on the same server  │                             │
│   └──────────────────┬──────────────────────┘                             │
│                      │                                                     │
└──────────────────────┼─────────────────────────────────────────────────── ┘
                       │  HTTP request (server-to-server, hidden from browser)
                       ▼
          ┌────────────────────────┐
          │  .NET API              │
          │  (separate backend     │
          │   server + database)   │
          └────────────────────────┘
```

**In plain English:** The browser talks to the BFF. The BFF talks to the .NET API. The browser never talks to the .NET API directly — it doesn't even know it exists.

---

## 2. What Each Layer Does

### Layer 1 — React UI (the browser)

This is everything inside the `app/`, `components/`, and `hooks/` folders. It is the visual interface: pages, forms, buttons, lists.

- Renders what the user sees
- Captures what the user types or clicks
- Calls the **service layer** (`service/PersonalBlogService.ts`) to send and receive data
- Does **not** talk to the .NET API directly — only to `/api/...` routes on the same server

### Layer 2 — BFF / Route Handlers (`app/api/`)

BFF stands for **Backend For Frontend**. It is a set of small server-side functions that sit between the browser and the real backend. Each one lives in a file called `route.ts` inside a folder under `app/api/`.

What the BFF does on each request:
1. Receives the request from the browser
2. Extracts the user's auth cookie (the `access_token`) if needed
3. Forwards the request to the .NET API, adding an `Authorization` header
4. Normalizes (reshapes) the response data so the frontend always gets a consistent shape
5. Sends the result back to the browser

The browser only ever sees `/api/blogs`, `/api/auth/login`, etc. — local URLs on the same domain. The .NET API's address is never exposed.

### Layer 3 — .NET API (the backend)

A completely separate server. It owns the database and all business logic — authentication, post storage, user management. The frontend team doesn't need to know its internal structure; only the URL contract matters.

---

## 3. The BFF Pattern — Why It Exists

### The restaurant analogy

Think of ordering food at a restaurant:

```
You (browser)
  → tell the waiter what you want
      → waiter (BFF) goes to the kitchen
          → kitchen (.NET API) prepares the food
      → waiter brings the food back to you
  → you eat
```

You never walk into the kitchen. You don't know what equipment the kitchen uses. The waiter handles the translation between "I'd like the pasta" and whatever the kitchen needs to hear.

### Why not let the browser talk to .NET directly?

Three reasons:

**1. Security — hide the backend URL**
If the browser called `https://my-dotnet-api.com/blogs` directly, that URL would be visible to anyone who opens DevTools. This leaks information about your infrastructure and makes it easier to attack.

**2. Security — cookies stay server-side**
The JWT auth token is stored in an **HttpOnly cookie**. This means JavaScript running in the browser cannot read it. But when the browser makes a request, the browser automatically sends the cookie to the Next.js server. The BFF then reads the cookie on the server and adds it as a `Bearer` token header when calling the .NET API. The token itself never touches browser JavaScript.

**3. Data normalization**
The .NET API might return data in a shape that doesn't match what the React UI expects. The BFF transforms ("normalizes") it in one place so every component gets a consistent, predictable format.

---

## 4. How Authentication Works

```
LOG IN
──────
Browser      →   BFF /api/auth/login   →   .NET POST /api/auth/login
                                       ←   responds with Set-Cookie: access_token=...
             ←   BFF forwards the cookie header to the browser
Browser now has an HttpOnly cookie. JavaScript cannot read it.

SUBSEQUENT REQUESTS (e.g. create post)
───────────────────────────────────────
Browser sends request → cookie is attached automatically by the browser
BFF receives request → reads the cookie from request headers
BFF calls .NET API with Authorization: Bearer <token>
.NET validates the token → allows or rejects the request
```

**HttpOnly cookie — plain English:** When you log in, the server plants a small pass in your browser. The browser automatically shows this pass on every future request — you don't have to do anything. But crucially, JavaScript code (including malicious scripts) cannot read or steal the pass because it is marked `HttpOnly`. Only the server can read it.

---

## 5. CRUD Operations — Step by Step

CRUD = **C**reate, **R**ead, **U**pdate, **D**elete. These are the four things you can do with data.

---

### Read — Browse all posts

**User action:** Navigates to `/blogs`

```
Browser / React component
  │
  │  calls GetAllPosts() in PersonalBlogService.ts
  │
  ▼
GET /api/blogs                          ← BFF route (same domain, safe)
  │
  │  BFF (app/api/blogs/route.ts)
  │  → calls .NET API: GET /blogs
  │
  ▼
.NET API returns list of posts
  │
  │  BFF normalizes the data (normalizePosts)
  │  reshapes it to the Blog[] shape the UI expects
  │
  ▼
BFF returns { status: 200, data: Blog[] }
  │
  ▼
React component receives Blog[]
  → renders the list of posts on screen
```

**No auth required** — anyone can read posts.

---

### Read — Open a single post

**User action:** Clicks on a blog post title

```
Browser / React component
  │
  │  calls GetPostsById(id) in PersonalBlogService.ts
  │
  ▼
GET /api/blogById?id=<post-id>          ← BFF route
  │
  │  BFF → calls .NET API: GET /blogs/<id>
  │
  ▼
.NET API returns the single post
  │
  │  BFF normalizes and returns it
  │
  ▼
React renders the full post content
```

---

### Create — Write a new post

**User action:** Fills in the create-post form and clicks Submit

Auth is **required** — you must be logged in. The `access_token` cookie is sent automatically by the browser.

```
Browser / React component
  │
  │  usePostForm hook manages the form state (see hooks/usePostForm.ts)
  │  User types → handleInputChange validates each field
  │  validForSubmit becomes true → Submit button enables
  │  User clicks Submit
  │
  │  calls createPostApi(userId, formData) in PersonalBlogService.ts
  │
  ▼
POST /api/blogs/create                  ← BFF route
  body: { title, content, preview, userId }
  cookie: access_token (browser attaches this automatically)
  │
  │  BFF (app/api/blogs/create/route.ts)
  │  → reads access_token from the incoming cookie header
  │  → calls .NET API: POST /blogs/create/<userId>
  │     with Authorization: Bearer <token>
  │     and the post body
  │
  ▼
.NET API validates the token, saves the post to the database
  │
  ▼
BFF returns { status: 200, message: "Blog created successfully" }
  │
  ▼
React shows a success message / redirects
```

**Why pass userId in the URL?** The .NET API uses it to associate the post with the correct author in the database.

---

### Update — Edit an existing post

**User action:** Opens the edit page for a post, changes content, clicks Save

```
Browser
  │
  │  Page loads → calls GetPostsById(id) to pre-fill the form
  │  usePostForm hook → loadExistingData() populates all fields at once
  │  User edits → handleInputChange validates
  │  User clicks Save
  │
  │  calls editPostApi(userId, updatedData) in PersonalBlogService.ts
  │
  ▼
PUT /api/blogs/edit                     ← BFF route
  body: { title, content, preview, userId, postId }
  cookie: access_token
  │
  │  BFF → calls .NET API: PUT /blogs/edit
  │     with Authorization: Bearer <token>
  │
  ▼
.NET API validates token, finds the post by postId, updates it
  │
  ▼
BFF returns { status: 200, message: "Blog edited successfully" }
  │
  ▼
React shows success / redirects
```

**Note on `loadExistingData`:** This is why `usePostForm` has a fourth export that the other hooks don't. The edit flow needs to fill all form fields at once from the API — `loadExistingData` does a full state replacement in one call.

---

### Delete — Remove a post

**User action:** Clicks the delete button on a post

```
Browser
  │
  │  calls deletePostApi(postId, userId) in PersonalBlogService.ts
  │
  ▼
DELETE /api/blogs/delete                ← BFF route
  body: { postId, userId }
  cookie: access_token
  │
  │  BFF → calls .NET API: DELETE /blogs/<postId>
  │     with Authorization: Bearer <token>
  │
  ▼
.NET API validates token, deletes the post from the database
  │
  ▼
BFF returns success / failure
  │
  ▼
React updates the post list (removes the deleted post from UI)
```

---

## 6. Auth Flows

### Sign Up

```
Browser (SignUp form — useSignUpForm hook)
  │
  │  User fills all 6 fields → validForSubmit becomes true
  │  User clicks Sign Up
  │
  │  calls SignUpApi(formState) in PersonalBlogService.ts
  │  (maps formState fields → SignUpRequest body shape)
  │
  ▼
POST /api/auth/register                 ← BFF route
  body: { userName, password, confirmPassword, email, firstName, lastName }
  │
  │  BFF → calls .NET API: POST /api/auth/register
  │
  ▼
.NET API creates the user in the database
  │
  ▼
BFF returns { status: 200 } or { status: 400, message: "..." }
  │
  ▼
React shows success message or displays the error
```

---

### Log In

```
Browser (Login form — useLoginForm hook)
  │
  │  User fills userName + password → validForSubmit becomes true
  │  User clicks Log In
  │
  │  calls LoginApi(body) in PersonalBlogService.ts
  │
  ▼
POST /api/auth/login                    ← BFF route
  body: { userName, password }
  │
  │  BFF (app/api/auth/login/route.ts)
  │  → calls .NET API: POST /api/auth/login
  │
  ▼
.NET API validates credentials, returns user data + Set-Cookie: access_token=...
  │
  │  BFF normalizes user data (normalizeUser)
  │  BFF forwards the Set-Cookie header to the browser
  │     → browser now stores the HttpOnly access_token cookie
  │
  ▼
BFF returns { status: 200, data: normalizedUser }
  │
  ▼
React (AuthProvider) updates its state: isLoggedIn = true, user = normalizedUser
NavBar re-renders to show the user's name and logout button
```

---

### Log Out

```
Browser
  │
  │  User clicks Log Out
  │  calls logoutApi() in PersonalBlogService.ts
  │
  ▼
POST /api/auth/logout                   ← BFF route
  cookie: access_token (browser attaches automatically)
  │
  │  BFF → calls .NET API: POST /api/auth/logout
  │
  ▼
.NET API invalidates the session / clears the cookie
  │
  ▼
BFF returns success
  │
  ▼
React (AuthProvider) resets state: isLoggedIn = false, user = null
NavBar re-renders to show the login/signup links
```

---

### Session Check on Page Load

Every time the app first loads (or the user refreshes the page), React needs to know if the user is already logged in. It does this silently in the background.

```
Browser loads the page
  │
  │  AuthProvider mounts → calls GET /api/auth/me
  │  The access_token cookie is sent automatically
  │
  ▼
GET /api/auth/me                        ← BFF route
  │
  │  BFF (app/api/auth/me/route.ts)
  │  → reads access_token from the cookie header
  │  → if no cookie: immediately returns 401 (not authenticated)
  │  → if cookie present: calls .NET API: GET /api/auth/me
  │     with Authorization: Bearer <token>
  │
  ▼
.NET API validates the token, returns the user's profile
  │
  │  BFF normalizes the user data and returns it
  │
  ▼
AuthProvider sets: isLoggedIn = true, user = { id, name, email, ... }
The whole app now knows who is logged in — without the user doing anything
```

---

## 7. Route Map — Quick Reference

| What it does | Service function | BFF route | .NET API route | Auth? |
|---|---|---|---|---|
| Get all posts | `GetAllPosts()` | `GET /api/blogs` | `GET /blogs` | No |
| Get one post | `GetPostsById(id)` | `GET /api/blogById?id=` | `GET /blogs/<id>` | No |
| Log in | `LoginApi(body)` | `POST /api/auth/login` | `POST /api/auth/login` | No |
| Sign up | `SignUpApi(data)` | `POST /api/auth/register` | `POST /api/auth/register` | No |
| Check session | _(AuthProvider)_ | `GET /api/auth/me` | `GET /api/auth/me` | Cookie |
| Log out | `logoutApi()` | `POST /api/auth/logout` | `POST /api/auth/logout` | Cookie |
| Create post | `createPostApi(id, data)` | `POST /api/blogs/create` | `POST /blogs/create/<userId>` | Bearer |
| Edit post | `editPostApi(id, data)` | `PUT /api/blogs/edit` | `PUT /blogs/edit` | Bearer |
| Delete post | `deletePostApi(id, uid)` | `DELETE /api/blogs/delete` | `DELETE /blogs/<id>` | Bearer |

**Auth column key:**
- **No** — anyone can call this, no login needed
- **Cookie** — browser sends the `access_token` cookie automatically; BFF reads it
- **Bearer** — BFF extracts the cookie and adds `Authorization: Bearer <token>` when calling .NET

---

## 8. Glossary

**API** — Application Programming Interface. A defined way for two programs to talk to each other. In this project, the .NET API is the program that manages the blog data.

**BFF (Backend For Frontend)** — A server-side relay layer built specifically to serve one frontend. It sits between the browser and the real backend, handling auth and data transformation.

**Bearer token** — A string (the JWT) that proves who you are. You "bear" (carry) it in a request header: `Authorization: Bearer <token>`. The .NET API reads it and decides if you're allowed.

**Cookie** — A small piece of data the server asks the browser to store. The browser automatically sends it back on every request to the same domain. An **HttpOnly** cookie cannot be read by JavaScript, only by the server.

**CRUD** — Create, Read, Update, Delete. The four fundamental operations on any data.

**HTTP method** — The "verb" of a web request. `GET` = fetch data. `POST` = send new data. `PUT` = replace existing data. `DELETE` = remove data.

**HttpOnly cookie** — A cookie that JavaScript in the browser cannot access. Only the server can read it. This protects the auth token from being stolen by malicious scripts (XSS attacks).

**JWT (JSON Web Token)** — A compact, signed string that proves your identity. The .NET API creates one when you log in and validates it on every protected request.

**Normalization** — The BFF reshapes data from the .NET API's format into a consistent format the frontend expects. For example, the backend might return `userName` as `user_name` — the normalizer fixes this in one place.

**Route handler** — A Next.js server-side function in `app/api/*/route.ts` that responds to HTTP requests. These are the BFF endpoints.

**Service layer** — `service/PersonalBlogService.ts`. A set of functions the React components call to send/receive data. They call the BFF routes using Axios. Components never call the BFF directly with raw `fetch` or `axios` — they go through these service functions.

**SSR (Server-Side Rendering)** — Next.js can run React code on the server before sending HTML to the browser. The session check (`/api/auth/me`) uses this: the server fetches the user data before the page reaches the browser, so there's no flash of "not logged in".

---

## 9. BFF Boilerplate — Code Reference & Patterns

> **Why this section exists:** BFF route handlers all look similar but have important differences depending on whether they need auth, whether they normalize data, and what HTTP method they use. This section documents every pattern used in `app/api/` so you can orient yourself quickly after a break and confidently write a new route without accidentally missing a step.

---

### The HTTP Client — `utils/httpClientUtil.ts`

Every BFF route starts by calling `createHttpClient()`. This is the single function that knows the .NET API's address and configuration. No route hard-codes the base URL — it always comes from here.

```ts
// utils/httpClientUtil.ts

import axios from "axios";
import https from "https";

export const createHttpClient = () => {
  // In development, the .NET API runs with a self-signed SSL certificate.
  // Node.js rejects self-signed certs by default, so we disable that check
  // in non-production environments only. In production this agent is undefined
  // and the default Node.js SSL behaviour applies (real certs only).
  const devHttpsAgent =
    process.env.NODE_ENV !== "production"
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

  return axios.create({
    httpsAgent: devHttpsAgent,

    // All routes call httpClient.get("/blogs") etc. — the baseURL is prepended
    // automatically. Change the .NET API address here and every route updates.
    baseURL: "https://localhost:7052",

    // Abort the request if .NET doesn't respond within 5 seconds.
    timeout: 5000,

    // Send cookies along with cross-origin requests (needed for some flows).
    withCredentials: true,
  });
};
```

**Mental model:** Think of `createHttpClient()` as dialling into the .NET API. Every BFF route creates a fresh connection at the top of the function, uses it to make one request, then discards it.

---

### The Response Shape Contract

Every single BFF route returns the same JSON envelope to the browser:

```ts
{
  status: number,   // mirrors the HTTP status code (200, 400, 401, 500, ...)
  data: T | null,   // the payload; null when there's nothing to return or on error
  message: string,  // human-readable description of what happened
}
```

This is a contract between the BFF and the service layer (`PersonalBlogService.ts`). The service layer always reads `response.data.data` to get the payload and can check `response.data.status` or `response.data.message` for context. If you add a new route, follow this shape exactly — otherwise the service layer will break silently.

---

### The Cookie Extraction Pattern

Protected routes (create, edit, delete, session check) need to forward the user's identity to the .NET API as a `Bearer` token. The identity lives in the `access_token` HttpOnly cookie that the browser sends automatically on every request.

Because it's HttpOnly, browser JavaScript can't read it — but BFF server code can, via the `request.headers` object. This snippet appears in every protected route:

```ts
// Get the raw Cookie header string — looks like:
//   "access_token=eyJhbG...; other_cookie=abc"
const cookieHeader = request.headers.get("cookie") ?? "";

// Split on ";" to get individual cookie strings, trim whitespace,
// find the one that starts with "access_token=",
// then strip the "access_token=" prefix to get just the token value.
const accessToken = cookieHeader
  .split(";")
  .map((c) => c.trim())
  .find((c) => c.startsWith("access_token="))
  ?.slice("access_token=".length);

// Then pass it to the .NET API call:
headers: {
  ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
}
// The spread is conditional: if accessToken is undefined (no cookie),
// the Authorization header is simply not added.
// The .NET API will then return 401 Unauthorized.
```

**Why not just forward the cookie directly to .NET?**
The .NET API expects an `Authorization: Bearer <token>` header, not a cookie. The BFF acts as the translator — it reads the cookie and converts it into the header format .NET understands.

---

### The Error Handling Pattern

Every route wraps everything in `try / catch` and handles two distinct error cases:

```ts
try {
  // ... happy path ...
} catch (error) {

  // CASE 1: Axios error — the .NET API responded with a non-2xx status.
  // error.response holds the actual HTTP response from .NET.
  // We extract the status and any error message the backend sent.
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const errorData = error.response?.data || {};

    return NextResponse.json(
      {
        status,
        data: null,
        message: errorData?.message ?? "Descriptive fallback message",
      },
      { status },
    );
  }

  // CASE 2: Unknown error — something crashed before/during the request
  // (network down, JSON parse failure, code bug, etc.).
  // We don't know the status so we default to 500.
  return NextResponse.json(
    {
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "An error occurred.",
    },
    { status: 500 },
  );
}
```

**Why two cases?** An Axios error means the .NET API was reachable and deliberately sent back a failure (e.g. 401 wrong password, 400 bad input). An unknown error means something broke at the infrastructure or code level before a response was even received. They need different handling because only Axios errors have a `.response` object to inspect.

---

### Pattern A — Public GET (no auth, with normalization)

Used by: `app/api/blogs/route.ts`, `app/api/blogById/route.ts`

No cookie needed. The .NET API is open to anyone. The BFF's only job is to fetch the data and normalize it into the shape the frontend expects.

```ts
// app/api/blogs/route.ts — annotated boilerplate

import { normalizePosts } from "@/utils/mapping/mappers";
import { UpstreamBlogsResponse } from "@/types/types";
import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";

// The function name must match the HTTP method in UPPERCASE.
// Next.js reads this export to know "this file handles GET requests".
export async function GET(request: Request) {
  try {
    // Fresh axios instance pointed at the .NET API base URL.
    const httpClient = createHttpClient();

    // Make the actual call to .NET. The path is relative to baseURL.
    // httpClient.get("/blogs") → GET https://localhost:7052/blogs
    const response = await httpClient.get("/blogs");

    // Type the raw response so TypeScript can check our normalization.
    // UpstreamBlogsResponse describes what .NET actually sends back.
    const data: UpstreamBlogsResponse = response.data;

    // Normalization: reshape .NET's format into the Blog[] shape the
    // React components expect. Lives in utils/mapping/mappers.ts.
    // Do this in the BFF so every consumer gets consistent data —
    // you only have to fix the shape in one place if .NET changes.
    const normalizedPosts = normalizePosts(data);

    // Return the standard envelope to the browser.
    return NextResponse.json(
      { status: 200, data: normalizedPosts, message: "Posts fetch successful" },
      { status: 200 },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};
      return NextResponse.json(
        { status, data: null, message: errorData?.message ?? "Posts fetch failed" },
        { status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: error instanceof Error ? error.message : "An error occurred." },
      { status: 500 },
    );
  }
}
```

---

### Pattern B — Public GET with query parameter

Used by: `app/api/blogById/route.ts`

Same as Pattern A but the caller passes an id in the URL (`/api/blogById?id=123`). The BFF reads it from `searchParams` and validates it before hitting .NET.

```ts
// app/api/blogById/route.ts — annotated boilerplate

import { normalizePost } from "@/utils/mapping/mappers";
import { UpstreamBlogByIdResponse } from "@/types/types";
import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";

export async function GET(request: Request) {
  try {
    // Next.js passes the full Request object. Parse the URL to get query params.
    // request.url looks like "http://localhost:3000/api/blogById?id=abc123"
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");  // "abc123" or null if missing

    // Always validate required params before hitting .NET.
    // Returning 400 here prevents a confusing error from the backend.
    if (!id) {
      return NextResponse.json(
        { status: 400, data: null, message: "Missing blog id" },
        { status: 400 },
      );
    }

    const httpClient = createHttpClient();

    // Interpolate the id into the .NET route path.
    const response = await httpClient.get(`/blogs/${id}`);

    const data: UpstreamBlogByIdResponse = response.data;
    const normalizedPost = normalizePost(data);

    return NextResponse.json(
      { status: 200, data: normalizedPost, message: "Post fetch successful" },
      { status: 200 },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};
      return NextResponse.json(
        { status, data: null, message: errorData?.message ?? "Post fetch failed" },
        { status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: error instanceof Error ? error.message : "An error occurred." },
      { status: 500 },
    );
  }
}
```

---

### Pattern C — Protected POST/PUT/DELETE (cookie → Bearer)

Used by: `app/api/blogs/create/route.ts`, `app/api/blogs/edit/route.ts`, `app/api/blogs/delete/route.ts`

The user must be logged in. The BFF extracts the `access_token` from the incoming cookie and sends it as an `Authorization: Bearer` header to the .NET API. No normalization needed — .NET just returns a success/failure message.

```ts
// app/api/blogs/create/route.ts — annotated boilerplate

import { SavePostRequest } from "@/types/types";
import { createHttpClient } from "@/utils/httpClientUtil";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the JSON body sent by the browser.
    // Type it so TypeScript knows the expected shape.
    const body: SavePostRequest = await request.json();

    const httpClient = createHttpClient();

    // ── Cookie extraction (see "Cookie Extraction Pattern" above) ──────────
    const cookieHeader = request.headers.get("cookie") ?? "";
    const accessToken = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("access_token="))
      ?.slice("access_token=".length);
    // ───────────────────────────────────────────────────────────────────────

    // Call .NET with the Bearer token.
    // The conditional spread means: only add the Authorization header if
    // accessToken is defined. If it's missing, .NET will return 401.
    const response = await httpClient.post(
      `/blogs/create/${body.userId}`,   // userId goes in the URL — .NET uses it to associate the post
      body,                             // body carries title, content, preview
      {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      },
    );

    return NextResponse.json(
      { status: 200, data: response.data, message: "Blog created successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data || {};
      return NextResponse.json(
        { status, data: null, message: errorData?.Message ?? errorData?.message ?? "Not able to create blog." },
        { status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
}
```

The `edit` and `delete` routes follow the exact same structure — only the HTTP method (`PUT` / `DELETE`), the .NET path, and the body shape change:

```ts
// edit  → httpClient.put(`/blogs/${body.postId}/users/${body.userId}`, body, { headers })
// delete → httpClient.delete(`/blogs/${body.postId}/users/${body.userId}/delete`, { headers })
```

---

### Pattern D — Login (forward Set-Cookie from .NET to browser)

Used by: `app/api/auth/login/route.ts`

Login is unique: it does not need an existing cookie (the user isn't logged in yet). Instead, .NET responds with a `Set-Cookie` header containing the new `access_token`. The BFF must forward that header to the browser — otherwise the cookie never lands in the browser and every subsequent request will fail auth.

```ts
// app/api/auth/login/route.ts — annotated boilerplate

import { normalizeUser } from "@/utils/mapping/mappers";
import { UpstreamLoginResponse } from "@/types/types";
import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // { userName, password }
    const httpClient = createHttpClient();

    // Forward credentials to .NET. .NET validates them and, on success,
    // returns user data AND a Set-Cookie: access_token=... header.
    const response = await httpClient.post("/api/auth/login", body, {
      headers: { "Content-Type": "application/json" },
    });

    const data: UpstreamLoginResponse = response.data;

    // Normalize the user object from .NET's shape to the frontend's shape.
    const normalizedUser = normalizeUser(data);

    // Build the response we'll send back to the browser.
    const nextResponse = NextResponse.json(
      { status: 200, data: normalizedUser, message: "Login successful" },
      { status: 200 },
    );

    // ── Cookie forwarding — THE CRITICAL LOGIN STEP ────────────────────────
    // Axios does not automatically forward Set-Cookie headers to the caller.
    // We must read them from the .NET response and re-attach them to the
    // response we send to the browser. Without this, the browser never
    // receives the access_token cookie and the user isn't really logged in.
    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      // set-cookie may be a single string or an array of strings.
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookies.forEach((cookie) =>
        nextResponse.headers.append("Set-Cookie", cookie),
      );
    }
    // ───────────────────────────────────────────────────────────────────────

    return nextResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};
      return NextResponse.json(
        { status, data: null, message: errorData?.message ?? "Login failed" },
        { status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: error instanceof Error ? error.message : "An error occurred during login." },
      { status: 500 },
    );
  }
}
```

---

### Pattern E — Session check (cookie → Bearer, early return if missing)

Used by: `app/api/auth/me/route.ts`

Called silently on every page load by `AuthProvider`. If there's no cookie the user isn't logged in — return 401 immediately without touching .NET. If there is a cookie, validate it with .NET and return the user profile.

```ts
// app/api/auth/me/route.ts — annotated boilerplate

import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";
import { normalizeUser } from "@/utils/mapping/mappers";

export async function GET(request: Request) {
  try {
    const httpClient = createHttpClient();

    // Extract the token exactly as in Pattern C.
    const cookieHeader = request.headers.get("cookie") ?? "";
    const accessToken = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

    // Early return: if there's no token, don't bother calling .NET.
    // The user is not logged in. Return 401 immediately.
    // This is an optimisation — it avoids an unnecessary round-trip to .NET.
    if (!accessToken) {
      return NextResponse.json(
        { status: 401, data: null, message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Token present — ask .NET to validate it and return the user profile.
    const response = await httpClient.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const normalizedUser = normalizeUser(response.data);

    return NextResponse.json(
      { status: 200, data: normalizedUser, message: "User information retrieved successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};
      return NextResponse.json(
        { status, data: null, message: errorData?.message ?? "Failed to retrieve user information" },
        { status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: error instanceof Error ? error.message : "An error occurred." },
      { status: 500 },
    );
  }
}
```

---

### Pattern F — Logout (delete the cookie on the BFF side)

Used by: `app/api/auth/logout/route.ts`

Tells .NET to invalidate the session, then tells the browser to delete the cookie by calling `res.cookies.delete("access_token")`. Both steps matter — skipping .NET means the token may still be valid server-side; skipping the cookie delete means the browser keeps sending a dead token on future requests.

```ts
// app/api/auth/logout/route.ts — annotated boilerplate

import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";

export async function POST(request: Request) {
  try {
    const httpClient = createHttpClient();

    // Tell .NET the session is over. .NET may invalidate the token in its store.
    await httpClient.post("/api/auth/logout", null);

    const res = NextResponse.json(
      { status: 200, data: null, message: "Logout successful" },
      { status: 200 },
    );

    // Instruct the browser to delete the access_token cookie.
    // Next.js sets a Set-Cookie header with Max-Age=0 under the hood,
    // which tells the browser to expire and remove the cookie immediately.
    res.cookies.delete("access_token");

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};
      return NextResponse.json(
        { status, data: null, message: errorData?.message ?? "Logout failed" },
        { status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: error instanceof Error ? error.message : "An error occurred during logout." },
      { status: 500 },
    );
  }
}
```

---

### Pattern summary

| Pattern | Auth needed? | Reads cookie? | Sends Bearer? | Normalizes? | Forwards Set-Cookie? | Deletes cookie? |
|---|---|---|---|---|---|---|
| A — Public GET | No | No | No | Yes | No | No |
| B — Public GET + query param | No | No | No | Yes | No | No |
| C — Protected write | Yes | Yes | Yes | No | No | No |
| D — Login | No | No | No | Yes (user) | Yes | No |
| E — Session check | Yes (early exit) | Yes | Yes | Yes (user) | No | No |
| F — Logout | No | No | No | No | No | Yes |

---

### Checklist — adding a new BFF route

When adding a new endpoint, work through this list top to bottom:

- [ ] Create the file at `app/api/<path>/route.ts`
- [ ] Export a function named after the HTTP method in uppercase (`GET`, `POST`, `PUT`, `DELETE`)
- [ ] Call `createHttpClient()` at the top of the `try` block
- [ ] If the route needs auth: extract `accessToken` from the cookie header (see cookie extraction pattern above)
- [ ] If the route accepts a body: `const body = await request.json()` and type it
- [ ] If the route accepts query params: parse via `new URL(request.url).searchParams`
- [ ] Validate required inputs before calling .NET — return 400 if missing
- [ ] Call `.NET` via `httpClient.get/post/put/delete(path, body?, { headers? })`
- [ ] If the response data needs reshaping: call the appropriate normalizer from `utils/mapping/mappers.ts`
- [ ] Return `NextResponse.json({ status, data, message }, { status })` — always the same envelope
- [ ] Add error handling: Axios error case first, unknown error case second
- [ ] Add the corresponding service function in `PersonalBlogService.ts` that calls this route
- [ ] Add the route to the Route Map table in this document (Section 7)

---

## 10. Form Component Boilerplate — Code Reference & Patterns

> **Why this section exists:** Every form component in this project follows the same structure — a custom hook for field state, a local `useState` for the alert banner, one or more `useEffect` hooks for side effects, and a JSX `<form>` with controlled inputs. This section explains each piece in depth so you can read, write, or modify any form component after a long break without having to reverse-engineer the pattern from scratch.

---

### Component vs. Hook — what's the difference?

Before anything else, it helps to understand why form logic is split across two files.

```
┌──────────────────────────────────────────────────┐
│  Form Component  (e.g. EditProfileForm.tsx)      │
│                                                  │
│  Owns:                                           │
│    - the JSX (what the screen looks like)        │
│    - the alert banner state (show/hide message)  │
│    - the submit handler (calls the service)      │
│    - side effects tied to the UI lifecycle       │
│                                                  │
│  Does NOT own:                                   │
│    - field values, errors, or touched flags      │
│    - field-level validation logic                │
└──────────────────────┬───────────────────────────┘
                       │  calls
                       ▼
┌──────────────────────────────────────────────────┐
│  Custom Hook  (e.g. useEditProfileForm.ts)       │
│                                                  │
│  Owns:                                           │
│    - formState (all field values, errors,        │
│      touched flags, validForSubmit)              │
│    - handleInputChange (validates on every key)  │
│    - handleBlur (marks a field as touched)       │
└──────────────────────────────────────────────────┘
```

The component renders the screen. The hook manages what the user has typed and whether it's valid. They are connected by destructuring at the top of the component.

---

### The `"use client"` directive

Every form component starts with this line:

```ts
"use client";
```

**Plain English:** Next.js can render components on the server (before the page reaches the browser) or on the client (in the browser, after the page loads). `useState` and `useEffect` only work in the browser — they need to respond to user actions and timers, which don't exist on a server. Writing `"use client"` at the top of the file tells Next.js: "run this component in the browser, not on the server." Without it, you'll get an error the moment you try to use `useState` or `useEffect`.

---

### Full component anatomy

Here is the skeleton of every form component, in the order things appear and run:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. "use client"        tells Next.js: run this in the browser  │
│  2. imports             bring in hooks, components, services    │
│  3. component function  the component itself                    │
│     ├── custom hook     get formState + handlers from the hook  │
│     ├── useRouter       for redirecting after success           │
│     ├── useState        local alert banner state                │
│     ├── useEffect(s)    side effects (timers, data loading,     │
│     │                   URL param reads)                        │
│     └── return (JSX)    the actual HTML the user sees           │
│          ├── AlertMessage  shown/hidden via CSS                 │
│          ├── <form>        with onSubmit handler                │
│          │    ├── InputFormField × N  (one per field)           │
│          │    └── <button disabled={!formState.validForSubmit}> │
│          └── ...other layout                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### `useState` — the alert banner

The custom hook owns field-level state. But there is one piece of state the component owns itself: the **alert banner** — the green/red message that appears after a form submission.

```ts
// From LoginForm.tsx, SignUpForm.tsx, EditProfileForm.tsx

const [alert, setAlert] = useState<Alert>({
  show: false,     // is the banner currently visible on screen?
  message: "",     // what text does it display?
  apiStatus: 0,    // what HTTP status did the API return? (used to pick colour)
});
```

**Why `useState` and not the hook?**
The alert is about the *result of submitting the form* — it has nothing to do with validating individual fields. It lives in the component because it is UI-level feedback tied to a network call, not a form field. The hook stays focused on field state only.

**Why three properties?**

- `show` — the single on/off switch. The `AlertMessage` component is always rendered in the DOM; `show` controls whether it is visible via CSS class. Keeping it in the DOM avoids a layout jump when it appears (see the CSS visibility section below).
- `message` — text comes from the API response (`result.message`). On a 401 it might be "Invalid credentials". On a 400 it might be "Username already taken".
- `apiStatus` — used to decide the banner colour. Status 200 → teal (success). Anything else → red (error):
  ```tsx
  <AlertMessage variant={alert.apiStatus !== 200 ? "error" : "default"} />
  ```

**How `setAlert` is called:**

```ts
// On a failed API call — show the red error banner:
setAlert((prev) => ({
  ...prev,           // keep existing properties
  show: true,        // make it visible
  message: result.message,
  apiStatus: result.status,
}));

// The functional updater (prev => ...) is used here for the same reason
// as in the hooks — it avoids reading a stale snapshot of alert when
// multiple state updates might be scheduled close together.
```

---

### `useEffect` #1 — auto-dismissing the alert after N seconds

This effect appears in **every** form component. It automatically hides the alert banner after a timeout so the user does not have to manually dismiss it.

```ts
// From EditProfileForm.tsx (10 seconds) and LoginForm.tsx (5 seconds)

useEffect(() => {
  // The body of a useEffect runs AFTER the component renders.
  // "after renders" means: React drew the screen first, then ran this code.

  if (alert.show) {
    // Schedule a function to run after 10 seconds.
    // setTimeout returns an ID we can use to cancel it if needed.
    const timer = setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));  // hide the banner
    }, 10000);

    // ── THE CLEANUP FUNCTION ───────────────────────────────────────────────
    // Returning a function from useEffect registers a "cleanup".
    // React calls this cleanup in two situations:
    //   1. Before this effect runs again (if alert.show changes again)
    //   2. When the component is removed from the screen entirely
    //
    // Without the cleanup, you get a bug: if the user submits the form again
    // before 10 seconds are up, a second timer starts — but the first timer
    // is still running. When the first timer fires, it hides the NEW alert
    // that was just shown. The cleanup cancels the old timer before that
    // can happen.
    return () => clearTimeout(timer);
    // ────────────────────────────────────────────────────────────────────────
  }

  // The dependency array [alert.show] tells React:
  // "Only re-run this effect when alert.show changes."
  // If you left the array empty ([]), it would only run once on mount.
  // If you omitted the array entirely, it would run after every single render.
}, [alert.show]);
```

**Mental model for the cleanup function:**

Think of `useEffect` like setting an alarm on your phone. If you set a second alarm before the first one goes off, you want to cancel the first one — otherwise both alarms will fire and cause confusion. The `return () => clearTimeout(timer)` is the "cancel the old alarm before setting a new one" step.

---

### `useEffect` #2 — reading a URL query parameter on mount

Used in: `LoginForm.tsx`

After a successful sign-up, the app redirects to `/identity/login?registered=true`. The login form reads this query parameter to show a "Account created! Please log in." success banner without the user having done anything.

```ts
// From LoginForm.tsx

const searchParams = useSearchParams();  // Next.js hook — reads the URL query string

useEffect(() => {
  // searchParams.get("registered") reads the value of ?registered= in the URL.
  // It returns null if the param is not present.
  if (searchParams.get("registered") === "true") {
    setAlert({
      show: true,
      message: "Account created! Please log in.",
      apiStatus: 200,   // 200 → teal (success) colour
    });
  }

  // Dependency array: [searchParams]
  // Re-run this effect if the URL query string changes.
  // In practice this runs once on mount because the URL doesn't change
  // while the component is on screen.
}, [searchParams]);
```

**Why `useEffect` and not just an `if` statement in the function body?**

React components re-render many times. An `if` statement in the function body would run on every render — it would repeatedly call `setAlert`, causing an infinite loop (setAlert triggers a re-render, which runs the `if` again, which calls setAlert again...). `useEffect` only runs when the dependencies change, which is exactly once here.

---

### `useEffect` #3 — loading existing data into the form on mount

Used in: `SavePostForm.tsx` (edit-post flow)

When editing an existing post, the form needs to be pre-filled with the post's current title, preview, and content. This data comes from the API (or localStorage in dev). The `useEffect` runs after the component mounts and calls `loadExistingData` from the hook.

```ts
// From SavePostForm.tsx

// isLoading prevents the form from flashing empty before data arrives.
// Starts as true so the form is hidden until we know what to show.
const [isLoading, setIsLoading] = useState(true);

const { formState, handleInputChange, handleBlur, loadExistingData } =
  usePostForm({ title: "", preview: "", content: "" });

useEffect(() => {
  // mode tells us whether we're creating, editing a published post, or editing a draft.
  if (mode === FormMode.EditPublished) {

    // blogData arrives as a prop from the server (Next.js fetched it before the page loaded).
    // USE_LOCAL_STORAGE_FALLBACK is a dev-only flag — in production blogData is always present.
    let blogToEdit = blogData;
    if (!blogToEdit && USE_LOCAL_STORAGE_FALLBACK && blogData?.id) {
      blogToEdit = getBlogByIdFromStorage(blogData.id);
    }

    if (blogToEdit) {
      // loadExistingData replaces the entire hook formState in one call.
      // This is why usePostForm has this extra export — the edit flow needs a
      // full state replacement, not field-by-field updates.
      loadExistingData(blogToEdit);
    }

  } else if (mode === FormMode.EditDraft) {
    const draftToEdit = blogData?.id ? getDraftByIdFromStorage(blogData.id) : null;
    if (draftToEdit) {
      loadExistingData(draftToEdit);
    }
  }

  // Whatever happened above, loading is done. Show the form.
  setIsLoading(false);

  // Dependency array: [mode, blogData?.id]
  // Re-run if the mode changes or a different post is loaded.
  // blogData?.id (not the whole blogData object) keeps this stable —
  // checking the whole object would cause the effect to re-run on every
  // render because object references change even when values don't.
}, [mode, blogData?.id]);

// While loading, return nothing — let the server loading state handle the screen.
if (isLoading) return null;
```

**Why `blogData?.id` in the dependency array instead of `blogData`?**

React compares dependency array values with `===` (strict equality). Two objects with the same contents are *not* equal by `===` — they are different references. If you put the whole `blogData` object in the array, React would think the data changed on every render and re-run the effect endlessly. Using `blogData?.id` (a string or undefined) uses primitive equality, which is stable.

---

### Controlled inputs — how `InputFormField` wires to the hook

Every input in the project is a **controlled input**. This means React owns the displayed value — not the browser's native input state.

```tsx
// The InputFormField component (components/blog/save/InputFormField.tsx)
// is a thin wrapper that renders a <label> + <input> + error message.
// Here is how it's called from a form component:

<InputFormField
  formLabelProps={{
    htmlFor: "username",
    className: "block text-sm font-semibold text-gray-700 mb-2",
    children: "Username",   // the label text
  }}
  inputFormProps={{
    type: "text",
    id: "username",
    name: "username",
    placeholder: "Username",

    // ── CONTROLLED INPUT: value comes FROM React state ─────────────────────
    // This is what makes it "controlled". React sets what the input shows.
    // If formState.userName.value is "jo", the input displays "jo".
    // The user cannot change what's displayed without going through setFormState.
    value: formState.userName.value,
    // ─────────────────────────────────────────────────────────────────────────

    // ── onChange: user types → hook updates state → React re-renders ────────
    // The input fires onChange on every keystroke. We call handleInputChange,
    // which validates and updates formState. React re-renders, the new value
    // appears in the input. The cycle is:
    //   user types → onChange fires → handleInputChange → setFormState →
    //   React re-renders → new value prop flows back into the input
    onChange: (value: string) => handleInputChange("userName", value),
    // ─────────────────────────────────────────────────────────────────────────

    // onBlur fires when the user leaves the field.
    // Calls handleBlur, which sets touched: true on this field.
    onBlur: () => handleBlur("userName"),

    // Dynamic border colour — red if there's an error, teal otherwise.
    // This ternary reads formState.userName.error (empty string = no error).
    className: `... ${
      formState.userName.error
        ? "border-red-300 focus:border-red-500"
        : "border-gray-200 focus:border-teal-500"
    }`,

    // The error message string. InputFormField renders an <ErrorMessage>
    // below the input when this is truthy. Empty string = nothing shown.
    formError: formState.userName.error,
  }}
/>
```

**Inside InputFormField** — what it does with those props:

```tsx
// components/blog/save/InputFormField.tsx (simplified)

const InputFormField = ({ formLabelProps, inputFormProps }) => (
  <>
    <div>
      <label htmlFor={formLabelProps.htmlFor}>{formLabelProps.children}</label>
      <input
        value={inputFormProps.value}                          // controlled
        onChange={(e) => inputFormProps.onChange(e.target.value)}  // fires on keypress
        onBlur={inputFormProps.onBlur}                        // fires on leaving field
        // ... other props
      />
    </div>
    {/* Only renders if formError is a non-empty string */}
    {inputFormProps.formError && (
      <ErrorMessage message={inputFormProps.formError} />
    )}
  </>
);
```

---

### CSS-based alert visibility — why the banner is always in the DOM

The `AlertMessage` component is never conditionally rendered with `{alert.show && <AlertMessage />}`. Instead, it is always in the DOM and shown/hidden purely via CSS classes:

```tsx
// From LoginForm.tsx and SignUpForm.tsx

<div
  className={`overflow-hidden transition-all duration-300 ease-out ${
    alert.show
      ? "mb-4 max-h-24 opacity-100"   // visible — has height and is opaque
      : "mb-0 max-h-0 opacity-0"      // hidden — zero height and transparent
  }`}
>
  <AlertMessage
    message={alert.message}
    variant={alert.apiStatus !== 200 ? "error" : "default"}
  />
</div>
```

**Why not just `{alert.show && <AlertMessage />}`?**

Using `&&` to conditionally render adds or removes the element from the DOM entirely. When it appears, the layout has to recalculate and the page jumps. Using `max-h-0 opacity-0` keeps the element in the DOM at zero height — when it becomes visible, the `transition-all duration-300` CSS smoothly animates the height and opacity, giving a slide-in effect with no layout jump.

---

### The `onSubmit` handler — complete flow

The form's submission logic lives in the `onSubmit` prop on the `<form>` element. Here is the full pattern annotated:

```tsx
<form
  onSubmit={async (e) => {

    // STEP 1: Stop the browser's default form behaviour.
    // By default, submitting a form causes the browser to navigate to a new URL
    // (a full page reload). We want to handle the submission ourselves with JS.
    e.preventDefault();

    // STEP 2: Guard — only proceed if the hook says all fields are valid.
    // validForSubmit is a boolean derived inside the hook from all field states.
    // The submit button is already disabled when this is false, but this guard
    // is a second line of defence in case the button is somehow triggered anyway.
    if (formState.validForSubmit) {

      // STEP 3: Call the service layer with the form data.
      // The service function calls the BFF, which calls .NET.
      // await pauses here until the API responds.
      let result = await SomeApiFunction(formState);

      // STEP 4: Handle the response.

      if (result.status === 200 || result.status === 201) {
        // SUCCESS PATH: redirect the user to the next page.
        // router.push() navigates without a full page reload.
        // A query param like ?registered=true carries context to the next page
        // (e.g. to show a "Registration successful" banner on the login page).
        router.push("/some/path?successParam=true");

      } else {
        // ERROR PATH: show the alert banner with the API's error message.
        // setAlert triggers a React re-render; the banner becomes visible.
        // The useEffect auto-dismiss timer will hide it after N seconds.
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
```

---

### The submit button — gated by `validForSubmit`

```tsx
<button
  type="submit"
  // disabled={true} prevents the click from firing onSubmit at all.
  // When false, the button is clickable and the submit handler runs.
  disabled={!formState.validForSubmit}

  // Tailwind classes swap based on validForSubmit:
  //   valid   → normal cursor, hover darkens the button
  //   invalid → muted opacity, "not-allowed" cursor signals to the user
  className={`w-full bg-teal-600 text-white font-semibold py-3.5 rounded-2xl ${
    formState.validForSubmit
      ? "hover:bg-teal-700 cursor-pointer"
      : "opacity-40 blur-[0.5px] cursor-not-allowed"
  }`}
>
  Save Changes
</button>
```

---

### Component render lifecycle — what runs and when

This is what happens from first load to user interaction, in order:

```
FIRST RENDER
─────────────
1. React calls the component function top to bottom:
     - custom hook runs → formState initialised with empty/pre-filled values
     - useRouter initialised
     - useState(alert) initialised with show:false, message:"", apiStatus:0
     - useEffect registrations are SCHEDULED but not run yet
2. The JSX is evaluated → React draws the screen
3. useEffect #1 (alert timer) runs — alert.show is false so nothing happens
4. useEffect #2 (query param check) runs — checks URL for ?registered=true etc.
5. useEffect #3 (data loading, if present) runs — calls loadExistingData if editing

USER TYPES IN A FIELD
──────────────────────
1. Browser fires onChange
2. handleInputChange(field, value) runs in the hook
3. setFormState is called (twice, batched) → React re-renders
4. Component function runs top to bottom again:
     - useState/useEffect registrations re-run as declarations only
     - New formState snapshot available — input shows new value, error if any
5. useEffect #1 does NOT re-run because alert.show did not change

USER LEAVES A FIELD (blur)
───────────────────────────
1. Browser fires onBlur
2. handleBlur(field) runs in the hook
3. setFormState queues touched:true → React re-renders
4. If field.error is non-empty AND field.touched is now true,
   the <ErrorMessage> renders below the input

USER SUBMITS (valid form)
──────────────────────────
1. onSubmit fires → e.preventDefault()
2. formState.validForSubmit check passes
3. await ApiFunction(...) — React does nothing while waiting
4. API responds → success path: router.push() → navigates away
                   error path: setAlert({ show:true, ... }) → re-render
5. Re-render: alert banner becomes visible (CSS transitions to max-h-24 opacity-100)
6. useEffect #1 re-runs (alert.show changed from false → true):
   - sets a setTimeout for N seconds
   - returns cleanup function
7. N seconds later: timer fires → setAlert({ show:false })
8. Re-render: banner CSS transitions back to max-h-0 opacity-0
9. useEffect #1 re-runs (alert.show changed from true → false):
   - alert.show is false, so the if block is skipped
   - no timer is set
```

---

### Checklist — adding a new form component

- [ ] Add `"use client"` as the very first line
- [ ] Import the matching custom hook (`useLoginForm`, `useSignUpForm`, etc.)
- [ ] Destructure `{ formState, handleInputChange, handleBlur }` (add `loadExistingData` if it's an edit form)
- [ ] Add `useState<Alert>` with `{ show: false, message: "", apiStatus: 0 }`
- [ ] Add the auto-dismiss `useEffect` with `[alert.show]` dependency and `clearTimeout` cleanup
- [ ] If the component reads a URL query param on mount: add a `useEffect` with `[searchParams]`
- [ ] If the component pre-fills data from an API: add a loading `useEffect` and `isLoading` state
- [ ] Wrap the form in `<form onSubmit={async (e) => { e.preventDefault(); ... }}>`
- [ ] Guard with `if (formState.validForSubmit)` before calling the service
- [ ] Call the service function and `await` the result
- [ ] On success: `router.push()` to the next page
- [ ] On error: `setAlert({ show: true, message: result.message, apiStatus: result.status })`
- [ ] Wrap the `<AlertMessage>` in a CSS-transition div (not conditional rendering)
- [ ] Render one `<InputFormField>` per field, passing `value`, `onChange`, `onBlur`, `formError`
- [ ] Gate the submit button with `disabled={!formState.validForSubmit}`
