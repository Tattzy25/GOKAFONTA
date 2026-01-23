"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
} from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { cn } from "../../lib/utils";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import type { AIModel } from "../../lib/models";
import { ModelItem } from "./model-item";
import type { ModelSelectorProps } from "./types";

export const ModelSelector = ({
  models,
  selectedModel,
  onModelSelect,
  placeholder = "Select a model...",
  className,
}: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedModelData = models.find(model => model.value === selectedModel);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[300px] justify-between font-normal",
            !selectedModelData && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">
            {selectedModelData ? selectedModelData.name : placeholder}
          </span>
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search models..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No models found.</CommandEmpty>
            <CommandGroup>
              {models
                .filter(model =>
                  model.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                  model.providers.some(provider =>
                    provider.toLowerCase().includes(searchValue.toLowerCase())
                  )
                )
                .map((model) => (
                  <ModelItem
                    key={model.value}
                    model={model}
                    isSelected={selectedModel === model.value}
                    onSelect={(modelId) => {
                      onModelSelect(modelId);
                      setOpen(false);
                      setSearchValue("");
                    }}
                  />
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
