import * as React from "react";

import { cn } from "@/lib/cn";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({
  className,
  src,
  alt = "User avatar",
  initials,
  size = "md",
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-white",
        "text-[var(--text-secondary)]",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium">{initials?.slice(0, 2).toUpperCase() ?? "U"}</span>
      )}
    </div>
  );
}

