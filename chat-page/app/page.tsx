"use client";

import React from "react";
import AppShell from "./chat/components/AppShell";
import ChatPanel from "./chat/components/ChatPanel";

export default function Home() {
  return (
    <AppShell>
      {({ showLoginModal, onShowLoginModal }) => (
        <ChatPanel agentName="Product Architect" showLoginModal={showLoginModal} onShowLoginModal={onShowLoginModal} />
      )}
    </AppShell>
  );
}
