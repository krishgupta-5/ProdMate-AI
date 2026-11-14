"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  ChevronDown,
  ChevronsUpDown,
  CircleQuestionMark,
  CreditCard,
  Ellipsis,
  LogIn,
  LogOut,
  MessageSquare,
  Pin,
  Plug,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import ShareDialog from "./ShareDialog";
import { LogoMark } from "./Logo";
import { Button, Eyebrow, IconButton, Kbd, Modal } from "./ui";
import { useNewProject } from "./useNewProject";
import { cn } from "@/lib/cn";

import { LANDING_URL } from "@/lib/site";
const COLLAPSED_WIDTH = 64;

interface SidebarProps {
  activeSessionId?: string;
  isOpen: boolean;
  onToggle: () => void;
  width: number;
  isResizing?: boolean;
  onResizeStart?: (e: React.PointerEvent) => void;
  onShowLoginModal?: (show: boolean) => void;
}

interface SessionSummary {
  sessionId: string;
  updatedAt: Date | string;
  messageCount: number;
  lastMessage?: string;
  isShared?: boolean;
  shareId?: string;
}

/** Last chat list, kept across client-side navigations (each page mounts its own sidebar). */
let sessionsCache: SessionSummary[] | null = null;

const sessionTitle = (s: SessionSummary) => s.lastMessage || `Session · ${s.messageCount} messages`;

// ─────────────────────────────────────────────────────────────────────────────
// Small pieces
// ─────────────────────────────────────────────────────────────────────────────

function NavItem({
  icon,
  label,
  href,
  onClick,
  active,
  collapsed,
  external,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  collapsed: boolean;
  external?: boolean;
  trailing?: React.ReactNode;
}) {
  const className = cn(
    "group flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40 [&>svg]:size-4 [&>svg]:shrink-0",
    collapsed && "justify-center px-0",
    active ? "bg-pm-fg text-pm-bg shadow-sm" : "text-pm-fg/75 hover:bg-pm-card hover:text-pm-fg",
  );
  const content = (
    <>
      {icon}
      {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{label}</span>}
      {!collapsed && trailing}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        title={collapsed ? label : undefined}
        aria-current={active ? "page" : undefined}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} title={collapsed ? label : undefined}>
      {content}
    </button>
  );
}

