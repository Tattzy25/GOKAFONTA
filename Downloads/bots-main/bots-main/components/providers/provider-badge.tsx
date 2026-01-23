import { cn } from "@/lib/utils";
import NextImage from "next/image";
import type { ProviderBadgeProps } from "./types";

export const ProviderBadge = ({
  provider,
  className,
  ...props
}: ProviderBadgeProps) => (
  <NextImage
    {...props}
    alt={`${provider} logo`}
    className={cn("size-4 rounded-full bg-background p-0.5 ring-1 dark:bg-foreground", className)}
    height={16}
    src={`https://models.dev/logos/${provider}.svg`}
    width={16}
    unoptimized
  />
);
