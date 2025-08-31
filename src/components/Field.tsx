"use client";
import React from "react";
import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { name: string };

export const Field: React.FC<FieldProps> = (props) => {
  return <input {...props} />;
};
