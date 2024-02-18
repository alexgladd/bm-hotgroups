import {
  Cell as RaCell,
  Collection,
  Column as RaColumn,
  Row as RaRow,
  TableHeader,
} from "react-aria-components";
import type {
  CellProps,
  ColumnProps as RaColumnProps,
  RowProps,
  TableHeaderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface ColumnProps extends Omit<RaColumnProps, "className"> {
  className?: string;
}

export function Column({ className, ...props }: ColumnProps) {
  return <RaColumn className={twMerge("p-2 text-left font-bold", className)} {...props} />;
}

export function Header<T extends object>({ columns, children }: TableHeaderProps<T>) {
  return (
    <TableHeader className="border-b-4 border-b-accent">
      <Collection items={columns}>{children}</Collection>
    </TableHeader>
  );
}

export function Row<T extends object>({ id, columns, children, ...props }: RowProps<T>) {
  return (
    <RaRow id={id} {...props}>
      <Collection items={columns}>{children}</Collection>
    </RaRow>
  );
}

export function Cell(props: CellProps) {
  return <RaCell {...props} className="p-1 pl-2 border-b border-b-accent" />;
}

export { Table, TableBody as Body } from "react-aria-components";
