import { cn } from "@/lib/utils";
import { CommandItem } from "@/components/ui/command";
import { ProviderBadge } from "./provider-badge";
import type { ModelItemProps } from "./types";

export const ModelItem = ({
  model,
  isSelected,
  onSelect,
  className,
  ...props
}: ModelItemProps & React.ComponentProps<typeof CommandItem>) => (
  <CommandItem
    {...props}
    className={cn(
      "flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-accent",
      isSelected && "bg-accent",
      className
    )}
    onSelect={() => onSelect(model.value)}
    value={`${model.name} ${model.providers.join(" ")}`}
  >
    <div className="flex flex-col gap-1">
      <span className="font-medium text-sm">{model.name}</span>
      <div className="flex items-center gap-1">
        {model.providers.slice(0, 4).map((provider) => (
          <ProviderBadge key={provider} provider={provider} className="size-3" />
        ))}
        {model.providers.length > 4 && (
          <span className="text-xs text-muted-foreground">
            +{model.providers.length - 4}
          </span>
        )}
      </div>
    </div>
    {isSelected && (
      <div className="size-2 rounded-full bg-primary" />
    )}
  </CommandItem>
);
