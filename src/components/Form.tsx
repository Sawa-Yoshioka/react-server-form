"use client";
import React from "react";
import type { FormHTMLAttributes } from "react";

type FormProps = FormHTMLAttributes<HTMLFormElement> & { action: (formData: FormData) => void };

export const Form: React.FC<FormProps> = ({ action, children, ...props }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await action(formData);
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
