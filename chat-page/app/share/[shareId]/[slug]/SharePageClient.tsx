"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ChatPanel from "@/app/chat/components/ChatPanel";
import { CircleAlert, Eye, GitFork, LoaderCircle } from "lucide-react";
import { LogoMark } from "@/app/chat/components/Logo";
import { Button, buttonClass } from "@/app/chat/components/ui";


export default function SharePageClient({ shareId, slug }: { shareId: string; slug: string }) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [forking, setForking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/share/${shareId}`);
        if (!res.ok) {
          if (res.status === 404) setError("Shared workspace not available or has been deleted.");
          else setError("Failed to load shared workspace.");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError("Network error encountered.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [shareId]);

  const handleFork = async () => {
    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    setForking(true);
    try {
      const res = await fetch(`/api/share/${shareId}/fork`, { method: "POST" });
      if (!res.ok) throw new Error("Fork failed");
      const { newSessionId } = await res.json();
      router.push(`/chat/${newSessionId}`);
    } catch (e) {
      console.error(e);
      alert("Failed to fork project.");
      setForking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-dvh flex-1 items-center justify-center gap-3 bg-pm-shell text-sm font-medium text-pm-muted">
        <LoaderCircle className="size-4 animate-spin" />
        Loading shared project…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="flex h-dvh flex-1 flex-col items-center justify-center gap-4 bg-pm-shell p-6 text-pm-fg">
        <div className="max-w-sm rounded-2xl border border-pm-line bg-pm-card p-6 text-center">
          <span className="mx-auto grid size-10 place-items-center rounded-xl bg-pm-danger/10 text-pm-danger">
            <CircleAlert className="size-5" />
          </span>
          <h2 className="mt-4 text-base font-semibold tracking-tight">This project isn&apos;t available</h2>
          <p className="mt-1.5 text-sm text-pm-muted">{error}</p>
          <Link href="/" className={buttonClass("outline", "sm", "mt-5")}>
            Go to ProdMate
          </Link>
        </div>
      </div>
    );
  }
  const { metadata } = data;
  return (
    <div className="flex h-dvh flex-1 flex-col bg-pm-shell p-2 text-pm-fg">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-pm-line bg-pm-card">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-pm-line px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" title="ProdMate" className="shrink-0 text-pm-fg">
              <LogoMark className="size-7" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-[15px] font-semibold tracking-tight">{metadata.title || "Shared project"}</h1>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-pm-line bg-pm-shell px-2 py-0.5 text-[10.5px] font-medium text-pm-muted">
                  <Eye className="size-3" />
                  Read only
                </span>
              </div>
              <div className="truncate text-xs text-pm-muted">
                Shared by <span className="font-medium text-pm-fg/80">{metadata.ownerName}</span> · made with ProdMate
              </div>
            </div>
          </div>
          {isLoaded && isSignedIn ? (
            <Button variant="primary" size="sm" onClick={handleFork} disabled={forking}>
              {forking ? <LoaderCircle className="animate-spin" /> : <GitFork />}
              {forking ? "Forking…" : "Fork to my workspace"}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
              Sign in to fork
            </Button>
          )}
        </header>

        {/* Read-only conversation */}
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <ChatPanel agentName="AI Architect" isSidebarOpen={false} onToggleSidebar={() => {}} isSharedView={true} sharedData={data} />
        </div>
      </div>
    </div>
  );
}