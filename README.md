# react-server-form

[![npm version](https://badgen.net/npm/v/react-server-form)](https://www.npmjs.com/package/react-server-form)

A React library for server-side form management using Server Actions.  
With `useServerForm` and the `Form` / `Field` / `ErrorMessage` components, you can handle validation and submission entirely on the server.



## Features

- Server-side validation for secure form handling
- Simple error management via `state.errors`
- Compatible with React 18 and Next.js App Router
- Minimal setup for easy integration



## Installation

```bash
npm install react-server-form

```



## Usage (Next.js Example)

### 1. Server-side Action

```bash
"use server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signupAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  // DB save or other server-side processing
  return { success: true };
}
```

### 2. Client-side Form

```bash
"use client";
import { useServerForm, Form, Field } from "react-server-form";
import { z } from "zod";
import { signupAction } from "@/actions/signup";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function SignupForm() {
  const { state, formAction, errorMessage } = useServerForm({ schema, action: signupAction });

  return (
    <Form action={formAction}>
      <Field name="email" type="email" placeholder="Email" />
      <p style={{ color: "red" }}>{errorMessage.email}</p>

      <Field name="password" type="password" placeholder="Password" />
      <p style={{ color: "red" }}>{errorMessage.password}</p>

      <button disabled={state.pending}>
        {state.pending ? "Submitting..." : "Sign Up"}
      </button>
    </Form>
  );
}
```


## API

### `useServerForm({ schema, action, initialState })`

- schema: optional Zod schema for client-side validation

- action: server-side action function (prevState, formData) => Promise<any>

- initialState: optional initial state for useActionState

```bash
{
  state: { pending: boolean; errors?: Record<string,string[]>; success?: boolean },
  formAction: (formData: FormData) => void,
  pending: boolean,
  errorMessage: { [fieldName: string]: string }
}
```

### `<Form>`

- Props:

 - action: formAction returned from useServerForm

 - children: input fields, buttons, etc.

### `<Field>`

- Standard <input> props plus name


## Contributing

We welcome contributions! 🎉

1. Fork the repository

2. Create a new branch (git checkout -b feature/my-feature)

3. Make your changes

4. Commit your changes (git commit -m "feat: add new feature")

3. Push to the branch (git push origin feature/my-feature)

4. Open a Pull Request

Please make sure your code follows the existing style and passes any tests.


## Issues

If you encounter bugs or have feature requests, please open an Issue.
