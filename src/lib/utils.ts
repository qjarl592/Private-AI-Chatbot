import { type ClassValue, clsx } from "clsx";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function genUniqueId(idList: string[]) {
  let id: string;
  do {
    id = nanoid();
  } while (idList.includes(id));
  return id;
}

export function removeQuotes(str: string) {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }
  return str;
}
