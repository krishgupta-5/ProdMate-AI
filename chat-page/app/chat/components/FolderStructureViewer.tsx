"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { 
  IconBrandDocker, 
  IconBrandTypescript, 
  IconBrandJavascript, 
  IconBrandPython,
  IconBrandCss3,
  IconBrandGithub,
  IconFileTypePdf,
  IconFileTypeTxt,
  IconSettings,
  IconFileCode,
  IconFileText,
  IconFileDescription,
  IconFolderFilled,
  IconLock,
  IconJson,
  IconMarkdown,
  IconDatabase,
  IconBrandReact
} from "@tabler/icons-react";

interface FolderStructureViewerProps {
  content: string;
}

export default function FolderStructureViewer({
  content,
}: FolderStructureViewerProps) {
  const [collapsedPaths, setCollapsedPaths] = React.useState<Set<number>>(new Set());

  // Filter out sentences and markdown text to only show actual tree/files
  const rawLines = (content ?? "").split("\n");
  const lines = rawLines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;

    const name = trimmed.replace(/^[\s│├└─|`'\-\*]+/, "");
    if (!name) return false;

    if (name.startsWith("#")) return false;

    const spacesCount = (name.match(/ /g) || []).length;
    if (spacesCount > 2) return false;

    if (name.length > 50) return false;

    return true;
  });

  const getFileIconAndColor = (filename: string, isFolder: boolean) => {
    if (isFolder) {
      if (filename.toLowerCase() === '.github') {
        return { color: "var(--pm-muted)", icon: <IconBrandGithub size={16} /> };
      }
      return { color: "#60A5FA", icon: <IconFolderFilled size={16} /> };
    }

    const lowerName = filename.toLowerCase();
    
    if (lowerName === 'dockerfile' || lowerName.includes('docker-compose')) {
      return { color: "#2496ED", icon: <IconBrandDocker size={16} /> };
    }
    if (lowerName === 'package.json') {
      return { color: "#16a34a", icon: <IconJson size={16} /> };
    }
    if (lowerName === 'package-lock.json' || lowerName === 'yarn.lock') {
      return { color: "var(--pm-muted)", icon: <IconLock size={16} /> };
    }
    if (lowerName === '.gitignore' || lowerName === '.gitattributes') {
      return { color: "#F05032", icon: <IconBrandGithub size={16} /> };
    }
    if (lowerName.startsWith('.env')) {
      return { color: "#ca8a04", icon: <IconSettings size={16} /> };
    }
    if (lowerName === 'readme.md' || lowerName === 'readme') {
      return { color: "#38BDF8", icon: <IconFileDescription size={16} /> };
    }
    if (lowerName.includes('config') || lowerName.includes('.rc')) {
      return { color: "var(--pm-muted)", icon: <IconSettings size={16} /> };
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': return { color: "#3178C6", icon: <IconBrandTypescript size={16} /> };
      case 'tsx': return { color: "#0891b2", icon: <IconBrandReact size={16} /> };
      case 'js':
      case 'jsx': return { color: "#ca8a04", icon: <IconBrandJavascript size={16} /> };
      case 'json': return { color: "#16a34a", icon: <IconJson size={16} /> };
      case 'md':
      case 'mdx': return { color: "var(--pm-muted)", icon: <IconMarkdown size={16} /> };
      case 'css':
      case 'scss': return { color: "#38BDF8", icon: <IconBrandCss3 size={16} /> };
      case 'py': return { color: "#3776AB", icon: <IconBrandPython size={16} /> };
      case 'sql':
      case 'db': return { color: "#F87171", icon: <IconDatabase size={16} /> };
      case 'txt': return { color: "var(--pm-muted)", icon: <IconFileTypeTxt size={16} /> };
      default: return { color: "var(--pm-muted)", icon: <IconFileCode size={16} /> };
    }
  };

  const parsedLines = lines.map((line, i) => {
    const trimmed = line.trimEnd();
    const treeMatch = trimmed.match(/^[\s│├└─|`'\-\*]+/);
    const treePrefix = treeMatch ? treeMatch[0] : "";
    const nodeName = trimmed.slice(treePrefix.length);

    const isRootProject = i === 0;
    const isFolder = nodeName.endsWith("/") || (!nodeName.includes('.') && nodeName.trim().length > 0);
    const cleanNodeName = nodeName.replace(/\/$/, '');
    
    const depth = isRootProject ? -1 : treePrefix.length;
    
    let indentPx = treePrefix.length === 0 && i > 0 ? 28 : 8;
    if (treePrefix.length > 0) {
       indentPx += treePrefix.length * 8;
    }

    return {
      index: i,
      cleanNodeName,
      isFolder,
      depth,
      indentPx,
      isRootProject,
      treePrefix
    };
  });

  const toggleFolder = (index: number) => {
    setCollapsedPaths(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const visibleLines = [];
  let collapseDepthThreshold = Infinity;

  for (let i = 0; i < parsedLines.length; i++) {
    const node = parsedLines[i];
    
    if (node.depth <= collapseDepthThreshold) {
      collapseDepthThreshold = Infinity;
      visibleLines.push(node);
      
      if (node.isFolder && collapsedPaths.has(node.index)) {
        collapseDepthThreshold = node.depth;
      }
    }
  }

  const folderCount = parsedLines.filter((n) => n.isFolder && !n.isRootProject).length;
  const fileCount = parsedLines.filter((n) => !n.isFolder).length;
  const allFolderIdx = parsedLines.filter((n) => n.isFolder && !n.isRootProject).map((n) => n.index);
  const anyCollapsed = collapsedPaths.size > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-pm-line bg-pm-code text-[13px]">
      <div className="flex items-center justify-between gap-3 border-b border-pm-line px-3 py-2 text-xs text-pm-muted">
        <span>
          <span className="font-medium text-pm-fg tabular-nums">{folderCount}</span> folders ·{" "}
          <span className="font-medium text-pm-fg tabular-nums">{fileCount}</span> files
        </span>
        {folderCount > 0 && (
          <button
            type="button"
            onClick={() => setCollapsedPaths(anyCollapsed ? new Set() : new Set(allFolderIdx))}
            className="rounded-md px-2 py-0.5 font-medium transition-colors hover:bg-pm-hover hover:text-pm-fg"
          >
            {anyCollapsed ? "Expand all" : "Collapse all"}
          </button>
        )}
      </div>
      <div className="px-2 py-2 font-mono">
        {visibleLines.map((node) => {
          const { index, cleanNodeName, isFolder, indentPx, isRootProject } = node;
          const { color, icon } = getFileIconAndColor(cleanNodeName, isFolder);
          const isCollapsed = collapsedPaths.has(index);

          return (
            <div
              key={index}
              role={isFolder ? "button" : undefined}
              aria-expanded={isFolder ? !isCollapsed : undefined}
              className={cn(
                "flex h-[26px] items-center rounded-md pr-3 transition-colors select-none hover:bg-pm-hover",
                isFolder && "cursor-pointer",
              )}
              style={{ paddingLeft: `${indentPx}px` }}
              onClick={() => isFolder && toggleFolder(index)}
            >
              <span className="mr-1 flex w-4 shrink-0 justify-center text-pm-muted">
                {isFolder && <ChevronDown className={cn("size-3.5 transition-transform", isCollapsed && "-rotate-90")} />}
              </span>
              <span className="mr-1.5 flex shrink-0" style={{ color }}>
                {icon}
              </span>
              <span
                className={cn(
                  "truncate",
                  isRootProject ? "font-semibold text-pm-fg" : isFolder ? "font-medium text-pm-fg/90" : "text-pm-fg/75",
                )}
              >
                {cleanNodeName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}