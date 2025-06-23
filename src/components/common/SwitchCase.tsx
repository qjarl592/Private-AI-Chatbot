import { type ReactNode } from "react";

interface Props<T extends string | number> {
  value: T;
  caseBy: Record<T, ReactNode | null>;
  defaultCase?: ReactNode | null;
}

export default function SwitchCase<T extends string | number>({
  value,
  caseBy,
  defaultCase = null,
}: Props<T>) {
  if (value) return caseBy[value] ?? defaultCase;
  return defaultCase;
}
