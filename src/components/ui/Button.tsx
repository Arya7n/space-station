import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`border-line text-foreground hover:border-accent hover:text-accent border px-3 py-2 text-left font-mono text-[10px] tracking-[0.16em] ${className}`}
      {...props}
    />
  );
}
