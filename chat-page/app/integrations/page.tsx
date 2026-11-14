"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, ChevronDown, CircleAlert, Plug, RefreshCw, TriangleAlert, X } from "lucide-react";
import AppShell, { BackButton, Crumb, PageHeading, TopBar } from "../chat/components/AppShell";
import { Button, Card, IconButton, Modal } from "../chat/components/ui";
import { cn } from "@/lib/cn";
import { useSmoothScroll } from "@/lib/use-smooth-scroll";

const LOGO_DEV_PUBLIC_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_KEY || "pk_dNdWcUuQT6e3A-6SxXGIYw";

function CompanyLogo({ domain, dimmed, logoUrl }: { domain: string; dimmed?: boolean; logoUrl?: string }) {
  return (
    <div
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl border border-pm-line bg-white p-2 transition-[filter,opacity] duration-300",
        dimmed && "opacity-60 grayscale",
      )}
    >
      <Image
        src={logoUrl || `https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}`}
        alt={`${domain} logo`}
        width={32}
        height={32}
        className="object-contain"
      />
    </div>
  );
}

// ─── Dropdown (a styled replacement for the native <select>) ─────────────────

function CustomSelect({
  value,
  options,
  onChange,
  disabled,
  placeholder,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const close = () => setIsOpen(false);
    if (isOpen) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [isOpen]);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-48" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border bg-pm-card px-3 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          isOpen ? "border-pm-primary/50" : "border-pm-line hover:border-pm-line-strong",
          selected ? "text-pm-fg" : "text-pm-muted",
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-pm-muted transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-xl border border-pm-line bg-pm-card p-1 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)]">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-[13px] text-pm-muted">No options available</div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full rounded-md px-3 py-2 text-left text-[13px] transition-colors",
                  opt.value === value ? "bg-pm-shell font-medium text-pm-fg" : "text-pm-fg/75 hover:bg-pm-shell hover:text-pm-fg",
                )}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

type Category = "All" | "Workspace" | "Development" | "Project Management" | "Productivity" | "Communication" | "Automation";

interface Integration {
  id: string;
  name: string;
  category: Category;
  description: string;
  domain: string;
  connected: boolean;
  logoUrl?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "notion",
    name: "Notion",
    category: "Workspace",
    description: "Export your PRDs, user stories and architecture specs straight to your Notion workspace.",
    domain: "notion.so",
    connected: false,
  },
  {
    id: "github",
    name: "GitHub",
    category: "Development",
    description: "Create a repository from your plan, with the folder structure and docs in place.",
    domain: "github.com",
    connected: false,
  },
  {
    id: "jira",
    name: "Jira",
    category: "Project Management",
    description: "Turn generated user stories into Jira tickets automatically.",
    domain: "jira.com",
    connected: false,
  },
  {
    id: "calendar",
    name: "Google Calendar",
    category: "Automation",
    description: "Schedule review meetings and project milestones from the chat.",
    domain: "calendar.google.com",
    connected: false,
    logoUrl: "https://cloud.gmelius.com/public/logos/google/Google_Calendar_Logo_512px.png",
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Automation",
    description: "Draft and send project updates to stakeholders from the chat.",
    domain: "gmail.com",
    connected: false,
    logoUrl: "/Gmail_Logo_512px.png",
  },
];

const CATEGORIES: Category[] = ["All", "Workspace", "Development", "Project Management", "Automation"];
const OAUTH_IDS = ["notion", "github", "jira", "calendar", "gmail"];

const SETTINGS_TITLE: Record<string, string> = {
  notion: "Notion settings",
  github: "GitHub settings",
  jira: "Jira settings",
  calendar: "Google Calendar settings",
  gmail: "Gmail settings",
};

// ─── Card ────────────────────────────────────────────────────────────────────

function Switch({ on, onClick, label }: { on: boolean; onClick: (e: React.MouseEvent) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", on ? "bg-pm-primary" : "bg-pm-line-strong")}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-[var(--ease-pm)]",
          on && "translate-x-4",
        )}
      />
    </button>
  );
}

