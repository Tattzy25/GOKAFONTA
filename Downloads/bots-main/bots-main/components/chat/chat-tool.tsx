import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Wrench, AlertCircle } from "lucide-react";

type ToolMessagePart = {
  type: string;
  toolName?: string;
  state?: string;
  input?: unknown;
  errorText?: string;
  output?: unknown;
};

type ChatToolProps = {
  toolMessagePart: ToolMessagePart;
  className?: string;
};

export default function ChatTool({ toolMessagePart, className }: ChatToolProps) {
  const toolName =
    toolMessagePart.type === "dynamic-tool"
      ? toolMessagePart.toolName
      : toolMessagePart.type.replace("tool-", "");

  // Status Logic using your Accent color
  const isError = toolMessagePart.state === "output-error";
  const isDone = toolMessagePart.state === "output-available";

  return (
    <Accordion type="single" collapsible className="w-full my-2">
      <AccordionItem
        value="tool"
        className={cn("border border-border rounded-2xl bg-(--bg-blur) backdrop-blur-md px-4", className)}
      >
        <AccordionTrigger className="py-4 hover:no-underline">
          <span className="flex items-center gap-3">
            {isError ? (
              <AlertCircle className="text-red-500 w-4 h-4" />
            ) : (
              <Wrench className="text-accent w-4 h-4" />
            )}
            <span className="text-sm font-bold text-(--text-main) tracking-tight">
              {isDone ? "Executed" : "Running"} {toolName}
            </span>
          </span>
        </AccordionTrigger>

        <AccordionContent>
          <div className="flex flex-col gap-4 pb-4">
            {/* INPUT BLOCK */}
            {toolMessagePart.input && (
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-(--text-dim)">
                  Input Parameters
                </div>
                <pre className="bg-black/40 border border-border rounded-xl p-4 text-xs text-(--text-dim) overflow-x-auto font-mono">
                  {JSON.stringify(toolMessagePart.input, null, 2)}
                </pre>
              </div>
            )}

            {/* ERROR TEXT */}
            {isError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono">
                {toolMessagePart.errorText}
              </div>
            )}

            {/* OUTPUT BLOCK */}
            {isDone && toolMessagePart.output && (
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-accent">
                  Output Stream
                </div>
                <pre className="bg-black/60 border border-border rounded-xl p-4 text-xs text-(--text-main) overflow-x-auto font-mono">
                  {JSON.stringify(toolMessagePart.output, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
