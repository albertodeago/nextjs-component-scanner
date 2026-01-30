"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, ...props }, ref) {
    return (
      <div>
        {label && <label>{label}</label>}
        <input ref={ref} {...props} />
        {error && <span style={{ color: "red" }}>{error}</span>}
      </div>
    );
  }
);

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, ...props }: TextAreaProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <textarea {...props} />
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}
