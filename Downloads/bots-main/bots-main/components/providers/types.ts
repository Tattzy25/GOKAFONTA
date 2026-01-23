import type { AIModel } from "../../lib/models";

export type ModelSelectorProps = {
  models: AIModel[];
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  placeholder?: string;
  className?: string;
};

export type ProviderBadgeProps = {
  provider: string;
  className?: string;
};

export type ModelItemProps = {
  model: AIModel;
  isSelected: boolean;
  onSelect: (modelId: string) => void;
};
