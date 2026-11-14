import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProgressEvent } from "@/lib/pipeline/types";
import { ArrowUpRight, CircleCheck, LoaderCircle, PartyPopper, RefreshCw, TriangleAlert } from "lucide-react";
import { IconBrandGithub, IconBrandJira, IconBrandNotion } from "@tabler/icons-react";
import { cn } from "@/lib/cn";


interface Props {
  events: ProgressEvent[];
  githubUrl?: string;
  notionUrl?: string;
  jiraUrl?: string;
  sessionId?: string;
}

export default function FinalSummaryCard({ events, githubUrl, notionUrl, jiraUrl, sessionId }: Props) {
  const router = useRouter();

  const [integrationData, setIntegrationData] = useState<{
    github: boolean;
    notion: boolean;
    jira: boolean;
    calendar: boolean;
    gmail: boolean;
  }>({ github: false, notion: false, jira: false, calendar: false, gmail: false });

  const [loading, setLoading] = useState<{ github: boolean; notion: boolean; jira: boolean; calendar: boolean; gmail: boolean }>({
    github: false, notion: false, jira: false, calendar: false, gmail: false
  });

  const [urls, setUrls] = useState<{ github?: string; notion?: string; jira?: string; calendar?: string; gmail?: string }>({
    github: githubUrl,
    notion: notionUrl,
    jira: jiraUrl
  });


  const [syncStates, setSyncStates] = useState<any>({});
  
  const loadData = () => {
    Promise.all([
      fetch("/api/integrations").then(res => res.json()).catch(() => ({})),
      fetch("/api/notion/pages").then(res => res.json()).catch(() => ({})),
      sessionId ? fetch(`/api/chat-history?sessionId=${sessionId}`).then(res => res.json()).catch(() => ({})) : Promise.resolve({})
    ]).then(([integrations, notion, chatData]) => {
      setIntegrationData({
        github: !!integrations?.github?.accessToken,
        jira: !!integrations?.jira?.accessToken,
        notion: !!notion?.connected,
        calendar: !!integrations?.googleCalendar?.accessToken,
        gmail: !!integrations?.gmail?.accessToken
      });
      if (chatData) {
        setSyncStates({
          githubExported: chatData.githubExported,
          githubDirty: chatData.githubDirty,
          githubDirtyArtifacts: chatData.githubDirtyArtifacts || [],
          githubUrl: chatData.githubUrl,
          jiraExported: chatData.jiraExported,
          jiraDirty: chatData.jiraDirty,
          jiraDirtyArtifacts: chatData.jiraDirtyArtifacts || [],
          jiraUrl: chatData.jiraUrl,
          notionExported: chatData.notionExported,
          notionDirty: chatData.notionDirty,
          notionDirtyArtifacts: chatData.notionDirtyArtifacts || [],
          notionUrl: chatData.notionUrl,
        });
        setUrls(prev => ({
          ...prev,
          github: chatData.githubUrl || prev.github,
          jira: chatData.jiraUrl || prev.jira,
          notion: chatData.notionUrl || prev.notion,
        }));
      }
    });
  };

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const handleAction = async (platform: 'github' | 'jira' | 'notion' | 'calendar' | 'gmail', extraData?: any) => {
    if (!integrationData[platform]) {
      if (sessionId) {
        sessionStorage.setItem('pendingSyncSessionId', sessionId);
      }
      router.push('/integrations');
      return;
    }

    if (!sessionId) return;

    setLoading(prev => ({ ...prev, [platform]: true }));
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, sessionId, ...extraData })
      });
      const data = await res.json();
      if (data.success) {
        setUrls(prev => ({
          ...prev,
          github: platform === 'github' ? data.exportData?.githubUrl : prev.github,
          jira: platform === 'jira' ? data.exportData?.jiraUrl : prev.jira,
          notion: platform === 'notion' ? data.exportData?.notionUrl : prev.notion,
          calendar: platform === 'calendar' ? data.calendarUrl : prev.calendar,
          gmail: platform === 'gmail' ? data.draftUrl : prev.gmail,
        }));
        // Refresh sync states
        loadData();
      } else {
        console.error(data.error);
        alert(`Failed to export to ${platform}: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert(`An error occurred while exporting to ${platform}`);
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handleUpdateAll = async () => {
    const dirtyPlatforms: ('github' | 'jira' | 'notion' | 'calendar' | 'gmail')[] = [];
    if (syncStates.githubDirty && integrationData.github) dirtyPlatforms.push('github');
    if (syncStates.jiraDirty && integrationData.jira) dirtyPlatforms.push('jira');
    if (syncStates.notionDirty && integrationData.notion) dirtyPlatforms.push('notion');

    for (const platform of dirtyPlatforms) {
      await handleAction(platform);
    }
  };

  const PLATFORMS = [
    { id: "github" as const, label: "GitHub", desc: "Repository with docs and folder structure", Icon: IconBrandGithub },
    { id: "jira" as const, label: "Jira", desc: "Epics and tickets from your user stories", Icon: IconBrandJira },
    { id: "notion" as const, label: "Notion", desc: "Every document as a Notion page", Icon: IconBrandNotion },
  ];

  const anyLoading = Object.values(loading).some(Boolean);
  const anyDirty =
    (syncStates.githubDirty && integrationData.github) ||
    (syncStates.jiraDirty && integrationData.jira) ||
    (syncStates.notionDirty && integrationData.notion);

  const renderTile = ({ id, label, desc, Icon }: (typeof PLATFORMS)[number]) => {
    const connected = integrationData[id];
    const isExported = syncStates[`${id}Exported`];
    const isDirty = syncStates[`${id}Dirty`];
    const dirtyArtifacts: string[] = syncStates[`${id}DirtyArtifacts`] || [];
    const url = urls[id];
    const busy = loading[id];

    let status: React.ReactNode;
    let action: React.ReactNode;

    if (!connected) {
      status = <span className="text-pm-muted">Not connected</span>;
      action = (
        <button type="button" onClick={() => handleAction(id)} className={btn("outline")}>
          Connect
        </button>
      );
    } else if (isExported && isDirty) {
      status = (
        <span className="flex items-center gap-1 text-pm-amber" title={dirtyArtifacts.length ? `Changed: ${dirtyArtifacts.join(", ")}` : undefined}>
          <TriangleAlert className="size-3" />
          {dirtyArtifacts.length || "Some"} {dirtyArtifacts.length === 1 ? "change" : "changes"} to sync
        </span>
      );
      action = (
        <button type="button" onClick={() => handleAction(id)} disabled={busy} className={btn("primary")}>
          {busy ? <LoaderCircle className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
          {busy ? "Updating" : "Update"}
        </button>
      );
    } else if (isExported) {
      status = (
        <span className="flex items-center gap-1 text-pm-green">
          <CircleCheck className="size-3" />
          Synced
        </span>
      );
      action = url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className={btn("outline")}>
          Open
          <ArrowUpRight className="size-3.5" />
        </a>
      ) : null;
    } else {
      status = <span className="text-pm-muted">Ready to export</span>;
      action = (
        <button type="button" onClick={() => handleAction(id)} disabled={busy} className={btn("dark")}>
          {busy && <LoaderCircle className="size-3.5 animate-spin" />}
          {busy ? "Exporting" : "Export"}
        </button>
      );
    }

    return (
      <div key={id} className="flex flex-col rounded-xl border border-pm-line bg-pm-card p-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-pm-shell text-pm-fg">
            <Icon size={17} stroke={1.75} />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-pm-fg">{label}</div>
            <div className="text-[11.5px]">{status}</div>
          </div>
        </div>
        <p className="mt-2.5 flex-1 text-xs leading-relaxed text-pm-muted">{desc}</p>
        <div className="mt-3">{action}</div>
      </div>
    );
  };

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-pm-primary/25 bg-gradient-to-b from-pm-primary/[0.06] to-transparent">
      <div className="flex flex-wrap items-center gap-3 px-4 pt-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-pm-primary text-white">
          <PartyPopper className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold tracking-tight text-pm-fg">Your plan is ready</div>
          <div className="text-xs text-pm-muted">Send it to your tools, or keep refining it in the chat.</div>
        </div>
        {anyDirty && (
          <button type="button" onClick={handleUpdateAll} disabled={anyLoading} className={btn("primary")}>
            {anyLoading ? <LoaderCircle className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            {anyLoading ? "Updating" : "Update all"}
          </button>
        )}
      </div>
      <div className="grid gap-2.5 p-4 sm:grid-cols-3">{PLATFORMS.map(renderTile)}</div>
    </div>
  );
}

function btn(kind: "primary" | "dark" | "outline") {
  return cn(
    "inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition-[background-color,border-color,opacity] disabled:opacity-60",
    kind === "primary" && "bg-pm-primary text-white hover:bg-pm-primary/85",
    kind === "dark" && "bg-pm-fg text-pm-bg hover:bg-pm-fg/85",
    kind === "outline" && "border border-pm-line bg-pm-card text-pm-fg hover:border-pm-line-strong",
  );
}