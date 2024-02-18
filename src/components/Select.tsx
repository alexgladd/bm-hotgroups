import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
  Popover,
  Select as RaSelect,
  SelectProps as RaSelectProps,
  SelectValue,
} from "react-aria-components";
import { twJoin, twMerge } from "tailwind-merge";

interface SelectProps<T extends object> extends Omit<RaSelectProps<T>, "children"> {
  label?: string;
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object>({ label, children, items, ...props }: SelectProps<T>) {
  return (
    <RaSelect
      {...props}
      className="border border-primary-700 open:border-primary-700 rounded-sm outline-none focus:ring-2 ring-offset-1 ring-primary-700 open:text-primary-700 open:bg-primary-50"
    >
      {({ isOpen }) => (
        <>
          <Label>{label}</Label>
          <Button className="p-2 flex gap-2 outline-none">
            <SelectValue className="overflow-hidden whitespace-nowrap text-ellipsis" />
            <span
              className={twJoin(
                "inline-block text-primary-700 transition-transform",
                isOpen ? "rotate-180" : "rotate-0",
              )}
              aria-hidden="true"
            >
              ▼
            </span>
          </Button>
          <Popover className="border-2 border-primary-700 rounded-sm bg-primary-50 text-primary-700 cursor-default entering:animate-popover-enter exiting:animate-popover-exit">
            <ListBox items={items}>{children}</ListBox>
          </Popover>
        </>
      )}
    </RaSelect>
  );
}

interface ItemProps extends Omit<ListBoxItemProps, "className"> {
  className?: string;
}

export function Item({ className, ...props }: ItemProps) {
  return (
    <ListBoxItem
      {...props}
      className={twMerge(
        "p-2 selected:font-bold selected:bg-primary-100 selected:focus:bg-primary-200 pressed:bg-primary-300 outline-none focus:bg-primary-200",
        className,
      )}
    />
  );
}
