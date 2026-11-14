"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Copy, FolderKanban, Lock, Pencil, Wrench } from "lucide-react";
import { LogoMark } from "@/app/chat/components/Logo";
import { humanizeStatus } from "@/lib/artifact-labels";
import { useSmoothScroll } from "@/lib/use-smooth-scroll";
import { satoshi } from "@/constants";
import { TopBar, Crumb } from "@/app/chat/components/AppShell";
import { buttonClass } from "@/app/chat/components/ui";
import { TOKEN_QUOTA_EVENT } from "@/app/chat/components/TokenUsage";
import { getSessionId, resetSessionId } from "@/lib/sessionId";
import DbSchemaViewer from "@/app/chat/components/DbSchemaViewer";
import FolderStructureViewer from "@/app/chat/components/FolderStructureViewer";
import ApiDesignViewer from "@/app/chat/components/ApiDesignViewer";
import TestingPlanViewer from "@/app/chat/components/TestingPlanViewer";
import CodeRenderer from "@/app/chat/components/CodeRenderer";
import MarkdownRenderer from "@/app/chat/components/MarkdownRenderer";
import ArtifactCard from "@/app/chat/components/ArtifactCard";
import InputArea from "@/app/chat/components/InputArea";
import FinalSummaryCard from "@/app/chat/components/FinalSummaryCard";
import EmailPreviewCard from "@/app/chat/components/EmailPreviewCard";
import MeetingPreviewCard from "@/app/chat/components/MeetingPreviewCard";
import type { ProgressEvent, EmailPreview, MeetingPreview } from "@/lib/pipeline/types";



// ── ProdMate Design Tokens (light palette shared with the landing page, see globals.css) ──
const T = {
  bg: "var(--pm-card)",
  surface: "var(--pm-shell)",
  surfaceHover: "var(--pm-hover)",
  border: "var(--pm-line)",
  borderHover: "var(--pm-line-strong)",
  text: "var(--pm-fg)",
  textMuted: "var(--pm-fg-soft)",
  textHint: "var(--pm-muted)",
  accent: "var(--pm-primary)",
  font: "var(--font-inter), system-ui, -apple-system, sans-serif",
};

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  tools?: string[];
  file?: {
    name: string;
    language: string;
    content: string;
    dbSchema?: { mermaid: string; diagram: string };
  };
  options?: string[];
  notionUrl?: string;
  exportStatus?: string;
  githubUrl?: string;
  githubExportStatus?: string;
  jiraUrl?: string;
  jiraExportStatus?: string;
  emailPreview?: EmailPreview;
  meetingPreview?: MeetingPreview;
}

const initialMessages: Message[] = [];

interface ChatPanelProps {
  agentName: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  sessionId?: string;
  showLoginModal?: boolean;
  onShowLoginModal?: (show: boolean) => void;
  isSharedView?: boolean;
  sharedData?: any;
}

type ArtifactType =
  | "initial" | "config" | "docker" | "markdown" | "folderStructure"
  | "apiDesign" | "testingPlan" | "userStories" | "roadmap"
  | "deploymentGuide" | "costEstimation" | "projectTimeline"
  | "riskAnalysis" | "finalMarkdown" | "db";

type Step =
  | "docs" | "config" | "docker" | "apiDesign" | "db" | "folder"
  | "testingPlan" | "userStories" | "deploymentGuide" | "roadmap"
  | "costEstimation" | "projectTimeline" | "riskAnalysis" | "finalMarkdown";

const LANG_TO_ARTIFACT: Record<string, ArtifactType> = {
  yaml: "config", markdown: "markdown", folder: "folderStructure",
  apidesign: "apiDesign", testingplan: "testingPlan", userstories: "userStories",
  deploymentguide: "deploymentGuide", roadmap: "roadmap",
  costestimation: "costEstimation", projecttimeline: "projectTimeline",
  riskanalysis: "riskAnalysis", finalmarkdown: "finalMarkdown",
};

const OPTION_TO_ARTIFACT: Record<string, ArtifactType> = {
  "system config": "config", "show docker": "docker",
  "show api design": "apiDesign", "view db schema": "db",
  "show folder structure": "folderStructure", "show testing plan": "testingPlan",
  "generate docs": "markdown", "show user stories": "userStories",
  "show roadmap": "roadmap", "show deployment guide": "deploymentGuide",
  "show cost estimation": "costEstimation", "show project timeline": "projectTimeline",
  "show risk analysis": "riskAnalysis", "generate final doc": "finalMarkdown",
};

const greetingFor = (date: Date) => {
  const h = date.getHours();
  if (h < 5) return "Good evening";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const aiPhrases = [
  "Synthesizing context...",
  "Applying architectural patterns...",
  "Optimizing structure...",
  "Finalizing output...",
];

const generalPhrases = [
  "Analyzing request...",
  "Gathering thoughts...",
  "Formulating response...",
  "Writing...",
];

const exportPhrases = [
  "Syncing with integrations...",
  "Exporting to GitHub...",
  "Setting up Jira project...",
  "Publishing Notion docs...",
];

const TypingStatusText = ({ artifact, isExporting }: { artifact: string | null, isExporting?: boolean }) => {
  const [idx, setIdx] = useState(0);

  // Decide which phrases to use based on mode
  let phrases = aiPhrases;
  if (isExporting) {
    phrases = exportPhrases;
  } else if (!artifact) {
    phrases = generalPhrases;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [phrases]);

  const artifactMap: Record<string, string> = {
    initial: "System Architecture",
    config: "System Configuration",
    docker: "Docker Environment",
    markdown: "Project Documentation",
    folderStructure: "Directory Structure",
    apiDesign: "API Specifications",
    testingPlan: "Testing Strategy",
    userStories: "User Stories",
    roadmap: "Product Roadmap",
    deploymentGuide: "Deployment Infrastructure",
    costEstimation: "Cost Analysis",
    projectTimeline: "Project Timeline",
    riskAnalysis: "Risk Assessment",
    finalMarkdown: "Final Specification",
    db: "Database Schema",
  };

  const isGeneral = !artifact && !isExporting;
  const artifactName = artifact ? (artifactMap[artifact] || "Artifacts") : "Response";

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px]">
      <span className="pm-shimmer font-semibold">
        {isExporting ? "Exporting project" : isGeneral ? "Thinking" : `Generating ${artifactName}`}
      </span>
      <span className="flex gap-1" aria-hidden>
        <span className="typing-dot size-1 rounded-full bg-pm-primary" />
        <span className="typing-dot size-1 rounded-full bg-pm-primary" />
        <span className="typing-dot size-1 rounded-full bg-pm-primary" />
      </span>
      <span key={idx} className="text-pm-muted animate-in fade-in duration-300">
        {phrases[idx]}
      </span>
    </div>
  );
};

