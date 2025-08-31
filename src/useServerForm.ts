"use client";
import { useActionState } from "react";

type ServerFormState = {
  pending: boolean;
  errors?: Record<string, string[]>;
  success?: boolean;
};

export function useServerForm<TAction extends (prev: any, formData: FormData) => Promise<any>>(
  action: TAction
) {
  const [state, formAction, pending] = useActionState(action, {});

  return {
    state: { ...state, pending } as ServerFormState,
    formAction,
  };
}
