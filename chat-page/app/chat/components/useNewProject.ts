"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { resetSessionId } from "@/lib/sessionId";

/** Starts a new project: a fresh session id, or the sign-in prompt for guests. */
export function useNewProject(onShowLoginModal?: (show: boolean) => void) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  return useCallback(() => {
    if (!isSignedIn) {
      onShowLoginModal?.(true);
      return;
    }
    router.push(`/chat/${resetSessionId()}`);
  }, [isSignedIn, onShowLoginModal, router]);
}
