"use client";

import { useFormStatus } from "react-dom";
import { btnClay, btnPrimary } from "@/lib/constants";

export function SubmitButton({
  children,
  pendingLabel = "שולחים...",
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "clay";
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={variant === "clay" ? btnClay : btnPrimary}>
      {pending ? pendingLabel : children}
    </button>
  );
}
