# Personal Blog — Frontend

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP**: Axios
- **Other**: `uuid` for client-side ID generation

## Project Structure

```
app/                    # Next.js App Router pages + BFF route handlers
  api/                  # BFF route handlers (proxy to .NET backend)
    auth/login|logout|me|register/
    blogs/              # GET all, POST create
    blogById/           # GET by ID
  blogs/
    page.tsx            # Blog list
    [id]/page.tsx       # Blog detail
    create/page.tsx     # New post form
    edit/[id]/page.tsx  # Edit post form
    draft/[id]/page.tsx # Draft viewer
  identity/
    login/page.tsx
    signup/page.tsx
  layout.tsx            # Root layout (NavBar, Footer, AuthProvider)
  page.tsx              # Home (HeroSection)

components/
  auth/                 # LoginForm, SignUpForm
  blog/                 # BlogItem, BlogDetails, Blogs, Pagination, etc.
  blog/save/            # SavePostForm, SaveFormCard, InputFormField, etc.
  home/                 # HeroSection, CallToAction
  shared/               # NavBar, Footer, Loader, AlertMessage, ErrorMessage, WarningIcon

hooks/
  useLoginForm.ts       # Login form state + submission logic
  useSignUpForm.ts      # Sign-up form state + submission logic
  usePostForm.ts        # Blog post form state + submission logic

service/
  PersonalBlogService.ts  # All API calls (GetAllPosts, GetPostsById, LoginApi, SignUpApi, logoutApi, createPostApi)

providers/
  auth-provider.tsx     # AuthContext + AuthProvider + useAuth hook

utils/
  authUtil.ts
  httpClientUtil.ts     # Axios instance factory
  browser/InMemory.ts
  browser/LocalStorage.ts
  forms/FormHelpers.ts
  mapping/mappers.ts
  pagination/Filtering.ts
  pagination/VisiblePostSetttings.ts

types/types.ts          # All shared TypeScript types (Blog, User, LoginRequest/Response, etc.)
formHelpers/            # formTypes.ts, formUtils.ts
```

## BFF Pattern
Next.js route handlers in `app/api/` act as a Backend-for-Frontend, proxying requests to the .NET API. This keeps the backend origin out of the browser and allows cookie forwarding. The service layer (`PersonalBlogService.ts`) always calls these local BFF routes — never the .NET API directly from the client.

`getBffBaseUrl()` returns `""` (relative) in the browser and `process.env.NEXT_PUBLIC_APP_URL` (or `http://localhost:3000`) on the server, so SSR route handler calls resolve correctly.

## Authentication
- Login sets an HttpOnly JWT cookie on the .NET backend (Secure, SameSite=None, 30 min).
- The `AuthProvider` in `providers/auth-provider.tsx` holds `user`, `isLoggedIn`, `isLoading` state.
- `useAuth()` hook exposes auth context to any component.
- Auth state is seeded from `initialUser` prop (resolved server-side from the `/api/auth/me` route).
- Protected write operations pass the user's GUID in the route (`/blogs/create/{id}`).

## Key Service Functions (`service/PersonalBlogService.ts`)

| Function | BFF Route | Description |
|----------|-----------|-------------|
| `GetAllPosts()` | GET `/api/blogs` | Fetch all published posts |
| `GetPostsById(id)` | GET `/api/blogById?id=` | Fetch single post |
| `LoginApi(body)` | POST `/api/auth/login` | Authenticate user |
| `SignUpApi(data)` | POST `/api/auth/register` | Register user |
| `logoutApi()` | POST `/api/auth/logout` | Log out |
| `createPostApi(id, data)` | POST `/api/blogs/create` | Create new post |

## Forms
Custom hooks manage form state and submission:
- `useLoginForm` — handles login flow, updates `AuthContext` on success
- `useSignUpForm` — handles registration, field validation
- `usePostForm` — handles blog post creation (title, content, preview)

Form field state shape is defined in `formHelpers/formTypes.ts` (`ISignUpFormState`, etc.) with helpers in `formHelpers/formUtils.ts`.

## Blog List Filtering (`components/blog/Blogs.tsx`)
The `BlogList` component holds a `showMyPostsOnly` boolean state (default `false`). When toggled, `filteredBlogs` switches from the full `blogs` array to one filtered by `blog.userId === currentUser.id`. Pagination and show-more both read from `filteredBlogs`, so they stay correct automatically.

The toggle button only renders when `currentUser` is not null (logged-in users only). Clicking it also resets pagination to page 1 to avoid landing on an empty page.

```
showMyPostsOnly = false  →  filteredBlogs = blogs           (all posts)
showMyPostsOnly = true   →  filteredBlogs = blogs.filter(…) (current user's posts only)
```

## Pagination
Client-side pagination utilities live in `utils/pagination/`. `Filtering.ts` filters the post list; `VisiblePostSettings.ts` manages which page slice is shown. The `Pagination` component in `components/blog/` renders prev/next controls.

## Environment Variables
| Variable | Used for |
|----------|----------|
| `NEXT_PUBLIC_APP_URL` | BFF base URL for server-side Axios calls (defaults to `http://localhost:3000`) |

## Running Locally
```bash
npm install
npm run dev   # starts on http://localhost:3000
```

The .NET backend must be running separately. Configure its URL in the BFF route handlers if it differs from the default.

## Implementation Status
- **Done**: Auth (login, signup, logout), blog list with pagination + "my posts" filter, blog detail view, create post, edit post
- **In progress / stubbed**: draft view (`/blogs/draft/[id]`)
- **Not connected**: delete post (no API call or UI)
