"use client";
import { useActionState } from "react";

type UseServerFormOptions<T> = {
  schema?: any;
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialState?: T;
};

type ServerFormState = {
  pending: boolean;
  errors?: Record<string, string[]>;
  success?: boolean;
};

export function useServerForm<T = any>({ schema, action, initialState }: UseServerFormOptions<T>): { state: ServerFormState, formAction: (formData: FormData) => Promise<any>, pending: boolean, errorMessage: { [key: string]: string } } {
  const [state, formAction, pending] = useActionState(action, initialState ?? {});

  const enhancedFormAction = async (formData: FormData) => {
    if (schema) {
      const parsed = schema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { ...state, errors: parsed.error.flatten().fieldErrors };
      }
    }
    return formAction(formData);
  };

  const errorMessage = new Proxy({}, {
    get(_, prop: string) {
      return state.errors?.[prop]?.[0] ?? "";
    },
  });

  return { state, formAction: enhancedFormAction, pending, errorMessage };
}
