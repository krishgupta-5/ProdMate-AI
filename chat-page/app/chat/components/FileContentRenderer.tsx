"use client";

import React from "react";
import DbSchemaViewer from "@/app/chat/components/DbSchemaViewer";
import FolderStructureViewer from "@/app/chat/components/FolderStructureViewer";
import ApiDesignViewer from "@/app/chat/components/ApiDesignViewer";
import TestingPlanViewer from "@/app/chat/components/TestingPlanViewer";
import CodeRenderer from "@/app/chat/components/CodeRenderer";
import MarkdownRenderer from "@/app/chat/components/MarkdownRenderer";
import { MARKDOWN_LANGS } from "@/app/chat/components/artifacts";

interface Message {
  id: string;
  file?: {
    name: string;
    language: string;
    content: string;
    dbSchema?: { mermaid: string; diagram: string };
  };
}

interface FileContentRendererProps {
  msg: Message;
  markdownMode: Record<string, "code" | "preview">;
}

/** The body of an artifact card: picks the right viewer for the artifact's language. */
export default function FileContentRenderer({ msg, markdownMode }: FileContentRendererProps) {
  if (!msg.file) return null;
  const { language, content } = msg.file;

  if (language === "dbschema") {
    return (
      <div className="p-4 sm:p-5">
        <DbSchemaViewer mermaid={msg.file.dbSchema?.mermaid ?? ""} diagram={msg.file.dbSchema?.diagram ?? content} />
      </div>
    );
  }

  if (language === "image") {
    return (
      <div className="flex justify-center bg-pm-shell p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={content} alt={msg.file.name} className="max-h-[400px] max-w-full rounded-lg border border-pm-line object-contain" />
      </div>
    );
  }

  if (language === "folder")
    return (
      <div className="px-4 py-4 sm:px-5">
        <FolderStructureViewer content={content} />
      </div>
    );
  if (language === "apidesign")
    return (
      <div className="p-4 sm:p-5">
        <ApiDesignViewer content={content} />
      </div>
    );
  if (language === "testingplan")
    return (
      <div className="p-4 sm:p-5">
        <TestingPlanViewer content={content} />
      </div>
    );

  if (MARKDOWN_LANGS.includes(language)) {
    return markdownMode[msg.id] === "code" ? (
      <div className="bg-pm-code py-3">
        <CodeRenderer content={content} language="markdown" />
      </div>
    ) : (
      <div className="px-5 py-5 sm:px-6">
        <MarkdownRenderer content={content} />
      </div>
    );
  }

  // YAML, Docker, config and anything else: highlighted source.
  return (
    <div className="bg-pm-code py-3">
      <CodeRenderer content={content} language={language} />
    </div>
  );
}
