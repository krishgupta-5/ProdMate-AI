"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import AppShell from "../components/AppShell";
import ChatPanel from "../components/ChatPanel";

export default function ChatSession() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  // Sync sessionStorage with the URL so getSessionId() returns this session everywhere.
  useEffect(() => {
    if (sessionId) sessionStorage.setItem("ProdMate-session-id", sessionId);
  }, [sessionId]);

  return (
    <AppShell activeSessionId={sessionId}>
      {({ showLoginModal, onShowLoginModal }) => (
        <ChatPanel
          agentName="External Meeting Prep Ag..."
          sessionId={sessionId}
          showLoginModal={showLoginModal}
          onShowLoginModal={onShowLoginModal}
        />
      )}
    </AppShell>
  );
}
