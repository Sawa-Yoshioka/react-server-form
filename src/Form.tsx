"use client";
import React from "react";

export function Form({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: (formData: FormData) => void;
}) {
  return <form action={action}>{children}</form>;
}
