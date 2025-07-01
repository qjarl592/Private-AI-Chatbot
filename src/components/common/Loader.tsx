import { Loader2 } from "lucide-react";
import { type ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
  iconSize?: number;
}

export default function Loader({ className, children, iconSize }: Props) {
  return (
    <div className={className}>
      <Loader2 className="animate-spin" size={iconSize} />
      {children}
    </div>
  );
}
