import { Button as RaButton, ButtonProps as RaButtonProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends Omit<RaButtonProps, "className"> {
  secondary?: boolean;
  className?: string;
}

function Button({ secondary = false, children, className, ...props }: ButtonProps) {
  return (
    <RaButton
      className={twMerge(
        "p-2 rounded-sm focus:ring-2 ring-offset-1 outline-none transition-colors",
        secondary
          ? "bg-light text-primary-700 border border-primary-700 hover:bg-primary-50 pressed:bg-primary-100 ring-primary-700"
          : "bg-primary-500 font-bold text-light hover:bg-primary-600 pressed:bg-primary-700 ring-primary-500",
        className,
      )}
      {...props}
    >
      {children}
    </RaButton>
  );
}

export default Button;