function IntegrationCard({
  integration,
  onConnect,
  onConfigure,
  onToggleActive,
}: {
  integration: Integration;
  onConnect?: (e: React.MouseEvent) => void;
  onConfigure?: (e: React.MouseEvent) => void;
  onToggleActive?: (id: string, e: React.MouseEvent) => void;
}) {
  const act = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (integration.connected && onConfigure) onConfigure(e);
    else if (!integration.connected && onConnect) onConnect(e);
    else if (onToggleActive) onToggleActive(integration.id, e);
  };

  return (
    <Card className="flex flex-col p-5 transition-[border-color,box-shadow] duration-200 hover:border-pm-line-strong hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo domain={integration.domain} dimmed={!integration.connected} logoUrl={integration.logoUrl} />
        <span
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium",
            integration.connected ? "bg-emerald-500/10 text-emerald-600" : "bg-pm-shell text-pm-muted",
          )}
        >
          <span className={cn("size-1.5 rounded-full", integration.connected ? "bg-emerald-500" : "bg-pm-muted/60")} />
          {integration.connected ? "Connected" : "Not connected"}
        </span>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="text-[15px] font-semibold tracking-tight">{integration.name}</h3>
        <div className="mt-0.5 text-xs text-pm-muted">{integration.category}</div>
        <p className="mt-3 text-sm leading-relaxed text-pm-fg/70">{integration.description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-pm-line pt-4">
        <Button variant={integration.connected ? "outline" : "dark"} size="sm" onClick={act}>
          {integration.connected ? "Configure" : "Connect"}
        </Button>
        <Switch on={integration.connected} onClick={act} label={`${integration.name} connection`} />
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="animate-pulse p-5">
      <div className="flex justify-between">
        <div className="size-12 rounded-xl bg-pm-shell" />
        <div className="h-6 w-24 rounded-full bg-pm-shell" />
      </div>
      <div className="mt-4 h-4 w-28 rounded bg-pm-shell" />
      <div className="mt-4 h-3 w-full rounded bg-pm-shell" />
      <div className="mt-2 h-3 w-4/5 rounded bg-pm-shell" />
      <div className="mt-5 flex justify-between border-t border-pm-line pt-4">
        <div className="h-8 w-24 rounded-full bg-pm-shell" />
        <div className="h-5 w-9 rounded-full bg-pm-shell" />
      </div>
    </Card>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[13px] whitespace-nowrap text-pm-muted">{label}</span>
      <div className="flex min-w-0 items-center gap-2 text-[13px] font-medium">{children}</div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  return (
    <AppShell>
      <IntegrationsContent />
    </AppShell>
  );
}

