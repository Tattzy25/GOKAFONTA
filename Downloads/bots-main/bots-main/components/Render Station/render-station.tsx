"use client";

import {
	WebPreview,
	WebPreviewNavigation,
	WebPreviewUrl,
	WebPreviewBody,
} from "./web-preview";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";
import { FileTree } from "./file-tree";
import {
	Sandbox,
	SandboxHeader,
	SandboxContent,
	SandboxTabs,
	SandboxTabsBar,
	SandboxTabsList,
	SandboxTabsTrigger,
	SandboxTabContent,
} from "./sandbox";
import type { ComponentProps } from "react";

export type RenderStationProps = {
	previewHtml?: string | null;
} & ComponentProps<"div">;

export const RenderStation = ({
	previewHtml,
	className,
	...props
}: RenderStationProps) => {
	return (
		<div className={("h-full flex flex-col p-2 sm:p-4 ") + (className ?? "")} {...props}>
			<div className="flex-1 min-h-0 border rounded-lg overflow-hidden">
				{previewHtml ? (
					<WebPreview className="h-full">
						<WebPreviewNavigation>
							<WebPreviewUrl />
						</WebPreviewNavigation>
						<WebPreviewBody className="flex-1 min-h-0" srcDoc={previewHtml} />
					</WebPreview>
				) : (
					<div className="h-full flex flex-col">
						<div className="flex-1 overflow-auto">
							<CodeBlock code={""} language={"text" as any} />
						</div>
						<div className="mt-2">
							<FileTree />
						</div>
					</div>
				)}
			</div>

			{/* Sandbox area (collapsed) - ready for wiring to tool state */}
			<div className="mt-2">
				<Sandbox defaultOpen={false}>
					<SandboxHeader title="Sandbox" />
					<SandboxContent>
						<SandboxTabs defaultValue="code">
							<SandboxTabsBar>
								<SandboxTabsList>
									<SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
									<SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
								</SandboxTabsList>
							</SandboxTabsBar>
							<SandboxTabContent value="code"></SandboxTabContent>
							<SandboxTabContent value="output">
								<CodeBlock code={""} language={"log" as any} />
							</SandboxTabContent>
						</SandboxTabs>
					</SandboxContent>
				</Sandbox>
			</div>
		</div>
	);
};

export default RenderStation;
