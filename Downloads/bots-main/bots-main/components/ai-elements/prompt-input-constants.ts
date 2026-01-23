// ============================================================================
// PromptInput Constants - Extracted Hardcoded Values
// ============================================================================

// Magic Numbers & Dimensions
export const ATTACHMENT = {
  ICON_SIZE: 'size-5',
  ICON_SIZE_SM: 'size-3',
  ICON_SIZE_XS: 'size-2.5',
  PREVIEW_MAX_HEIGHT: 'max-h-96',
  PREVIEW_MAX_WIDTH: 'w-96',
  THUMBNAIL_HEIGHT: 20,
  THUMBNAIL_WIDTH: 20,
  PREVIEW_HEIGHT: 384,
  PREVIEW_WIDTH: 448,
} as const;

export const TEXTAREA = {
  MAX_HEIGHT: 'max-h-48',
  MIN_HEIGHT: 'min-h-16',
} as const;

export const SPEECH_RECOGNITION = {
  LANGUAGE: 'en-US',
  CONTINUOUS: true,
  INTERIM_RESULTS: true,
} as const;

export const HOVER_CARD = {
  OPEN_DELAY: 0,
  CLOSE_DELAY: 0,
  ALIGN: 'start' as const,
} as const;

export const BUTTON_DEFAULTS = {
  VARIANT: 'ghost' as const,
  SIZE: 'icon-sm' as const,
} as const;

export const ANIMATION = {
  SPEECH_BUTTON_DURATION: 'duration-200',
  HOVER_DURATION: 'duration-150',
} as const;

// Hardcoded Strings
export const LABELS = {
  UPLOAD_FILES: 'Upload files',
  REMOVE_ATTACHMENT: 'Remove attachment',
  ATTACHMENT_ALT: 'attachment',
  ATTACHMENT_PREVIEW_ALT: 'attachment preview',
  IMAGE_LABEL: 'Image',
  ATTACHMENT_LABEL: 'Attachment',
  FORM_MESSAGE_NAME: 'message',
  COMMAND_PLACEHOLDER: 'Type a command or search...',
  COMMAND_EMPTY: 'No results found.',
} as const;

export const ERROR_MESSAGES = {
  PROVIDER_CONTROLLER: 'Wrap your component inside <PromptInputProvider> to use usePromptInputController().',
  PROVIDER_ATTACHMENTS: 'Wrap your component inside <PromptInputProvider> to use useProviderAttachments().',
  ATTACHMENTS_HOOK: 'usePromptInputAttachments must be used within a PromptInput or PromptInputProvider',
  ACCEPT_MISMATCH: 'No files match the accepted types.',
  SIZE_EXCEEDED: 'All files exceed the maximum size.',
  TOO_MANY_FILES: 'Too many files. Some were not added.',
} as const;

// Class Names
export const ATTACHMENT_CLASSES = {
  CONTAINER: 'group relative flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-md border border-border px-1.5 font-medium text-sm transition-all hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
  OVERLAY: 'absolute inset-0 flex size-5 items-center justify-center overflow-hidden rounded bg-background transition-opacity group-hover:opacity-0',
  REMOVE_BUTTON: 'absolute inset-0 size-5 cursor-pointer rounded p-0 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 [&>svg]:size-2.5',
  PREVIEW_MODAL: 'flex max-h-96 w-96 items-center justify-center overflow-hidden rounded-md border',
  PREVIEW_IMAGE: 'max-h-full max-w-full object-contain',
} as const;

export const TEXTAREA_CLASSES = {
  SIZING: 'field-sizing-content max-h-48 min-h-16',
} as const;

export const SPEECH_BUTTON_CLASSES = {
  BASE: 'relative transition-all duration-200',
  LISTENING: 'animate-pulse bg-accent text-accent-foreground',
} as const;

export const SELECT_CLASSES = {
  TRIGGER: 'border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground',
} as const;

export const HOVER_CARD_CLASSES = {
  CONTENT: 'w-auto p-2',
  TITLE: 'truncate font-semibold text-sm leading-none',
  DESCRIPTION: 'truncate font-mono text-muted-foreground text-xs',
} as const;

// Configuration Objects
export const COMPONENT_DEFAULTS = {
  ATTACHMENTS_PADDING: 'p-3',
  ATTACHMENTS_GAP: 'gap-2',
  ATTACHMENTS_CONTAINER: 'flex flex-wrap items-center gap-2 p-3 w-full',
  TOOLS_CONTAINER: 'flex items-center gap-1',
  FOOTER_LAYOUT: 'justify-between gap-1',
  HEADER_LAYOUT: 'order-first flex-wrap gap-1',
  TABS_LIST: 'mb-2 px-3 font-medium text-muted-foreground text-xs',
  TAB_ITEM: 'flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent',
  COMMAND_INPUT: 'h-auto py-3.5',
  COMMAND_LIST: '',
  COMMAND_ITEM: '',
  COMMAND_SEPARATOR: '',
} as const;
