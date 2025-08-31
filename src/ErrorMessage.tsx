"use client";
import React from "react";

export function ErrorMessage({
  name,
  state,
}: {
  name: string;
  state: { errors?: Record<string, string[]> };
}) {
  if (!state.errors?.[name]) return null;
  return <p style={{ color: "red" }}>{state.errors[name]?.[0]}</p>;
}