function IntegrationsContent() {
  const { isLoaded: authLoaded, isSignedIn } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);
  useSmoothScroll(scrollRef);
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);

  const [notionData, setNotionData] = useState<{ connected: boolean; workspaceName?: string; pages?: { id: string; title: string }[]; defaultParentPageId?: string } | null>(null);
  const [githubData, setGithubData] = useState<{ connected: boolean; username?: string; avatarUrl?: string; repoVisibility?: string } | null>(null);
  const [jiraData, setJiraData] = useState<{ connected: boolean; workspaceName?: string; accountName?: string; projectPreference?: string } | null>(null);
  const [googleCalendarData, setGoogleCalendarData] = useState<{ connected: boolean; email?: string } | null>(null);
  const [gmailData, setGmailData] = useState<{ connected: boolean; email?: string } | null>(null);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);
  const [selectedPage, setSelectedPage] = useState("");
  const [githubVisibility, setGithubVisibility] = useState("private");
  const [jiraPreference, setJiraPreference] = useState("CREATE_NEW");

  const [savingPage, setSavingPage] = useState(false);
  const [savingGithub, setSavingGithub] = useState(false);
  const [savingJira, setSavingJira] = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState(false);

  const fetchData = () => {
    setLoadingIntegrations(true);
    setError(false);
    return Promise.all([
      fetch("/api/notion/pages").then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      fetch("/api/integrations").then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
    ])
      .then(([notionPages, all]) => {
        setNotionData(notionPages);
        if (notionPages.defaultParentPageId) setSelectedPage(notionPages.defaultParentPageId);

        setGithubData(all.github ? { ...all.github, connected: !!all.github.accessToken } : { connected: false });
        if (all.github?.repoVisibility) setGithubVisibility(all.github.repoVisibility);

        setJiraData(all.jira ? { ...all.jira, connected: !!all.jira.accessToken } : { connected: false });
        if (all.jira?.projectPreference) setJiraPreference(all.jira.projectPreference);

        setGoogleCalendarData(all.googleCalendar ? { ...all.googleCalendar, connected: !!all.googleCalendar.accessToken } : { connected: false });
        setGmailData(all.gmail ? { ...all.gmail, connected: !!all.gmail.accessToken } : { connected: false });

        setIntegrations(
          INTEGRATIONS.map((i) => {
            if (i.id === "notion") return { ...i, connected: !!notionPages.connected };
            if (i.id === "github") return { ...i, connected: !!all.github?.accessToken };
            if (i.id === "jira") return { ...i, connected: !!all.jira?.accessToken };
            if (i.id === "calendar") return { ...i, connected: !!all.googleCalendar?.accessToken };
            if (i.id === "gmail") return { ...i, connected: !!all.gmail?.accessToken };
            return i;
          }),
        );
        setLoadingIntegrations(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoadingIntegrations(false);
      });
  };

  // The chat this visit came from (set by "Connect" on a project), so we can send the user back.
  const [returnSessionId, setReturnSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Signed-out visitors get a sign-in prompt instead of a failed fetch.
    if (!authLoaded) return;
    if (!isSignedIn) {
      setLoadingIntegrations(false);
      return;
    }
    const pending = sessionStorage.getItem("pendingSyncSessionId");
    // Only bounce back after an OAuth round-trip that this page started and that didn't fail.
    // Before, arriving from a chat redirected straight away, so the page flashed and closed.
    const returningFromOAuth = sessionStorage.getItem("pmOAuthStarted") === "1";
    const failed = Array.from(new URLSearchParams(window.location.search).keys()).some((k) => k.endsWith("_error"));
    sessionStorage.removeItem("pmOAuthStarted");

    fetchData().then(() => {
      if (!pending) return;
      if (returningFromOAuth && !failed) {
        sessionStorage.removeItem("pendingSyncSessionId");
        router.push(`/chat/${pending}`);
      } else {
        setReturnSessionId(pending);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoaded, isSignedIn]);

  const handleSavePage = async (pageId: string) => {
    setSelectedPage(pageId);
    setSavingPage(true);
    try {
      await fetch("/api/notion/parent-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPage(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    setDisconnecting(id);
    try {
      if (id === "notion") {
        await fetch("/api/notion/disconnect", { method: "DELETE" });
        setNotionData({ connected: false });
      } else if (id === "github") {
        await fetch("/api/github/disconnect", { method: "DELETE" });
        setGithubData({ connected: false });
      } else if (id === "jira") {
        await fetch("/api/jira/disconnect", { method: "DELETE" });
        setJiraData({ connected: false });
      } else if (id === "calendar") {
        await fetch("/api/google-calendar/disconnect", { method: "DELETE" });
      } else if (id === "gmail") {
        await fetch("/api/gmail/disconnect", { method: "DELETE" });
      }
      setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: false } : i)));
      setShowSettings((p) => ({ ...p, [id]: false }));
    } catch (e) {
      console.error(e);
    } finally {
      setDisconnecting(null);
    }
  };

  const handleGithubVisibility = async (visibility: string) => {
    setGithubVisibility(visibility);
    setSavingGithub(true);
    try {
      await fetch("/api/github/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoVisibility: visibility }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingGithub(false);
    }
  };

  const handleJiraPreference = async (pref: string) => {
    setJiraPreference(pref);
    setSavingJira(true);
    try {
      await fetch("/api/jira/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectPreference: pref }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingJira(false);
    }
  };

  const handleConnect = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const routeId = id === "calendar" ? "google-calendar" : id;
    sessionStorage.setItem("pmOAuthStarted", "1");
    window.location.assign(`/api/${routeId}/connect`);
  };

  const handleConfigure = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSettings((p) => ({ ...p, [id]: !p[id] }));
  };

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i)));
  };

  const filtered = integrations.filter((i) => activeCategory === "All" || i.category === activeCategory);
  const connectedCount = integrations.filter((i) => i.connected).length;
  const openSettingsId = Object.keys(showSettings).find((k) => showSettings[k]);

  const disconnectButton = (id: string, name: string) => (
    <div className="mt-2 flex justify-end border-t border-pm-line pt-4">
      <Button variant="danger" size="sm" onClick={() => handleDisconnect(id)} disabled={disconnecting === id}>
        {disconnecting === id ? "Disconnecting…" : `Disconnect ${name}`}
      </Button>
    </div>
  );

  return (
    <>
      <TopBar
        left={
          <>
            <BackButton />
            <Crumb icon={<Plug />}>Integrations</Crumb>
          </>
        }
        right={
          returnSessionId ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem("pendingSyncSessionId");
                router.push(`/chat/${returnSessionId}`);
              }}
            >
              <ArrowLeft />
              Back to project
            </Button>
          ) : null
        }
      />

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-5 pt-4 pb-20 sm:px-8">
          <PageHeading
            title="Integrations"
            description="Connect ProdMate to the tools your team already uses, and send plans and docs straight to them."
            action={
              !loadingIntegrations && isSignedIn && !error && (
                <span className="text-sm text-pm-muted">
                  <span className="font-semibold text-pm-fg tabular-nums">{connectedCount}</span> of {integrations.length} connected
                </span>
              )
            }
          />

          {!error && isSignedIn && (
            <div className="mt-8 flex flex-wrap gap-1 rounded-xl border border-pm-line bg-pm-shell/60 p-1 sm:inline-flex">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "h-8 rounded-lg px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors",
                    activeCategory === category
                      ? "bg-pm-card text-pm-fg shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_var(--pm-line)]"
                      : "text-pm-muted hover:text-pm-fg",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {authLoaded && !isSignedIn ? (
            <Card className="mt-8 flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="text-sm font-semibold">Sign in to connect your tools</div>
                <p className="mt-0.5 text-[13px] text-pm-muted">Your Notion, GitHub, Jira, Calendar and Gmail connections are saved to your account.</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => router.push("/login")}>
                Log in
              </Button>
            </Card>
          ) : error ? (
            <Card className="mt-8 flex flex-wrap items-center justify-between gap-4 border-pm-danger/30 p-5">
              <div className="flex items-center gap-3 text-sm text-pm-danger">
                <CircleAlert className="size-5" />
                Couldn&apos;t load your integrations.
              </div>
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw />
                Retry
              </Button>
            </Card>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loadingIntegrations
                ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
                : filtered.map((integration, i) => (
                    <div key={integration.id} className="fade-up" style={{ "--delay": `${i * 0.04}s`, "--rise": "8px" } as React.CSSProperties}>
                      <IntegrationCard
                        integration={integration}
                        onConnect={OAUTH_IDS.includes(integration.id) ? (e) => handleConnect(integration.id, e) : undefined}
                        onConfigure={OAUTH_IDS.includes(integration.id) ? (e) => handleConfigure(integration.id, e) : undefined}
                        onToggleActive={!OAUTH_IDS.includes(integration.id) ? (id, e) => handleToggleActive(id, e) : undefined}
                      />
                    </div>
                  ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings for a connected integration */}
      {openSettingsId && (
        <Modal onClose={() => setShowSettings({})} labelledBy="integration-settings-title">
          <IconButton onClick={() => setShowSettings({})} title="Close" className="absolute top-4 right-4">
            <X />
          </IconButton>
          <h2 id="integration-settings-title" className="mb-6 text-base font-semibold tracking-tight">
            {SETTINGS_TITLE[openSettingsId] ?? "Settings"}
          </h2>

          {showSettings["notion"] && notionData?.connected && (
            <div className="flex flex-col gap-4">
              <SettingRow label="Workspace">{notionData.workspaceName}</SettingRow>
              <SettingRow label="Parent page">
                <CustomSelect
                  value={selectedPage}
                  onChange={handleSavePage}
                  disabled={savingPage}
                  placeholder="Select a page…"
                  options={notionData.pages?.map((p) => ({ label: p.title, value: p.id })) || []}
                />
              </SettingRow>
              {!selectedPage && (
                <p className="flex items-center justify-end gap-1.5 text-xs text-amber-600">
                  <TriangleAlert className="size-3.5" />
                  Pick a page to turn on exports.
                </p>
              )}
              {disconnectButton("notion", "Notion")}
            </div>
          )}

          {showSettings["github"] && githubData?.connected && (
            <div className="flex flex-col gap-4">
              <SettingRow label="Account">
                {githubData.avatarUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={githubData.avatarUrl} alt="" width={20} height={20} className="rounded-full" />
                )}
                <span className="truncate">{githubData.username}</span>
              </SettingRow>
              <SettingRow label="Repo visibility">
                <CustomSelect
                  value={githubVisibility}
                  onChange={handleGithubVisibility}
                  disabled={savingGithub}
                  options={[
                    { label: "Private (recommended)", value: "private" },
                    { label: "Public", value: "public" },
                  ]}
                />
              </SettingRow>
              {disconnectButton("github", "GitHub")}
            </div>
          )}

          {showSettings["jira"] && jiraData?.connected && (
            <div className="flex flex-col gap-4">
              <SettingRow label="Workspace">{jiraData.workspaceName}</SettingRow>
              <SettingRow label="Account">{jiraData.accountName}</SettingRow>
              <SettingRow label="Project">
                <CustomSelect
                  value={jiraPreference}
                  onChange={handleJiraPreference}
                  disabled={savingJira}
                  options={[
                    { label: "Create new project", value: "CREATE_NEW" },
                    { label: "Select existing", value: "SELECT_EXISTING" },
                  ]}
                />
              </SettingRow>
              {disconnectButton("jira", "Jira")}
            </div>
          )}

          {showSettings["calendar"] && googleCalendarData?.connected && (
            <div className="flex flex-col gap-4">
              <SettingRow label="Account">{googleCalendarData.email}</SettingRow>
              {disconnectButton("calendar", "Google Calendar")}
            </div>
          )}

          {showSettings["gmail"] && gmailData?.connected && (
            <div className="flex flex-col gap-4">
              <SettingRow label="Account">{gmailData.email}</SettingRow>
              {disconnectButton("gmail", "Gmail")}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