function HistoryItem({
  session,
  active,
  pinned,
  onOpen,
  onTogglePin,
  onMenu,
}: {
  session: SessionSummary;
  active: boolean;
  pinned: boolean;
  onOpen: () => void;
  onTogglePin: () => void;
  onMenu: (e: React.MouseEvent) => void;
}) {
  const title = sessionTitle(session);
  return (
    <div
      className={cn(
        "group relative flex h-8 items-center rounded-lg transition-colors",
        active ? "bg-pm-card shadow-[0_0_0_1px_var(--pm-line)]" : "hover:bg-pm-card",
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        onMenu(e);
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        title={title}
        className={cn(
          "flex h-full min-w-0 flex-1 items-center gap-2.5 rounded-lg pr-1 pl-2.5 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40",
          active ? "font-medium text-pm-fg" : "text-pm-fg/70 group-hover:text-pm-fg",
        )}
      >
        <MessageSquare className={cn("size-3.5 shrink-0", active ? "text-pm-accent" : "text-pm-muted")} />
        <span className="truncate">{title}</span>
      </button>
      <div
        className={cn(
          "flex shrink-0 items-center pr-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
          pinned && "opacity-100",
        )}
      >
        <button
          type="button"
          onClick={onTogglePin}
          title={pinned ? "Unpin" : "Pin"}
          className={cn(
            "grid size-6 place-items-center rounded-md hover:bg-pm-shell",
            pinned ? "text-pm-accent" : "text-pm-muted hover:text-pm-fg",
          )}
        >
          <Pin className="size-3.5" fill={pinned ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={onMenu}
          title="More"
          className="grid size-6 place-items-center rounded-md text-pm-muted opacity-0 group-hover:opacity-100 hover:bg-pm-shell hover:text-pm-fg focus-visible:opacity-100"
        >
          <Ellipsis className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function HistoryGroup({
  label,
  collapsed,
  onToggle,
  children,
}: {
  label: string;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={onToggle}
        className="mb-1 flex w-full items-center justify-between rounded-md px-2.5 py-1 text-left outline-none hover:bg-pm-card/60 focus-visible:ring-2 focus-visible:ring-pm-accent/40"
      >
        <Eyebrow>{label}</Eyebrow>
        <ChevronDown className={cn("size-3.5 text-pm-muted transition-transform", collapsed && "-rotate-90")} />
      </button>
      {!collapsed && <div className="flex flex-col gap-0.5">{children}</div>}
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  danger,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-left text-[13px] font-medium transition-colors [&_svg]:size-3.5",
        danger ? "text-pm-danger hover:bg-pm-danger/10" : "text-pm-fg/80 hover:bg-pm-shell hover:text-pm-fg",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

const menuSurface =
  "rounded-xl border border-pm-line bg-pm-card p-1 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 duration-100";

function RenameModal({ currentTitle, onSave, onCancel }: { currentTitle: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState(currentTitle || "");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);
  return (
    <Modal onClose={onCancel} labelledBy="rename-title">
      <h2 id="rename-title" className="text-base font-semibold tracking-tight">
        Rename project
      </h2>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSave(value)}
        className="mt-4 h-10 w-full rounded-lg border border-pm-line bg-pm-card px-3 text-sm outline-none transition-colors focus:border-pm-accent/50 focus:ring-3 focus:ring-pm-primary/15"
      />
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onSave(value)}>
          Save
        </Button>
      </div>
    </Modal>
  );
}

function SearchModal({
  sessions,
  onClose,
  onNavigate,
}: {
  sessions: SessionSummary[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => sessionTitle(s).toLowerCase().includes(q) || s.sessionId.toLowerCase().includes(q));
  }, [sessions, query]);

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px] animate-in fade-in duration-150"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-label="Search projects"
        className="flex max-h-[60vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-pm-line bg-pm-card shadow-[0_24px_64px_-16px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 duration-150"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-pm-line px-4">
          <Search className="size-4 text-pm-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="h-12 flex-1 bg-transparent text-[15px] outline-none placeholder:text-pm-muted"
          />
          <Kbd>Esc</Kbd>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-pm-muted">No projects found.</div>
          ) : (
            filtered.map((s) => (
              <button
                key={s.sessionId}
                type="button"
                onClick={() => {
                  onNavigate(s.sessionId);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-pm-shell"
              >
                <MessageSquare className="size-4 shrink-0 text-pm-muted" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{sessionTitle(s)}</span>
                <span className="shrink-0 text-xs text-pm-muted">{new Date(s.updatedAt).toLocaleDateString()}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center">
      <div className="rounded-full bg-pm-fg px-4 py-2 text-[13px] font-medium text-pm-bg shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
        {message}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────

export default function Sidebar({
  activeSessionId,
  isOpen,
  onToggle,
  width,
  isResizing,
  onResizeStart,
  onShowLoginModal,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useUser();
  const handleNewProject = useNewProject(onShowLoginModal);
  const collapsed = !isOpen;

  // Cached identity, so the profile card doesn't flash empty while Clerk loads.
  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);
  const [cachedDisplayName, setCachedDisplayName] = useState<string>("User");
  const [cachedEmail, setCachedEmail] = useState<string | null>(null);
  const [pinnedSessions, setPinnedSessions] = useState<string[]>([]);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(() => {
    const img = localStorage.getItem("ProdMate-user-image");
    if (img) setCachedImageUrl(img);
    const name = localStorage.getItem("ProdMate-user-name");
    if (name) setCachedDisplayName(name);
    const email = localStorage.getItem("ProdMate-user-email");
    if (email) setCachedEmail(email);
    try {
      const p = localStorage.getItem("ProdMate-pinned-sessions");
      if (p) setPinnedSessions(JSON.parse(p));
    } catch {}
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      localStorage.removeItem("ProdMate-user-image");
      localStorage.removeItem("ProdMate-user-name");
      localStorage.removeItem("ProdMate-user-email");
      setCachedImageUrl(null);
      setCachedDisplayName("User");
      setCachedEmail(null);
    } else if (user) {
      if (user.imageUrl) {
        setCachedImageUrl(user.imageUrl);
        localStorage.setItem("ProdMate-user-image", user.imageUrl);
      }
      if (user.firstName || user.primaryEmailAddress?.emailAddress) {
        const name = user.firstName
          ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
          : (user.primaryEmailAddress?.emailAddress ?? "User");
        setCachedDisplayName(name);
        localStorage.setItem("ProdMate-user-name", name);
      }
      if (user.primaryEmailAddress?.emailAddress) {
        setCachedEmail(user.primaryEmailAddress.emailAddress);
        localStorage.setItem("ProdMate-user-email", user.primaryEmailAddress.emailAddress);
      }
    }
  }, [user, isLoaded, isSignedIn]);

  // Start from the list fetched on the previous page, so opening a chat doesn't blank the sidebar.
  const [sessions, setSessionsState] = useState<SessionSummary[]>(() => sessionsCache ?? []);
  const setSessions: React.Dispatch<React.SetStateAction<SessionSummary[]>> = (next) =>
    setSessionsState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      sessionsCache = value;
      return value;
    });
  const [loading, setLoading] = useState(false);
  const [renameModal, setRenameModal] = useState<{ sessionId: string; currentTitle: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; sessionId: string; title: string } | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPinnedCollapsed, setIsPinnedCollapsed] = useState(false);
  const [isRecentCollapsed, setIsRecentCollapsed] = useState(false);
  const [shareDialog, setShareDialog] = useState<{ sessionId: string; title?: string; shareUrl?: string; shareId?: string; loading?: boolean } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const showIdentity = isSignedIn || cachedDisplayName !== "User";
  const initials = cachedDisplayName !== "User" ? cachedDisplayName.charAt(0).toUpperCase() : "U";

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/sessions", { credentials: "include", cache: "no-store" });
      if (r.ok) setSessions((await r.json()).sessions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) fetchSessions();
    const onRefresh = () => {
      if (isSignedIn) fetchSessions();
    };
    window.addEventListener("refresh-sessions", onRefresh);
    return () => window.removeEventListener("refresh-sessions", onRefresh);
  }, [isOpen, isSignedIn]);

  // Close menus on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) setContextMenu(null);
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // ⌘K / Ctrl+K opens project search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [isMac, setIsMac] = useState(false);
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  const openMenu = (e: React.MouseEvent, s: SessionSummary) => {
    e.preventDefault();
    e.stopPropagation();
    const x = Math.min(e.clientX, window.innerWidth - 184);
    const y = Math.min(e.clientY, window.innerHeight - 160);
    setContextMenu({ x, y, sessionId: s.sessionId, title: sessionTitle(s) });
  };

  const handleTogglePin = (id: string) => {
    setPinnedSessions((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      localStorage.setItem("ProdMate-pinned-sessions", JSON.stringify(next));
      return next;
    });
    setContextMenu(null);
  };

  const handleDelete = async (id: string) => {
    setContextMenu(null);
    try {
      const r = await fetch(`/api/sessions/${id}`, { method: "DELETE", credentials: "include" });
      if (r.ok) {
        setSessions((p) => p.filter((s) => s.sessionId !== id));
        setToast("Project deleted");
      } else setToast("Delete failed");
    } catch {
      setToast("Delete failed");
    }
  };

  const handleRenameSave = async (id: string, newTitle: string) => {
    try {
      const r = await fetch(`/api/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
        credentials: "include",
      });
      if (r.ok) {
        setSessions((p) => p.map((s) => (s.sessionId === id ? { ...s, lastMessage: newTitle } : s)));
        setToast("Project renamed");
      } else setToast("Rename failed");
    } catch {
      setToast("Rename failed");
    }
    setRenameModal(null);
  };

  const handleShare = async (sessionId: string, title?: string) => {
    setContextMenu(null);
    setShareDialog({ sessionId, title, loading: true });
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error("Failed to share");
      const data = await res.json();
      const shareUrl = `${window.location.origin}${data.shareUrl}`;
      navigator.clipboard.writeText(shareUrl);
      setShareDialog({ sessionId, title, shareUrl, shareId: data.shareId, loading: false });
      setToast("Share link copied");
      setSessions((p) => p.map((s) => (s.sessionId === sessionId ? { ...s, isShared: true, shareId: data.shareId } : s)));
    } catch (e) {
      console.error(e);
      setToast("Failed to create share link");
      setShareDialog(null);
    }
  };

  const handleDeleteShare = async (shareId: string, sessionId: string) => {
    try {
      const res = await fetch(`/api/share/${shareId}/delete`, { method: "POST" });
      if (res.ok) {
        setToast("Share deleted");
        setShareDialog(null);
        setSessions((p) => p.map((s) => (s.sessionId === sessionId ? { ...s, isShared: false, shareId: undefined } : s)));
      } else setToast("Failed to delete share");
    } catch {
      setToast("Failed to delete share");
    }
  };

  const { pinnedList, recentList } = useMemo(
    () => ({
      pinnedList: sessions.filter((s) => pinnedSessions.includes(s.sessionId)),
      recentList: sessions.filter((s) => !pinnedSessions.includes(s.sessionId)),
    }),
    [sessions, pinnedSessions],
  );

  const isHome = pathname === "/";

  const renderItems = (list: SessionSummary[]) =>
    list.map((s) => (
      <HistoryItem
        key={s.sessionId}
        session={s}
        active={activeSessionId === s.sessionId}
        pinned={pinnedSessions.includes(s.sessionId)}
        onOpen={() => router.push(`/chat/${s.sessionId}`)}
        onTogglePin={() => handleTogglePin(s.sessionId)}
        onMenu={(e) => openMenu(e, s)}
      />
    ));

  return (
    <>
      {renameModal && (
        <RenameModal
          currentTitle={renameModal.currentTitle}
          onSave={(v) => handleRenameSave(renameModal.sessionId, v)}
          onCancel={() => setRenameModal(null)}
        />
      )}
      {isSearchOpen && (
        <SearchModal sessions={sessions} onClose={() => setIsSearchOpen(false)} onNavigate={(id) => router.push(`/chat/${id}`)} />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {shareDialog && (
        <ShareDialog
          {...shareDialog}
          onClose={() => setShareDialog(null)}
          onDelete={handleDeleteShare}
          onCopy={() => setToast("Share link copied")}
        />
      )}

      {contextMenu && (
        <div ref={contextMenuRef} className={cn(menuSurface, "fixed z-[5000] w-44")} style={{ left: contextMenu.x, top: contextMenu.y }}>
          <MenuItem onClick={() => handleTogglePin(contextMenu.sessionId)}>
            {pinnedSessions.includes(contextMenu.sessionId) ? "Unpin" : "Pin"}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setRenameModal({ sessionId: contextMenu.sessionId, currentTitle: contextMenu.title });
              setContextMenu(null);
            }}
          >
            Rename
          </MenuItem>
          <MenuItem onClick={() => handleShare(contextMenu.sessionId, contextMenu.title)}>Share</MenuItem>
          <div className="my-1 h-px bg-pm-line" />
          <MenuItem danger onClick={() => handleDelete(contextMenu.sessionId)}>
            Delete
          </MenuItem>
        </div>
      )}

      <aside
        className={cn(
          "relative z-50 flex h-full shrink-0 flex-col bg-pm-shell",
          !isResizing && "transition-[width] duration-200 ease-[var(--ease-pm)]",
          // On small screens the open sidebar floats over the page.
          isOpen && "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:shadow-2xl",
          // Closed on small screens: no icon rail, the top bar's menu button opens it instead.
          !isOpen && "max-md:hidden",
        )}
        style={{ width: collapsed ? COLLAPSED_WIDTH : width }}
      >
        {/* Header: the landing-page logo, no background */}
        <div className={cn("flex h-14 items-center px-4", collapsed && "justify-center px-0")}>
          <Link
            href="/"
            title="Prodmate"
            className="flex min-w-0 items-center gap-2.5 rounded-lg text-pm-fg outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40"
          >
            <LogoMark className="size-7" />
            {!collapsed && <span className="truncate text-lg leading-none font-semibold tracking-tight">Prodmate</span>}
          </Link>
        </div>

        {/* Search */}
        <div className={cn("px-3 pb-3", collapsed && "flex justify-center px-0")}>
          {collapsed ? (
            <IconButton onClick={() => setIsSearchOpen(true)} title="Search projects">
              <Search />
            </IconButton>
          ) : (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex h-9 w-full items-center gap-2 rounded-lg border border-pm-line bg-pm-card px-2.5 text-[13px] text-pm-muted transition-colors hover:border-pm-fg/15 outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40"
            >
              <Search className="size-3.5" />
              <span className="flex-1 text-left">Search projects…</span>
              <Kbd>{isMac ? "⌘K" : "Ctrl K"}</Kbd>
            </button>
          )}
        </div>

        {/* Main navigation */}
        <nav className={cn("flex flex-col gap-0.5 px-3", collapsed && "items-center px-2")}>
          {!collapsed && <Eyebrow className="px-2.5 pb-1.5">Main</Eyebrow>}
          <NavItem
            collapsed={collapsed}
            icon={<Plus />}
            label="New project"
            onClick={handleNewProject}
            active={isHome}
          />
          <NavItem
            collapsed={collapsed}
            icon={<Plug />}
            label="Integrations"
            href="/integrations"
            active={pathname?.startsWith("/integrations")}
          />
          <NavItem collapsed={collapsed} icon={<CreditCard />} label="Plans" href={`${LANDING_URL}/#pricing`} external />
        </nav>

        {/* Projects */}
        <div className={cn("mt-5 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3", collapsed && "invisible")}>
          {!collapsed &&
            (!isSignedIn ? (
              <p className="px-2.5 text-[13px] leading-relaxed text-pm-muted">Sign in to see your projects here.</p>
            ) : loading && sessions.length === 0 ? (
              <div className="flex flex-col gap-1.5 px-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-7 animate-pulse rounded-lg bg-pm-line/60" style={{ opacity: 1 - i * 0.2 }} />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <p className="px-2.5 text-[13px] leading-relaxed text-pm-muted">No projects yet. Start one above.</p>
            ) : (
              <>
                {pinnedList.length > 0 && (
                  <HistoryGroup label="Pinned" collapsed={isPinnedCollapsed} onToggle={() => setIsPinnedCollapsed((c) => !c)}>
                    {renderItems(pinnedList)}
                  </HistoryGroup>
                )}
                {recentList.length > 0 && (
                  <HistoryGroup label="Recent" collapsed={isRecentCollapsed} onToggle={() => setIsRecentCollapsed((c) => !c)}>
                    {renderItems(recentList)}
                  </HistoryGroup>
                )}
              </>
            ))}
        </div>

        {/* Footer */}
        <div className={cn("flex flex-col gap-0.5 px-3 pt-2 pb-3", collapsed && "items-center px-2")}>
          <NavItem
            collapsed={collapsed}
            icon={<Settings />}
            label="Settings"
            href="/settings"
            active={pathname?.startsWith("/settings")}
          />
          <NavItem collapsed={collapsed} icon={<CircleQuestionMark />} label="Help center" href={`${LANDING_URL}/docs`} external />

          <div className="relative mt-2 w-full">
            {profileMenuOpen && isSignedIn && (
              <div ref={profileMenuRef} className={cn(menuSurface, "absolute bottom-full left-0 z-[1000] mb-2 w-56")}>
                <div className="px-2.5 pt-1.5 pb-2">
                  <div className="truncate text-[13px] font-medium">{cachedDisplayName}</div>
                  {cachedEmail && <div className="truncate text-xs text-pm-muted">{cachedEmail}</div>}
                </div>
                <div className="mb-1 h-px bg-pm-line" />
                <SignOutButton>
                  <MenuItem danger icon={<LogOut />} onClick={() => setProfileMenuOpen(false)}>
                    Log out
                  </MenuItem>
                </SignOutButton>
              </div>
            )}

            {isLoaded && !isSignedIn && !collapsed ? (
              <div className="rounded-xl border border-pm-line bg-pm-card p-3">
                <div className="text-[13px] font-medium">Save your projects</div>
                <p className="mt-0.5 text-xs leading-relaxed text-pm-muted">Sign in to keep your plans and pick up where you left off.</p>
                <div className="mt-3 flex gap-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="dark" size="sm" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  if (!isSignedIn) {
                    router.push("/login");
                    return;
                  }
                  e.stopPropagation();
                  setProfileMenuOpen((p) => !p);
                }}
                title={isSignedIn ? "Account" : "Log in"}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border border-pm-line bg-pm-card p-2 text-left transition-colors hover:border-pm-fg/15 outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40",
                  collapsed && "justify-center border-transparent bg-transparent p-1 hover:bg-pm-card",
                )}
              >
                {cachedImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cachedImageUrl} alt="" className="size-8 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-pm-shell text-xs font-semibold text-pm-fg/70">
                    {showIdentity ? initials : isSignedIn ? <User className="size-4" /> : <LogIn className="size-4" />}
                  </span>
                )}
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[13px] font-medium">{showIdentity ? cachedDisplayName : "Log in"}</span>
                      {showIdentity && cachedEmail && <span className="block truncate text-[11px] text-pm-muted">{cachedEmail}</span>}
                    </span>
                    <ChevronsUpDown className="size-3.5 shrink-0 text-pm-muted" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Resize handle: drag to resize, drag to the far left to collapse, double-click to toggle */}
        {onResizeStart && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            title="Drag to resize · double-click to collapse"
            onPointerDown={onResizeStart}
            onDoubleClick={onToggle}
            className="group/resize absolute top-0 -right-1.5 z-20 flex h-full w-3 cursor-col-resize touch-none justify-center"
          >
            <span
              className={cn(
                "h-full w-0.5 rounded-full transition-colors group-hover/resize:bg-pm-primary/50",
                isResizing && "bg-pm-primary",
              )}
            />
          </div>
        )}
      </aside>
    </>
  );
}
