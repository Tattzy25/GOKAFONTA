import * as React from "react"
import { ChevronRight, File, Folder } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"

export type FileEntry = {
  path: string
}

type TreeNode = {
  name: string
  path?: string
  children?: TreeNode[]
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  files?: FileEntry[]
  activePath?: string | null
  onSelectFile?: (path: string) => void
}

const buildTree = (files: FileEntry[]): TreeNode[] => {
  const root: TreeNode[] = []

  const insert = (nodes: TreeNode[], parts: string[], path: string) => {
    const [head, ...rest] = parts
    if (!head) return

    let node = nodes.find((child) => child.name === head)
    if (!node) {
      node = { name: head, children: [] }
      nodes.push(node)
    }

    if (rest.length === 0) {
      node.path = path
      return
    }

    if (!node.children) {
      node.children = []
    }

    insert(node.children, rest, path)
  }

  files.forEach((file) => {
    const parts = file.path.split("/").filter(Boolean)
    insert(root, parts, file.path)
  })

  return root
}

export function AppSidebar({ files = [], activePath, onSelectFile, ...props }: AppSidebarProps) {
  const tree = React.useMemo(() => buildTree(files), [files])

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tree.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>No files yet</SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                tree.map((item, index) => (
                  <Tree
                    key={`${item.name}-${index}`}
                    item={item}
                    activePath={activePath}
                    onSelect={onSelectFile}
                  />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function Tree({
  item,
  activePath,
  onSelect,
}: {
  item: TreeNode
  activePath?: string | null
  onSelect?: (path: string) => void
}) {
  if (!item.children || item.children.length === 0) {
    return (
      <SidebarMenuButton
        isActive={item.path === activePath}
        onClick={() => item.path && onSelect?.(item.path)}
      >
        <File />
        {item.name}
      </SidebarMenuButton>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((subItem, index) => (
              <Tree
                key={`${item.name}-${subItem.name}-${index}`}
                item={subItem}
                activePath={activePath}
                onSelect={onSelect}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
