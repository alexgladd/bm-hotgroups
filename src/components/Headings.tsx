import { twMerge } from "tailwind-merge";

export function H1({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <h1
      className={twMerge("py-4 text-xl lg:text-2xl font-bold text-center tracking-wide", className)}
    >
      {children}
    </h1>
  );
}
