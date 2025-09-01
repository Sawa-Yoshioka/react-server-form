"use client";
import { useActionState } from "react";
import { z } from "zod";

type ServerFormState<T> = Partial<T> & {
  errors?: Partial<Record<keyof T, string[]>>;
  pending: boolean;
  success?: boolean;
  message?: string;
};

type UseServerFormOptions<TSchema extends z.ZodTypeAny> = {
  schema?: TSchema;
  action: TSchema extends undefined 
    ? (helpers: ReturnType<typeof createHelpers>) => Promise<any>
    : (data: z.infer<TSchema>) => Promise<any>;
  initialState?: Partial<z.infer<TSchema>>;
};

function createHelpers(formData: FormData) {
  return {
    string: (key: string) => formData.get(key)?.toString() ?? "",
    number: (key: string) => Number(formData.get(key) ?? 0),
    boolean: (key: string) => formData.get(key) === "true",
    array: (key: string) => formData.getAll(key).map(v => v.toString()),
    file: (key: string) => formData.get(key) as File | null,
    build: (builder: (helpers: any) => any) => builder({
      string: (key: string) => formData.get(key)?.toString() ?? "",
      number: (key: string) => Number(formData.get(key) ?? 0),
      boolean: (key: string) => formData.get(key) === "true",
      array: (key: string) => formData.getAll(key).map(v => v.toString()),
      file: (key: string) => formData.get(key) as File | null,
    }),
  };
}

export function useServerForm<TSchema extends z.ZodTypeAny>({
  schema,
  action,
  initialState,
}: UseServerFormOptions<TSchema>) {
  type SchemaType = z.infer<TSchema>;

  const initial: ServerFormState<SchemaType> = {
    ...(initialState ?? ({} as SchemaType)),
    errors: {},
    pending: false,
    success: false,
  };

  const serverAction = async (
    prevState: ServerFormState<SchemaType>,
    formData: FormData
  ): Promise<ServerFormState<SchemaType>> => {
    if (schema) {
      // Zodスキーマがある場合：自動変換 + バリデーション
      const raw = Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [
          key,
          value instanceof File ? value : String(value)
        ])
      );
      
      const parsed = schema.safeParse(raw);
      
      if (!parsed.success) {
        return {
          ...prevState,
          errors: parsed.error.flatten().fieldErrors as Record<
            keyof SchemaType,
            string[]
          >,
          success: false,
          pending: false,
        };
      }

      try {
        await action(parsed.data as any); // バリデーション済みオブジェクト
        return Object.assign({}, parsed.data, {
          errors: {},
          pending: false,
          success: true,
        });
      } catch (error) {
        return {
          ...prevState,
          errors: { 
            ...prevState.errors,
          },
          pending: false,
          success: false,
        };
      }
    } else {
      // Zodスキーマがない場合：ヘルパー関数を提供
      const helpers = createHelpers(formData);
      
      try {
        await (action as any)(helpers); // ヘルパー関数を渡す
        return {
          ...prevState,
          errors: {},
          pending: false,
          success: true,
        };
      } catch (error) {
        return {
          ...prevState,
          errors: { 
            ...prevState.errors,
          },
          pending: false,
          success: false,
        };
      }
    }
  };

  const [state, formAction, pending] = useActionState(
    serverAction, 
    initial as Awaited<ServerFormState<SchemaType>>
  );

  const errorMessage = new Proxy(
    {},
    {
      get(_, prop: string) {
        return state.errors?.[prop as keyof SchemaType]?.[0] ?? "";
      },
    }
  ) as { [K in keyof SchemaType]: string };

  return { state, formAction, pending, errorMessage };
}