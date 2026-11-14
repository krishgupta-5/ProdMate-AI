"use client";

import React from "react";
import { ArrowUp, LoaderCircle, Mic } from "lucide-react";
import { cn } from "@/lib/cn";

interface InputQuota {
  tokensUsed: number;
  tokensLimit: number;
  tokensRemaining: number;
  exhausted: boolean;
  resetAt: number;
}

interface InputAreaProps {
  input: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  tokenQuota: InputQuota | null;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  isTyping: boolean;
  hasGeneratedConfig?: boolean;
  /** "hero" is the large centred box on the home screen; "dock" sits at the bottom of a chat. */
  variant?: "hero" | "dock";
}

export default function InputArea({
  input,
  textareaRef,
  tokenQuota,
  handleInputChange,
  handleKeyDown,
  handleSend,
  isTyping,
  hasGeneratedConfig,
  variant = "dock",
}: InputAreaProps) {
  const isHero = variant === "hero";

  // Grow with the prompt, like ChatGPT: one line when empty, taller as you type (or paste, or a
  // prompt is filled in for you), shrinking back as you delete. Past the cap it scrolls inside.
  const resize = React.useCallback(() => {
    const t = textareaRef.current;
    if (!t) return;
    // Hero: leave room for the top bar, orb, greeting and disclaimer (~380px) so the centred
    // column never runs off screen. Dock: up to a third of the window.
    const cap = Math.round(
      isHero
        ? Math.max(120, Math.min(window.innerHeight - 380, 420))
        : Math.max(96, Math.min(window.innerHeight * 0.35, 300)),
    );
    t.style.height = "auto";
    const next = Math.min(t.scrollHeight, cap);
    t.style.height = `${next}px`;
    t.style.overflowY = t.scrollHeight > cap ? "auto" : "hidden";
  }, [textareaRef, isHero]);

  React.useLayoutEffect(() => {
    resize();
  }, [input, resize]);

  React.useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const isSubmitDisabled = !input.trim() || tokenQuota?.exhausted || isTyping;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 rounded-2xl border border-pm-line bg-pm-card p-3 transition-[border-color,box-shadow] duration-200",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)]",
        "focus-within:border-pm-primary/40 focus-within:shadow-[0_0_0_4px_color-mix(in_oklch,var(--pm-primary)_12%,transparent),0_12px_32px_-12px_rgba(0,0,0,0.12)]",
        isHero && "p-4",
      )}
      onClick={() => textareaRef.current?.focus()}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={
          tokenQuota?.exhausted
            ? "You've used today's tokens. They reset soon."
            : hasGeneratedConfig
              ? "Ask about your project, write an email, schedule a meeting…"
              : "Describe the product you want to build…"
        }
        disabled={isTyping}
        rows={1}
        className={cn(
          "block w-full resize-none overflow-hidden bg-transparent px-1 text-[15px] break-words [overflow-wrap:anywhere] leading-relaxed text-pm-fg outline-none placeholder:text-pm-muted disabled:opacity-60",
          "min-h-6 transition-[height] duration-100 ease-out",
        )}
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          title="Voice input"
          className="grid size-8 place-items-center rounded-lg text-pm-muted transition-colors hover:bg-pm-shell hover:text-pm-fg"
          onClick={(e) => e.stopPropagation()}
        >
          <Mic className="size-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSend();
          }}
          disabled={Boolean(isSubmitDisabled)}
          title="Send"
          aria-label="Send message"
          className={cn(
            "grid size-9 place-items-center rounded-xl transition-[background-color,color,transform] duration-200 active:scale-95",
            isSubmitDisabled && !isTyping
              ? "cursor-not-allowed bg-pm-shell text-pm-muted"
              : "bg-pm-primary text-white hover:bg-pm-primary/85",
          )}
        >
          {isTyping ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowUp className="size-4" strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  );
}
