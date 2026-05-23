Personal blog site build using Next.js and React with dynamic routing

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Docs

- [Architecture & Data Flow](docs/ARCHITECTURE.md) — how the UI, BFF, and .NET API connect; CRUD flows; auth; glossary for beginners
- [Custom Form Hooks](#custom-form-hooks-hooks) — how `useLoginForm`, `useSignUpForm`, `usePostForm`, `useEditProfileForm` work

---

## Custom Form Hooks (`hooks/`)

This project manages all form logic through custom React hooks rather than keeping it inside components. Understanding how these hooks work is the key mental model for reading the form-related code.

### What is a custom hook?

A custom hook is a plain JavaScript function whose name starts with `use`. The `use` prefix is what lets it call React's built-in hooks (`useState`, `useEffect`, etc.) inside. There is nothing magic about it — it is just a function that can hold React state.

By extracting form logic into hooks, the component files only deal with JSX. The hooks own the "what happens when the user types / blurs / submits" behavior.

```
Component                         Hook
─────────────────────────────     ──────────────────────────────────────
Renders JSX                       Owns formState
Wires up onChange / onBlur        Owns handleInputChange / handleBlur
Reads formState to show errors    Calls setFormState to update state
Reads validForSubmit to gate      Recalculates validForSubmit on every change
the submit button
```

### Available hooks

| Hook | Form | Extra export |
|---|---|---|
| `useLoginForm` | Login (userName, password) | — |
| `useSignUpForm` | Sign-up (6 fields + confirmPassword match) | — |
| `useEditProfileForm` | Edit profile (4 fields) | — |
| `usePostForm` | Create / edit blog post (title, preview, content) | `loadExistingData` |

### Field state shape

Every text field is stored as an object with three properties:

```ts
{
  value: string;    // what the user has typed
  error: string;    // validation message, "" means no error
  touched: boolean; // true once the user has focused then left the field
}
```

The `touched` flag is the "don't yell at the user before they've typed anything" gate. Components only render an error message when `touched === true`, so errors never appear on an empty untouched form.

`validForSubmit` is a top-level boolean on formState (not nested inside a field). It is `true` only when every field has no error and a non-empty value — the submit button reads it to decide whether to be enabled.

### How useState works in these hooks

```ts
const [formState, setFormState] = useState<IFormState>(initialState);
```

- `formState` — the current **snapshot** of state. It is frozen for the duration of the current render; it does not change mid-function.
- `setFormState` — **schedules** an update. Calling it does not mutate `formState` immediately. React queues the update and re-renders the component afterward, at which point `formState` holds the new value.

### handleBlur — re-render order

```
User leaves field
      │
      ▼
handleBlur(field) called
      │
      ├── setFormState(updater) → QUEUED (formState still unchanged)
      │
      ▼
handleBlur returns
      │
      ▼
React applies queued updater → formState.field.touched = true
      │
      ▼
Component re-renders once — error message now visible if error exists
```

### handleInputChange — execution and re-render order

This is the most important function to understand because it calls `setFormState` **twice** in one event handler. React 18 automatic batching merges them into a single re-render.

```
User types a character
      │
      ▼
handleInputChange(field, value) called
      │
      ├── (Step 1) First setFormState(updater) → QUEUED
      │           writes { value: input } — keeps the input "live" as user types
      │
      ├── (Step 2) Validation runs synchronously (plain JS, no React)
      │           formState here is STILL the previous render's snapshot
      │           because Step 1 hasn't been applied yet
      │
      ├── (Step 3) Second setFormState(updater) → QUEUED
      │           error path:  writes { error, touched: true }
      │           happy path:  writes { error: "", touched: true }
      │           both paths:  recalculates validForSubmit from newState
      │
      ▼
handleInputChange returns
      │
      ▼
React processes both queued updaters in order:
  updater #1 runs against committed state  → intermediate state
  updater #2 runs against intermediate state → final state
      │
      ▼
Component re-renders ONCE with final state (React 18 batching)
```

### Why the functional updater form?

Both queued setFormState calls use the `prev =>` functional updater:

```ts
setFormState((prev) => {
  return { ...prev, [field]: { ...prev[field], touched: true } };
});
```

If you passed a plain object instead, the second call could overwrite the first because it closes over the same stale `formState`. The functional form ensures updater #2 always receives the output of updater #1 as its `prev` — even though neither has triggered a re-render yet.

### validForSubmit gate

`validForSubmit` is recalculated inside the second `setFormState` call on every keystroke. It reads from `newState` (the about-to-be-committed snapshot) rather than from the stale `formState` closure:

```ts
const isFormValid =
  newState.field1.error === "" && newState.field1.value.trim() !== "" &&
  newState.field2.error === "" && newState.field2.value.trim() !== "" && ...;

return { ...newState, validForSubmit: isFormValid };
```

The component disables the submit button when `validForSubmit` is `false`:

```tsx
<button disabled={!formState.validForSubmit}>Submit</button>
```

### loadExistingData (usePostForm only)

The edit-post flow fetches an existing post from the API and needs to populate all fields at once. `loadExistingData` replaces the entire formState in one call and sets `validForSubmit: true` because server data is assumed valid:

```ts
// Called once after the API fetch resolves:
loadExistingData({ title, preview, content });
```

Unlike `handleInputChange`, this passes a **plain object** to `setFormState` (not a functional updater) because there is no previous state to merge with — all fields are replaced at once.

### Wire-up example

```tsx
const { formState, handleInputChange, handleBlur } = useLoginForm({
  userName: "",
  password: "",
  resetPassword: false,
});

<input
  value={formState.userName.value}
  onChange={(e) => handleInputChange("userName", e.target.value)}
  onBlur={() => handleBlur("userName")}
/>
{formState.userName.touched && formState.userName.error && (
  <span>{formState.userName.error}</span>
)}

<button disabled={!formState.validForSubmit}>Log in</button>
```

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
