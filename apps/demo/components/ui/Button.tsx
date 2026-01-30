"use client";

import { type ReactNode, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export function Button({ children, variant = "primary", ...props }: ButtonProps) {
  return (
    <button data-variant={variant} {...props}>
      {children}
    </button>
  );
}

export function IconButton({ children, ...props }: ButtonProps) {
  return (
    <button {...props} style={{ borderRadius: "50%" }}>
      {children}
    </button>
  );
}
