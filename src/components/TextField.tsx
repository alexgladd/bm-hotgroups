import type { TextFieldProps as RaTextFieldProps } from "react-aria-components";
import { TextField as RaTextField, Label, Input, FieldError } from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface TextFieldProps extends Omit<RaTextFieldProps, "className"> {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  inputSize?: number;
}

function TextField({
  label,
  placeholder,
  errorMessage,
  className,
  inputSize,
  ...props
}: TextFieldProps) {
  return (
    <RaTextField
      {...props}
      className={twMerge("flex flex-wrap items-baseline gap-1 w-fit", className)}
    >
      <Label>{label}</Label>
      <Input
        placeholder={placeholder}
        size={inputSize}
        className="px-3 py-2 outline-none border border-primary-700 rounded-sm font-mono focus:ring-2 ring-offset-1 ring-primary-700"
      />
      <FieldError className="basis-full text-center text-xs text-primary-700">
        {errorMessage}
      </FieldError>
    </RaTextField>
  );
}

export default TextField;
