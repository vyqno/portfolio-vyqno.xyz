"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, File } from "lucide-react";
import { cn } from "@/lib/utils";

export type TreeNode = {
  id: string;
  name: string;
  tooltip?: string;
  type: "folder" | "file";
  content?: React.ReactNode;
  children?: TreeNode[];
};

export default function TreeNodeTooltip({
  node,
  initiallyExpanded = true,
  onSelect,
}: {
  node: TreeNode;
  initiallyExpanded?: boolean;
  onSelect?: (node: TreeNode) => void;
}) {
  const isFolder = node.type === "folder";
  const hasChildren = node.children && node.children.length > 0;
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder && hasChildren) {
      setIsExpanded(!isExpanded);
    } else if (!isFolder && onSelect) {
      onSelect(node);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-md w-full text-left",
          "hover:bg-zinc-800/30 hover:text-zinc-100 transition-colors group",
          hasChildren || (!isFolder && onSelect) ? "cursor-pointer" : "cursor-default"
        )}
      >
        {isFolder ? (
          hasChildren ? (
            isExpanded ? (
              <ChevronDown size={14} className="text-zinc-500 shrink-0" />
            ) : (
              <ChevronRight size={14} className="text-zinc-500 shrink-0" />
            )
          ) : (
            <ChevronRight size={14} className="text-zinc-500 shrink-0" />
          )
        ) : (
          <File size={14} className="text-zinc-600 ml-2 shrink-0" />
        )}
        <span className="truncate text-zinc-300 group-hover:text-zinc-100 text-sm transition-colors">{node.name}</span>
      </div>

      <AnimatePresence initial={false}>
        {isFolder && hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-[14px] border-l border-zinc-800 pl-[10px] pb-1 flex flex-col">
              {node.children!.map((child) => (
                <TreeNodeTooltip key={child.id} node={child} onSelect={onSelect} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