/** Round profile picture, or the first letter of the name when there's no picture. */
const UserAvatar = ({ imageUrl, name }: { imageUrl?: string; name?: string }) => {
  const initial = (name && name !== "You" ? name : "Y").trim().charAt(0).toUpperCase();
  return imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt="" className="mt-0.5 size-8 shrink-0 rounded-full border border-pm-line object-cover" />
  ) : (
    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-pm-primary/12 text-xs font-semibold text-pm-accent">{initial}</span>
  );
};
/** Copy (and for your own messages, Edit) shown under a message on hover. */
const MessageActions = ({ content, align = "start", onEdit }: { content: string; align?: "start" | "end"; onEdit?: () => void }) => {
  const [copied, setCopied] = useState(false);
  const clean = content.replace(/\n\n\[System Context:[\s\S]*?\]/, "").replace(/\n\nCurrent Draft:\n[\s\S]*/, "");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(clean);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const btn =
    "grid size-7 place-items-center rounded-lg text-pm-muted transition-colors hover:bg-pm-shell hover:text-pm-fg [&_svg]:size-3.5";
  return (
    <div
      className={`mt-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/msg:opacity-100 focus-within:opacity-100 ${
        align === "end" ? "justify-end" : "-ml-1.5"
      }`}
    >
      <button type="button" onClick={copy} title={copied ? "Copied" : "Copy"} aria-label="Copy message" className={btn}>
        {copied ? <Check className="text-pm-green" /> : <Copy />}
      </button>
      {onEdit && (
        <button type="button" onClick={onEdit} title="Edit" aria-label="Edit message" className={btn}>
          <Pencil />
        </button>
      )}
    </div>
  );
};

export default function ChatPanel({
  agentName, onToggleSidebar, isSidebarOpen = true,
  sessionId, showLoginModal, onShowLoginModal, isSharedView, sharedData,
}: ChatPanelProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);
  const [cachedDisplayName, setCachedDisplayName] = useState<string>("You");

  // Use layout effect to run synchronously before browser paint to prevent flash
  // and keep initial state null to avoid hydration mismatch with server
  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const img = localStorage.getItem("ProdMate-user-image");
      if (img) setCachedImageUrl(img);
      const name = localStorage.getItem("ProdMate-user-name");
      if (name) setCachedDisplayName(name);
    }
  }, []);

  useEffect(() => {
    if (user?.imageUrl) {
      setCachedImageUrl(user.imageUrl);
      localStorage.setItem("ProdMate-user-image", user.imageUrl);
    }

    if (user?.firstName || user?.primaryEmailAddress?.emailAddress) {
      const name = user.firstName
        ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
        : (user.primaryEmailAddress?.emailAddress ?? "You");
      setCachedDisplayName(name);
      localStorage.setItem("ProdMate-user-name", name);
    }
  }, [user]);

  const [messages, setMessages] = useState<Message[]>(isSharedView ? (sharedData?.messages || []) : initialMessages);
  const [input, setInput] = useState(() => {
    if (typeof window !== "undefined") {
      const p = localStorage.getItem("pending_prompt");
      if (p) {
        localStorage.removeItem("pending_prompt");
        return p;
      }
    }
    return "";
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generatingArtifact, setGeneratingArtifact] = useState<ArtifactType | null>(null);
  const [markdownMode, setMarkdownMode] = useState<Record<string, "code" | "preview">>({});
  const [generatedData, setGeneratedData] = useState<any>(isSharedView ? sharedData : null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasGeneratedConfig, setHasGeneratedConfig] = useState(isSharedView ? true : false);
  const [conversationMode, setConversationMode] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<any>(null);
  const [modifyMode, setModifyMode] = useState(false);
  const [modifyTargetArtifact, setModifyTargetArtifact] = useState<ArtifactType | null>(null);
  const [tokenQuota, setTokenQuota] = useState<{
    tokensUsed: number; tokensLimit: number; tokensRemaining: number;
    exhausted: boolean; resetAt: number;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean; x: number; y: number;
    messageId: string; messageContent: string; messageRole: string;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [liveEvents, setLiveEvents] = useState<ProgressEvent[]>([]);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [integrationData, setIntegrationData] = useState<{
    github: boolean;
    notion: boolean;
    jira: boolean;
  }>({ github: false, notion: false, jira: false });
  const [isInitialLoading, setIsInitialLoading] = useState(!!sessionId && !isSharedView);
  const [sessionTitle, setSessionTitle] = useState<string>(isSharedView ? sharedData?.metadata?.title || "" : "");

  // After each reply the server may have just named the chat; pick the name up from the same list
  // the sidebar shows, so both always match.
  useEffect(() => {
    if (isSharedView || !sessionId) return;
    const refresh = () =>
      fetch("/api/sessions", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const s = d?.sessions?.find((x: { sessionId: string }) => x.sessionId === sessionId);
          if (s?.lastMessage) setSessionTitle(s.lastMessage);
        })
        .catch(() => {});
    refresh();
    window.addEventListener("refresh-sessions", refresh);
    return () => window.removeEventListener("refresh-sessions", refresh);
  }, [sessionId, isSharedView]);

  // Eased wheel scrolling once the message list is showing (it must be the scroller's only child).
  useSmoothScroll(scrollableRef, !isInitialLoading && messages.length > 0);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    // Only auto-scroll if we are already at the bottom, or if AI is typing.
    // If user explicitly scrolled up, don't force them down unless it's a new generation.
    scrollToBottom();
  }, [messages.length, isTyping]);

  const handleScroll = () => {
    if (!scrollableRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
  };

  useEffect(() => {
    if (!isSignedIn || isSharedView) return;
    fetch("/api/token-quota").then(r => r.ok ? r.json() : null).then(d => d && setTokenQuota(d));
    Promise.all([
      fetch("/api/integrations").then(res => res.json()).catch(() => ({})),
      fetch("/api/notion/pages").then(res => res.json()).catch(() => ({}))
    ]).then(([integrations, notion]) => {
      setIntegrationData({
        github: !!integrations?.github?.accessToken,
        jira: !!integrations?.jira?.accessToken,
        notion: !!notion?.connected
      });
    });
  }, [isSignedIn, isSharedView]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) setContextMenu(null);
    };
    if (contextMenu?.visible) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [contextMenu?.visible]);

  const handleCopyMessage = async (content: string) => {
    try { await navigator.clipboard.writeText(content); }
    catch {
      const el = document.createElement("textarea"); el.value = content;
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setContextMenu(null);
  };
  const handleDeleteMessage = (id: string) => { setMessages(p => p.filter(m => m.id !== id)); setContextMenu(null); };
  const handleEditMessage = (id: string, content: string) => {
    const n = prompt("Edit message:", content);
    if (n && n !== content) setMessages(p => p.map(m => m.id === id ? { ...m, content: n } : m));
    setContextMenu(null);
  };

  // Listen to SSE Events
  useEffect(() => {
    if (!sessionId || isSharedView) {
      setLiveEvents([]);
      return;
    }
    const eventSource = new EventSource(`/api/events?sessionId=${sessionId}`);
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as ProgressEvent;
        setLiveEvents((prev) => {
          // Avoid duplicates based on type and source
          if (prev.find(p => p.type === data.type && p.source === data.source && p.message === data.message)) return prev;
          return [...prev, data];
        });
      } catch (err) {
        console.error('Failed to parse SSE event', err);
      }
    };
    eventSource.onerror = (err) => {
      console.error('SSE Error', err);
      eventSource.close();
    };
    return () => eventSource.close();
  }, [sessionId, isSharedView]);

  // Load chat history
  useEffect(() => {
    let isMounted = true;
    let pollingTimer: NodeJS.Timeout | null = null;

    const load = async () => {
      if (!isSharedView && !isSignedIn) return;
      if (!isSharedView && !sessionId) {
        if (isMounted) { setMessages([]); setGeneratedData(null); setHasGeneratedConfig(false); }
        return;
      }
      try {
        let resData: any;
        if (isSharedView && sharedData) {
          resData = sharedData;
        } else {
          const res = await fetch(`/api/chat-history?sessionId=${sessionId}`, { cache: "no-store" });
          if (!res.ok) return;
          resData = await res.json();
        }
        const {
          messages: rawAll = [],
          artifacts: rawArtifacts = {},
          notionUrl, exportStatus, githubUrl, githubExportStatus, jiraUrl, jiraExportStatus,
          conversationMode: apiConvMode, pendingIntegrationUpdates, title: apiTitle
        } = resData;
        if (apiTitle && isMounted && !/^(generate|show|view|system config|untitled)\b/i.test(apiTitle)) setSessionTitle(apiTitle);

        if (apiConvMode) setConversationMode(true);
        if (pendingIntegrationUpdates) setPendingUpdates(pendingIntegrationUpdates);

        const raw: any[] = [];
        for (const msg of rawAll) {
          const prev = raw[raw.length - 1];
          if (prev && prev.role === msg.role && prev.content === msg.content) continue;
          raw.push(msg);
        }

        const singleArtifactToKey: Record<string, string> = {
          config: "yaml", docker: "docker", markdown: "markdown", folderStructure: "folderStructure",
          apiDesign: "apiDesign", testingPlan: "testingPlan", userStories: "userStories",
          roadmap: "roadmap", deploymentGuide: "deploymentGuide", costEstimation: "costEstimation",
          projectTimeline: "projectTimeline", riskAnalysis: "riskAnalysis", finalMarkdown: "finalMarkdown",
        };

        const singleArtifactToStep: Record<string, Step> = {
          config: "config", docker: "docker", markdown: "docs", folderStructure: "folder",
          apiDesign: "apiDesign", testingPlan: "testingPlan", userStories: "userStories",
          roadmap: "roadmap", deploymentGuide: "deploymentGuide", costEstimation: "costEstimation",
          projectTimeline: "projectTimeline", riskAnalysis: "riskAnalysis", finalMarkdown: "finalMarkdown",
          db: "db"
        };

        let latestResult: any = {};
        for (const [key, artifact] of Object.entries(rawArtifacts) as [string, any][]) {
          const mappedKey = singleArtifactToKey[key] || key;
          if (key === 'db' || key === 'dbSchema') {
            try { latestResult.dbSchema = JSON.parse(artifact.content); } catch { }
          } else {
            latestResult[mappedKey] = artifact.content;
          }
        }

        // Always run legacy extraction fallback to populate yaml/markdown for old sessions
        // where they were not saved in the artifacts subcollection
        for (const msg of raw) {
          if (msg.role === "assistant") {
            try {
              const p = JSON.parse(msg.content);
              if (p.yaml && !latestResult.yaml) { latestResult = { ...latestResult, yaml: p.yaml, markdown: p.markdown }; }
              else if (p.artifact && p.content) {
                const key = singleArtifactToKey[p.artifact];
                if (key && !latestResult[key]) latestResult[key] = p.content;
              }
            } catch { }
          }
        }

        const historyMessages: Message[] = [];
        let localHasConfig = false;

        for (const msg of raw) {
          const ts = new Date(msg.createdAt?.toDate?.() || msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          if (msg.role === "user") { historyMessages.push({ id: msg.id, role: "user", content: msg.content, timestamp: ts }); continue; }

          let parsed: any = null;
          try { parsed = JSON.parse(msg.content); } catch { }

          // LEGACY MESSAGE FORMAT
          if (parsed && (parsed.yaml || parsed.artifact)) {
            if (parsed.artifact && parsed.content && !parsed.yaml) {
              const step = singleArtifactToStep[parsed.artifact];
              const dataKey = singleArtifactToKey[parsed.artifact];
              if (step && dataKey) {
                const syntheticData = { [dataKey]: parsed.content };
                const { content, file, options } = buildAssistantMessage(step, syntheticData, false);
                historyMessages.push({ id: msg.id, role: "assistant", content, timestamp: ts, file, options });
                continue;
              }
            }
            if (!parsed.yaml) { historyMessages.push({ id: msg.id, role: "assistant", content: msg.content, timestamp: ts }); continue; }

            const steps: Step[] = ["docs", "config", "docker", "apiDesign", "db", "folder", "testingPlan", "userStories", "roadmap", "deploymentGuide", "projectTimeline", "riskAnalysis", "finalMarkdown"];
            const hasData = (s: Step) => {
              switch (s) {
                case "config": return !!parsed.yaml; case "docker": return !!parsed.docker;
                case "docs": return !!parsed.markdown; case "folder": return !!parsed.folderStructure;
                case "db": return !!parsed.dbSchema; case "apiDesign": return !!parsed.apiDesign;
                case "testingPlan": return !!parsed.testingPlan; case "userStories": return !!parsed.userStories;
                case "roadmap": return !!parsed.roadmap; case "deploymentGuide": return !!parsed.deploymentGuide;
                case "projectTimeline": return !!parsed.projectTimeline; case "riskAnalysis": return !!parsed.riskAnalysis;
                case "finalMarkdown": return !!parsed.finalMarkdown; default: return false;
              }
            };
            for (const step of steps) {
              if (!hasData(step)) continue;
              const { content, file, options } = buildAssistantMessage(step, parsed, step === "docs" && !localHasConfig);
              if (step === "config") localHasConfig = true;
              historyMessages.push({ id: `${msg.id}-${step}`, role: "assistant", content, timestamp: ts, file, options });
            }
            continue;
          }

          // NEW MESSAGE FORMAT
          if (msg.artifactType) {
            if (msg.artifactType === 'initial') {
              const { content: c1, file: f1, options: o1 } = buildAssistantMessage('docs', latestResult, !localHasConfig);
              historyMessages.push({ id: `${msg.id}-docs`, role: "assistant", content: msg.content, timestamp: ts, file: f1, options: o1 });

              const { content: c2, file: f2, options: o2 } = buildAssistantMessage('config', latestResult, false);
              localHasConfig = true;
              historyMessages.push({ id: `${msg.id}-config`, role: "assistant", content: "System configuration is ready.", timestamp: ts, file: f2, options: o2 });
            } else {
              const step = singleArtifactToStep[msg.artifactType];
              if (step) {
                const { file, options } = buildAssistantMessage(step, latestResult, false);
                historyMessages.push({ id: msg.id, role: "assistant", content: msg.content, timestamp: ts, file, options });
              } else {
                historyMessages.push({ id: msg.id, role: "assistant", content: msg.content, timestamp: ts, emailPreview: msg.emailPreview, meetingPreview: msg.meetingPreview });
              }
            }
          } else {
            historyMessages.push({ id: msg.id, role: "assistant", content: msg.content, timestamp: ts, emailPreview: msg.emailPreview, meetingPreview: msg.meetingPreview });
          }
        }

        if (notionUrl || exportStatus || githubUrl || githubExportStatus || jiraUrl || jiraExportStatus) {
          const finalMsgIndex = historyMessages.findIndex(m => m.file?.name === "final-spec.md");
          if (finalMsgIndex !== -1) {
            historyMessages[finalMsgIndex].notionUrl = notionUrl;
            historyMessages[finalMsgIndex].exportStatus = exportStatus;
            historyMessages[finalMsgIndex].githubUrl = githubUrl;
            historyMessages[finalMsgIndex].githubExportStatus = githubExportStatus;
            historyMessages[finalMsgIndex].jiraUrl = jiraUrl;
            historyMessages[finalMsgIndex].jiraExportStatus = jiraExportStatus;
          } else if (historyMessages.length > 0) {
            historyMessages[historyMessages.length - 1].notionUrl = notionUrl;
            historyMessages[historyMessages.length - 1].exportStatus = exportStatus;
            historyMessages[historyMessages.length - 1].githubUrl = githubUrl;
            historyMessages[historyMessages.length - 1].githubExportStatus = githubExportStatus;
            historyMessages[historyMessages.length - 1].jiraUrl = jiraUrl;
            historyMessages[historyMessages.length - 1].jiraExportStatus = jiraExportStatus;
          }
        }

        if (isMounted) {
          setMessages(historyMessages);
          if (Object.keys(latestResult).length > 0) {
            setGeneratedData(latestResult);
            setHasGeneratedConfig(true);
            setConversationMode(true);
          }

          const isAwaitingAssistant = historyMessages.length > 0 && historyMessages[historyMessages.length - 1].role === 'user';
          const isAwaitingNotion = Object.keys(latestResult).includes('finalMarkdown') && exportStatus === 'PENDING';
          const isAwaitingGithub = Object.keys(latestResult).includes('finalMarkdown') && githubExportStatus === 'PENDING';
          const isAwaitingJira = Object.keys(latestResult).includes('finalMarkdown') && jiraExportStatus === 'PENDING';
          const awaitingExport = isAwaitingNotion || isAwaitingGithub || isAwaitingJira;

          setIsExporting(awaitingExport);

          if (isAwaitingAssistant || awaitingExport) {
            pollingTimer = setTimeout(load, 3000);
          }
          setIsInitialLoading(false);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
        if (isMounted) setIsInitialLoading(false);
      }
    };

    // Only clear on initial mount/session change
    if (sessionId || isSharedView) {
      setMessages([]); setGeneratedData(null); setHasGeneratedConfig(false);
      load();
    } else {
      setMessages([]); setGeneratedData(null); setHasGeneratedConfig(false);
    }

    return () => {
      isMounted = false;
      if (pollingTimer) clearTimeout(pollingTimer);
    };
  }, [sessionId, isSignedIn, isSharedView]);

  const buildAssistantMessage = (step: Step, data: any, isFirstDocs: boolean): { content: string; file: Message["file"]; options: string[] } => {
    switch (step) {
      case "config": return { content: isFirstDocs ? "System config generated.\nProceed to generate documentation or explore artifacts below." : "System config loaded.", file: { name: "system-config.yaml", language: "yaml", content: data.yaml }, options: ["Show Docker"] };
      case "docker": return { content: "Docker Compose configuration generated. Services, volumes, and health checks are bound.", file: { name: "docker-compose.yaml", language: "yaml", content: data.docker }, options: ["Show API Design"] };
      case "docs": return { content: "Project documentation generated.", file: { name: "README.md", language: "markdown", content: data.markdown }, options: ["System Config"] };
      case "folder": return { content: "Project folder structure generated.", file: { name: "project-structure.txt", language: "folder", content: data.folderStructure ?? "Not available." }, options: ["Show Testing Plan"] };
      case "apiDesign": { const c = data.apiDesign ?? ""; if (!c) return { content: "API design not available.", file: undefined, options: ["View DB Schema"] }; return { content: "API design specification generated.", file: { name: "api-design.yaml", language: "apidesign", content: c }, options: ["View DB Schema"] }; }
      case "testingPlan": { const c = data.testingPlan ?? ""; if (!c) return { content: "Testing plan not available.", file: undefined, options: ["Show User Stories", "View DB Schema", "Show Folder Structure"] }; return { content: "Testing plan generated. Unit, integration, and E2E strategy defined.", file: { name: "testing-plan.yaml", language: "testingplan", content: c }, options: ["Show User Stories", "View DB Schema", "Show Folder Structure"] }; }
      case "userStories": { const c = data.userStories ?? ""; if (!c) return { content: "User stories not available.", file: undefined, options: ["Show Testing Plan"] }; return { content: "User stories generated. All modules covered.", file: { name: "user-stories.md", language: "userstories", content: c }, options: ["Show Roadmap", "Show Testing Plan", "Show Folder Structure"] }; }
      case "roadmap": { const c = data.roadmap ?? ""; if (!c) return { content: "Roadmap not available.", file: undefined, options: ["Show User Stories"] }; return { content: "Product roadmap generated. Phases, milestones, and dependencies mapped.", file: { name: "roadmap.md", language: "roadmap", content: c }, options: ["Show Deployment Guide", "Show User Stories", "Show Cost Estimation"] }; }
      case "deploymentGuide": { const c = data.deploymentGuide ?? ""; if (!c) return { content: "Deployment guide not available.", file: undefined, options: ["Show Roadmap"] }; return { content: "Deployment guide generated. Infrastructure, CI/CD, rollback, and monitoring covered.", file: { name: "deployment-guide.md", language: "deploymentguide", content: c }, options: ["Show Roadmap", "Show Docker", "Show Cost Estimation"] }; }
      case "costEstimation": { const c = data.costEstimation ?? ""; if (!c) return { content: "Cost estimation not available.", file: undefined, options: ["Show Roadmap", "Show Deployment Guide", "Show Project Timeline"] }; return { content: "Cost estimation report generated. Development, infrastructure, and scaling costs mapped.", file: { name: "cost-estimation.md", language: "costestimation", content: c }, options: ["Show Deployment Guide", "Show Project Timeline", "Show Risk Analysis"] }; }
      case "projectTimeline": { const c = data.projectTimeline ?? ""; if (!c) return { content: "Project timeline not available.", file: undefined, options: ["Show Roadmap", "Show Cost Estimation", "Show Risk Analysis"] }; return { content: "Project timeline generated. All phases, critical path, and delivery estimates mapped.", file: { name: "project-timeline.md", language: "projecttimeline", content: c }, options: ["Show Deployment Guide", "Show Project Timeline", "Show Risk Analysis"] }; }
      case "riskAnalysis": { const c = data.riskAnalysis ?? ""; if (!c) return { content: "Risk analysis not available.", file: undefined, options: ["Show Project Timeline", "Show Cost Estimation", "Generate Final Doc"] }; return { content: "Risk analysis generated. Technical, security, infrastructure, and operational risks mapped.", file: { name: "risk-analysis.md", language: "riskanalysis", content: c }, options: ["Show Project Timeline", "Show Cost Estimation", "Generate Final Doc"] }; }
      case "finalMarkdown": { const c = data.finalMarkdown ?? ""; if (!c) return { content: "Final document not available.", file: undefined, options: [] }; return { content: "Final project document generated. All artifacts consolidated into a single specification.", file: { name: "final-spec.md", language: "finalmarkdown", content: c }, options: [] }; }
      case "db": if (!data.dbSchema) return { content: "ERR: DB schema not available.\n\nCheck ACTIVEPIECES_WEBHOOK_URL in .env.local.", file: undefined, options: ["Show Folder Structure"] }; return { content: "Database schema rendered via n8n.", file: { name: "schema.er", language: "dbschema", content: data.dbSchema.diagram ?? "", dbSchema: { mermaid: data.dbSchema.mermaid ?? "", diagram: data.dbSchema.diagram ?? "" } }, options: ["Show Folder Structure"] };
      default: return { content: "", file: undefined, options: [] };
    }
  };

  const handleSend = async (overrideInput?: string, forceArtifact?: ArtifactType) => {
    if (isSharedView) return;
    const textToSend = (overrideInput ?? input).trim();
    if (!isSignedIn) {
      if (textToSend) localStorage.setItem("pending_prompt", textToSend);
      onShowLoginModal?.(true);
      return;
    }
    if (tokenQuota?.exhausted) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: `Daily token limit reached.`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      return;
    }
    if (!textToSend) return;
    let forceArtifactParam = forceArtifact;
    if (!forceArtifactParam) {
      const matchedArtifact = OPTION_TO_ARTIFACT[textToSend.toLowerCase()];
      if (matchedArtifact) {
        forceArtifactParam = matchedArtifact;
      }
    }

    let artifact: ArtifactType;
    let isModify = false;
    if (forceArtifactParam) { artifact = !hasGeneratedConfig ? "initial" : forceArtifactParam; isModify = false; }
    else if (modifyMode && modifyTargetArtifact) { artifact = modifyTargetArtifact; isModify = true; }
    else if (!hasGeneratedConfig) { artifact = "initial"; isModify = false; }
    else { artifact = "markdown"; isModify = false; }
    const currentSessionId = sessionId || getSessionId() || resetSessionId();
    if (!sessionId) { window.history.replaceState(null, "", `/chat/${currentSessionId}`); sessionStorage.setItem("ProdMate-session-id", currentSessionId); }

    // Format chat history for /api/chat context
    const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: textToSend, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    if (!overrideInput) setInput("");
    setIsTyping(true);
    setGeneratingArtifact(artifact);
    if (!overrideInput && textareaRef.current) textareaRef.current.style.height = "auto";
    setModifyMode(false); setModifyTargetArtifact(null);
    try {
      const isExplicitRequest = !!forceArtifactParam || (modifyMode && !!modifyTargetArtifact);
      // We also want to use chat if they've generated a config (i.e. conversationMode is effectively true for free text)
      const useChat = (conversationMode || hasGeneratedConfig) && !isExplicitRequest;
      const endpoint = useChat ? "/api/chat" : "/api/generate";
      const payload = useChat
        ? { prompt: textToSend, sessionId: currentSessionId, history: chatHistory }
        : { prompt: textToSend, sessionId: currentSessionId, artifact, mode: isModify ? "modify" : "generate" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        let errMsg = `API error: ${res.status}`;
        try { const errBody = await res.json(); if (errBody.error) errMsg = errBody.error; if (errBody.code) errMsg += ` [${errBody.code}]`; } catch { }
        throw new Error(errMsg);
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const quotaRes = await fetch("/api/token-quota");
      if (quotaRes.ok) {
        const fresh = await quotaRes.json(); setTokenQuota(fresh);
        window.dispatchEvent(new CustomEvent(TOKEN_QUOTA_EVENT, { detail: fresh }));
      }

      let merged: any = generatedData ? { ...generatedData } : {};

      if (useChat) {
        // Conversational Mode Response (Groq + Gemini if modified)
        setMessages(prev => {
          // If the new message has a preview, remove previous previews to maintain a single draft
          let updatedPrev = prev;
          if (data.emailPreview || data.meetingPreview) {
            updatedPrev = prev.map(m => {
              if (m.emailPreview?.status === 'preview' && data.emailPreview) return { ...m, emailPreview: undefined };
              if (m.meetingPreview?.status === 'preview' && data.meetingPreview) return { ...m, meetingPreview: undefined };
              return m;
            });
          }
          return [...updatedPrev, {
            id: data.id || (Date.now() + 1).toString(),
            role: "assistant",
            content: data.content,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            emailPreview: data.emailPreview,
            meetingPreview: data.meetingPreview
          }];
        });

        // If artifacts were modified, they are updated in the backend, but we don't fetch them all again right away.
        // The SSE events would have fired, or we could just trigger a reload of history.
        if (data.artifactsModified && data.artifactsModified.length > 0) {
          // Add a minor delay then force a history reload to get the new artifact contents
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('refresh-sessions'));
            // Could also trigger a local load() here but the useEffect does it when it needs to
          }, 1000);
        }
      } else {
        // Legacy Generate Pipeline Response
        if (data.artifact === "initial") { merged = { ...merged, yaml: data.yaml, markdown: data.markdown }; setHasGeneratedConfig(true); }
        else if (isModify) {
          merged = { ...merged, yaml: data.yaml };
          const aMap: Record<string, string> = { docker: "docker", markdown: "markdown", folderStructure: "folderStructure", apiDesign: "apiDesign", testingPlan: "testingPlan", userStories: "userStories", costEstimation: "costEstimation", projectTimeline: "projectTimeline", riskAnalysis: "riskAnalysis", finalMarkdown: "finalMarkdown", config: "yaml" };
          const key = aMap[data.artifact]; if (key) merged[key] = data.content;
        } else {
          switch (data.artifact) {
            case "config": merged.yaml = data.content; break; case "docker": merged.docker = data.content; break;
            case "markdown": merged.markdown = data.content; break; case "folderStructure": merged.folderStructure = data.content; break;
            case "apiDesign": merged.apiDesign = data.content; break; case "testingPlan": merged.testingPlan = data.content; break;
            case "userStories": merged.userStories = data.content; break; case "roadmap": merged.roadmap = data.content; break;
            case "deploymentGuide": merged.deploymentGuide = data.content; break; case "costEstimation": merged.costEstimation = data.content; break;
            case "projectTimeline": merged.projectTimeline = data.content; break; case "riskAnalysis": merged.riskAnalysis = data.content; break;
            case "finalMarkdown": merged.finalMarkdown = data.content; break; case "db": merged.dbSchema = data.dbSchema; break;
          }
        }
        setGeneratedData(merged);
        const artifactToStep: Record<ArtifactType, Step> = { initial: "docs", config: "config", docker: "docker", markdown: "docs", folderStructure: "folder", apiDesign: "apiDesign", testingPlan: "testingPlan", userStories: "userStories", roadmap: "roadmap", deploymentGuide: "deploymentGuide", costEstimation: "costEstimation", projectTimeline: "projectTimeline", riskAnalysis: "riskAnalysis", finalMarkdown: "finalMarkdown", db: "db" };
        const step = artifactToStep[artifact] ?? "docs";
        const { content, file, options } = buildAssistantMessage(step, merged, !hasGeneratedConfig);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), file, options, notionUrl: data.notionUrl, exportStatus: data.exportStatus, githubUrl: data.githubUrl, githubExportStatus: data.githubExportStatus, jiraUrl: data.jiraUrl, jiraExportStatus: data.jiraExportStatus }]);
      }

      // Dispatch event to tell sidebar to refresh its sessions list
      window.dispatchEvent(new CustomEvent('refresh-sessions'));
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Execution failed."}`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } finally { setIsTyping(false); setGeneratingArtifact(null); }
  };
  const handleSendEmail = async (emailPreview: EmailPreview, messageId: string) => {
    if (!sessionId) return;

    if (!emailPreview.recipient || emailPreview.recipient.trim() === "" || emailPreview.recipient.includes("Leave empty string")) {
      alert("Please specify a valid recipient email address before sending.");
      return;
    }

    const signature = "\n\n---\nThis email was sent with the help of ProdMate.";
    const updatedEmailPreview = {
      ...emailPreview,
      body: emailPreview.body.includes("ProdMate") ? emailPreview.body : emailPreview.body + signature
    };

    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, emailPreview: { ...updatedEmailPreview, status: 'sending' } } : m));
    try {
      const res = await fetch("/api/action/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, emailPreview: updatedEmailPreview, messageId }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, emailPreview: { ...updatedEmailPreview, status: 'sent', sentAt: new Date().toISOString() } } : m));
      } else {
        const error = await res.json();
        setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, emailPreview: { ...updatedEmailPreview, status: 'preview' } } : m));
        alert(`Failed to send email: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, emailPreview: { ...updatedEmailPreview, status: 'preview' } } : m));
      alert("Failed to send email. Please check your connection or integration settings.");
    }
  };

  const handleScheduleMeeting = async (meetingPreview: MeetingPreview, messageId: string) => {
    if (!sessionId) return;
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, meetingPreview: { ...meetingPreview, status: 'scheduling' } } : m));
    try {
      const res = await fetch("/api/action/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, meetingPreview, messageId }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, meetingPreview: { ...meetingPreview, status: 'scheduled', scheduledAt: new Date().toISOString(), meetLink: data.meetLink } } : m));
      } else {
        const error = await res.json();
        setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, meetingPreview: { ...meetingPreview, status: 'preview' } } : m));
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: `Failed to schedule meeting: ${error.error || 'Unknown error'}`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, meetingPreview: { ...meetingPreview, status: 'preview' } } : m));
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Failed to schedule meeting.", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }
  };

  const handleCancelAction = (msgId: string, type: 'email' | 'meeting') => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        if (type === 'email' && m.emailPreview) {
          return { ...m, emailPreview: { ...m.emailPreview, status: 'cancelled' } };
        } else if (type === 'meeting' && m.meetingPreview) {
          return { ...m, meetingPreview: { ...m.meetingPreview, status: 'cancelled' } };
        }
      }
      return m;
    }));
  };

  const handleRefine = (prompt: string, currentState: any) => {
    const isMeeting = 'guests' in currentState;
    const contextStr = JSON.stringify(currentState);
    const draftType = isMeeting ? "Meeting" : "Email";
    handleSend(`${prompt}\n\n[System Context: Current ${draftType} Draft: ${contextStr}]`);
  };


  const handleOptionClick = (label: string) => {
    const artifact = OPTION_TO_ARTIFACT[label.toLowerCase()] ?? "markdown";
    handleSend(label, artifact);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const displayName = cachedDisplayName;

  // Time-based greeting, set on the client so server and browser render the same markup.
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => setGreeting(greetingFor(new Date())), []);
  const firstName =
    user?.firstName ||
    (cachedDisplayName !== "You" && !cachedDisplayName.includes("@") ? cachedDisplayName.split(" ")[0] : "");

  const isEmptyState = !isInitialLoading && messages.length === 0;
  // The chat's name: the AI-generated session title (same as the sidebar), else the project idea.
  const firstUserMessage = messages.find((m) => m.role === "user")?.content.replace(/\n\n\[System Context:[\s\S]*/, "").replace(/[*_`#>]/g, "").trim();
  const projectTitle = sessionTitle || (firstUserMessage ? firstUserMessage.split("\n")[0] : "") || "Untitled project";

  return (
    <div id="chat-root" className={satoshi.variable} style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden", minWidth: 0, position: "relative", fontFamily: T.font }}>

      {/* ── Top bar (the shared page has its own header) ── */}
      {!isSharedView && (
      <TopBar
        className="relative z-[100]"
        left={
          isSharedView ? (
            <Crumb icon={<Lock />}>Shared project</Crumb>
          ) : (
            <Crumb icon={<FolderKanban />}>
              <span className="max-w-[min(40vw,560px)] truncate sm:max-w-[min(56vw,560px)]" title={projectTitle}>{sessionId || isSharedView ? projectTitle : "New project"}</span>
            </Crumb>
          )
        }
        right={
          !isSharedView && isLoaded && !isSignedIn ? (
            <>
              <Link href="/login" className={buttonClass("ghost", "sm")}>
                Log in
              </Link>
              <Link href="/signup" className={buttonClass("dark", "sm")}>
                Sign up
              </Link>
            </>
          ) : null
        }
      />
      )}

      {/* ── Main content ── */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1 }}>

        {/* Scrollable Area */}
        <div
          ref={scrollableRef}
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: "auto", paddingBottom: isEmptyState ? 0 : "180px", display: "flex", flexDirection: "column" }}
        >

          {isInitialLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <span className="text-sm text-pm-muted" style={{ animation: "typingFade 2s infinite" }}>
                Loading conversation…
              </span>
            </div>
          ) : messages.length === 0 ? (
            /* ── Home screen: greeting, centred input, suggestions ── */
            <div className="flex flex-1 flex-col items-center justify-center px-5 py-8 sm:px-8">
              <div className="flex w-full max-w-2xl flex-col">
                <div className="flex flex-col items-center text-center">
                  <div className="pm-orb fade-up size-12 rounded-full" aria-hidden />
                  <h1
                    className="fade-up mt-6 text-[28px] leading-tight font-semibold tracking-tight text-pm-fg sm:text-[32px]"
                    style={{ "--delay": "0.05s" } as React.CSSProperties}
                  >
                    {greeting}
                    {firstName ? `, ${firstName}` : ""}
                  </h1>
                  <p
                    className="fade-up mt-2 max-w-md text-[15px] leading-relaxed text-pm-muted text-pretty"
                    style={{ "--delay": "0.1s" } as React.CSSProperties}
                  >
                    {hasGeneratedConfig
                      ? "Ask anything about your project, or put it to work."
                      : "Describe a software idea. ProdMate writes the PRD, roadmap, APIs, database schema and architecture."}
                  </p>
                </div>

                <div className="fade-up mt-8" style={{ "--delay": "0.15s" } as React.CSSProperties}>
                  {isSharedView ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-pm-line p-4 text-[13px] text-pm-muted">
                      <Lock className="size-3.5" />
                      This is a shared ProdMate conversation. Fork it to keep working on it.
                    </div>
                  ) : (
                    <InputArea
                      variant="hero"
                      input={input}
                      textareaRef={textareaRef}
                      tokenQuota={tokenQuota}
                      handleInputChange={handleInputChange}
                      handleKeyDown={handleKeyDown}
                      handleSend={handleSend}
                      isTyping={isTyping || isExporting}
                      hasGeneratedConfig={hasGeneratedConfig}
                    />
                  )}
                </div>

                <p className="fade-up mt-3 px-1 text-xs text-pm-muted" style={{ "--delay": "0.18s" } as React.CSSProperties}>
                  ProdMate can make mistakes. Check important details before you build on them.
                </p>

              </div>
            </div>
          ) : (
            /* ── Message list ── */
            <div className="mx-auto flex w-full max-w-[820px] flex-col gap-7 px-4 pt-4 pb-8 sm:px-8">
              {messages.map((msg, idx) => (
                <div key={msg.id}
                  className={`group/msg flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  onContextMenu={e => { e.preventDefault(); setContextMenu({ visible: true, x: e.clientX, y: e.clientY, messageId: msg.id, messageContent: msg.content, messageRole: msg.role }); }}>

                  {msg.role === "user" ? (
                    <div className="flex max-w-[85%] items-start gap-3">
                    <div className="flex min-w-0 flex-col items-end gap-1">
                      <div className="rounded-3xl rounded-br-lg bg-pm-shell px-4 py-2.5 text-[15px] leading-relaxed text-pm-fg [overflow-wrap:anywhere]">
                        <div style={{ whiteSpace: "pre-line" }}
                          dangerouslySetInnerHTML={{
                            __html: msg.content
                              .replace(/\n\n\[System Context:[\s\S]*?\]/, '')
                              .replace(/\n\nCurrent Draft:\n[\s\S]*/, '')
                              .split('<').join('&lt;').split('>').join('&gt;')
                              .replace(/^\s*(?:\*|-)\s+/gm, '• ')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }}
                        />
                      </div>
                      <MessageActions content={msg.content} align="end" onEdit={!isSharedView ? () => handleEditMessage(msg.id, msg.content) : undefined} />
                    </div>
                    {/* Your avatar (shared views show the owner's initial) */}
                    <UserAvatar imageUrl={isSharedView ? undefined : user?.imageUrl || cachedImageUrl || undefined} name={isSharedView ? sharedData?.metadata?.ownerName : displayName} />
                    </div>
                  ) : (
                    <div className="flex w-full gap-3.5">
                      {/* Assistant avatar */}
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-pm-line bg-pm-card text-pm-fg">
                        <LogoMark className="size-[18px]" />
                      </span>

                      <div className="flex w-full min-w-0 flex-col">
                        <div className="mb-1 flex h-8 items-center gap-2 text-[13px]">
                          <span className="font-semibold text-pm-fg">ProdMate</span>
                          {msg.timestamp && <span className="text-xs text-pm-muted">{msg.timestamp}</span>}
                        </div>
                        {/* Tool badges */}
                        {msg.tools && (
                          <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                            {msg.tools.map(t => (
                              <span key={t} className="inline-flex h-6 items-center gap-1 rounded-full border border-pm-line bg-pm-shell px-2.5 text-[11px] font-medium text-pm-fg/70"><Wrench className="size-3" />{t}</span>
                            ))}
                          </div>
                        )}

                        {/* Message body */}
                        <div className="w-full text-[15px] leading-[1.7] whitespace-pre-line text-pm-fg [overflow-wrap:anywhere] [&_strong]:font-semibold">
                          {(() => {
                            let text = humanizeStatus(msg.content)
                              .replace(/\n\n\[System Context:[\s\S]*?\]/, '')
                              .replace(/\n\nCurrent Draft:\n[\s\S]*/, '')
                              .split('<').join('&lt;').split('>').join('&gt;');
                            
                            const parts: React.ReactNode[] = [];
                            
                            // Fallback for previous messages that used "---" followed by paths like "app/"
                            let fallbackFolder = null;
                            if (text.includes('\n---\n') && text.includes('app/')) {
                               const split = text.split('\n---\n');
                               if (split.length === 2 && split[1].trim().includes('app/')) {
                                  text = split[0];
                                  fallbackFolder = split[1];
                               }
                            }

                            // Match ```folder ... ``` blocks
                            const folderRegex = /```folder\n([\s\S]*?)```/g;
                            let lastIndex = 0;
                            let match;

                            const formatText = (t: string) => t.replace(/^\s*(?:\*|-)\s+/gm, '• ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                            while ((match = folderRegex.exec(text)) !== null) {
                              if (match.index > lastIndex) {
                                const chunk = text.substring(lastIndex, match.index);
                                parts.push(<span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: formatText(chunk) }} />);
                              }
                              parts.push(
                                <div key={`folder-${match.index}`} className="my-4 whitespace-normal">
                                  <FolderStructureViewer content={match[1]} />
                                </div>
                              );
                              lastIndex = folderRegex.lastIndex;
                            }

                            if (lastIndex < text.length) {
                              parts.push(<span key={`text-last`} dangerouslySetInnerHTML={{ __html: formatText(text.substring(lastIndex)) }} />);
                            }

                            if (fallbackFolder) {
                               parts.push(
                                 <div key="fallback-folder" className="my-4 whitespace-normal">
                                   <FolderStructureViewer content={fallbackFolder.trim()} />
                                 </div>
                               );
                            }

                            return parts;
                          })()}
                        </div>

                        {/* Artifact card */}
                        {msg.file && (
                          <ArtifactCard
                            msg={msg}
                            markdownMode={markdownMode}
                            setMarkdownMode={setMarkdownMode}
                            onModify={
                              msg.role === "assistant" && msg.file.language !== "dbschema" && !isSharedView
                                ? () => {
                                    const target = LANG_TO_ARTIFACT[msg.file!.language] ?? "config";
                                    setModifyMode(true);
                                    setModifyTargetArtifact(target);
                                    textareaRef.current?.focus();
                                  }
                                : undefined
                            }
                          />
                        )}

                        {/* Conversational AI Actions */}
                        {msg.emailPreview && (
                          <EmailPreviewCard
                            email={msg.emailPreview}
                            onSend={(updated) => handleSendEmail(updated, msg.id)}
                            onCancel={() => handleCancelAction(msg.id, 'email')}
                            onRefine={handleRefine}
                            isSending={msg.emailPreview.status === 'sending'}
                          />
                        )}

                        {msg.meetingPreview && (
                          <MeetingPreviewCard
                            meeting={msg.meetingPreview}
                            onSchedule={(updated) => handleScheduleMeeting(updated, msg.id)}
                            onCancel={() => handleCancelAction(msg.id, 'meeting')}
                            onRefine={handleRefine}
                            isScheduling={msg.meetingPreview.status === 'scheduling'}
                          />
                        )}

                        {/* Final Markdown Project Ready Banner & Integrations */}
                        {msg.role === "assistant" && msg.file?.language === "finalmarkdown" && !isSharedView && (
                          <div>
                            <FinalSummaryCard
                              events={liveEvents}
                              githubUrl={msg.githubUrl}
                              notionUrl={msg.notionUrl}
                              jiraUrl={msg.jiraUrl}
                              sessionId={sessionId}
                            />
                          </div>
                        )}

                        {/* Option buttons */}
                        {msg.options && msg.options.length > 0 && msg.role === "assistant" && !isSharedView && (
                          <div className="mt-4">
                            <div className="mb-2 text-[11px] font-medium tracking-wide text-pm-muted uppercase">Next steps</div>
                            <div className="flex flex-wrap gap-2">
                              {msg.options?.map((option, i) => {
                                const isClicked = messages.some(m => m.role === "user" && m.content === option);
                                const isDisabled = isClicked || isTyping;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => handleOptionClick(option)}
                                    className={`group/chip inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors ${
                                      isClicked
                                        ? "border-pm-line bg-transparent text-pm-muted"
                                        : "border-pm-line bg-pm-card text-pm-fg/85 hover:border-pm-primary/40 hover:bg-pm-primary/[0.06] hover:text-pm-accent disabled:opacity-50"
                                    }`}
                                  >
                                    {isClicked ? <Check className="size-3.5" /> : <ArrowRight className="size-3.5 text-pm-muted transition-colors group-hover/chip:text-pm-accent" />}
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        <MessageActions content={msg.content} />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {!isSharedView && (isTyping || isExporting) && (
                <div className="flex gap-3.5">
                  <span className="relative mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-pm-line bg-pm-card text-pm-fg">
                    <LogoMark className="size-[18px] animate-pulse" />
                  </span>
                  <div className="flex min-h-8 items-center">
                    <TypingStatusText artifact={generatingArtifact} isExporting={isExporting} />
                  </div>
                </div>
              )}



              <div ref={messagesEndRef} style={{ height: "40px" }} />
            </div>
          )}
        </div>

        {!isEmptyState && (
          <>
            {/* Fade under the input dock */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40"
              style={{ background: "linear-gradient(to top, var(--pm-card) 45%, color-mix(in oklch, var(--pm-card) 0%, transparent))" }}
            />

            {/* ── Input dock ── */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[11] px-4 pb-5 sm:px-8 sm:pb-6">
              <div className="pointer-events-auto mx-auto w-full max-w-3xl">
                {isSharedView ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-pm-line bg-pm-card p-4 text-[13px] text-pm-muted">
                    <Lock className="size-3.5" />
                    This is a shared ProdMate conversation. Fork this project to continue working on it.
                  </div>
                ) : (
                  <>
                    {modifyMode && modifyTargetArtifact && (
                      <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-pm-primary/25 bg-pm-primary/[0.06] px-3 py-2 text-xs">
                        <span className="size-1.5 shrink-0 rounded-full bg-pm-primary" />
                        <span className="font-medium text-pm-accent">Editing: {modifyTargetArtifact}</span>
                        <span className="flex-1 text-pm-muted">Only this artifact will regenerate</span>
                        <button
                          type="button"
                          onClick={() => {
                            setModifyMode(false);
                            setModifyTargetArtifact(null);
                          }}
                          className="font-medium text-pm-muted transition-colors hover:text-pm-fg"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <InputArea
                      input={input}
                      textareaRef={textareaRef}
                      tokenQuota={tokenQuota}
                      handleInputChange={handleInputChange}
                      handleKeyDown={handleKeyDown}
                      handleSend={handleSend}
                      isTyping={isTyping || isExporting}
                      hasGeneratedConfig={hasGeneratedConfig}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Scroll to bottom */}
        {showScrollDown && !isEmptyState && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="absolute right-8 bottom-32 z-20 grid size-9 place-items-center rounded-full border border-pm-line bg-pm-card text-pm-fg/70 shadow-md transition-colors hover:text-pm-fg"
          >
            <ArrowDown className="size-4" />
          </button>
        )}
      </div>

      {/* ── Context menu ── */}
      {contextMenu?.visible && (
        <div ref={contextMenuRef} style={{ position: "fixed", left: `${contextMenu.x}px`, top: `${contextMenu.y}px`, background: "var(--pm-card)", border: `1px solid ${T.border}`, borderRadius: "12px", padding: "4px", zIndex: 1000, minWidth: "160px", boxShadow: "0 12px 32px -8px rgba(0,0,0,0.18)", fontFamily: T.font }}>
          {[{ label: "Copy", action: () => handleCopyMessage(contextMenu.messageContent), color: T.textMuted },
          ...(contextMenu.messageRole === "user" ? [{ label: "Edit", action: () => handleEditMessage(contextMenu.messageId, contextMenu.messageContent), color: T.textMuted }] : [])
          ].map(item => (
            <button key={item.label} onClick={item.action}
              style={{ width: "100%", padding: "6px 10px", background: "transparent", border: "none", color: item.color, fontSize: "13px", fontFamily: T.font, textAlign: "left", cursor: "pointer", borderRadius: "4px", transition: "background .1s" }}
              onMouseEnter={e => { e.currentTarget.style.background = T.surfaceHover; e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = item.color; }}>
              {item.label}
            </button>
          ))}
          <div style={{ height: "1px", background: T.border, margin: "4px 0" }} />
          <button onClick={() => handleDeleteMessage(contextMenu.messageId)}
            style={{ width: "100%", padding: "6px 10px", background: "transparent", border: "none", color: "var(--pm-danger)", fontSize: "13px", fontFamily: T.font, textAlign: "left", cursor: "pointer", borderRadius: "6px", transition: "background .1s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            Delete
          </button>
        </div>
      )}

      {/* ── Global styles ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        #chat-root, #chat-root * { font-family: var(--font-satoshi), system-ui, -apple-system, sans-serif !important; }
        @keyframes typingDot { 0%,80%,100%{opacity:0.3;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes typingFade { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
