"use client";

import React from "react";
import { Copy, ExternalLink, LoaderCircle, X } from "lucide-react";
import { Button, IconButton, Modal } from "./ui";

export default function ShareDialog({
  sessionId,
  title,
  shareUrl,
  shareId,
  loading,
  onClose,
  onDelete,
  onCopy,
}: {
  sessionId: string;
  title?: string;
  shareUrl?: string;
  shareId?: string;
  loading?: boolean;
  onClose: () => void;
  onDelete: (shareId: string, sessionId: string) => void;
  onCopy?: () => void;
}) {
  return (
    <Modal onClose={onClose} labelledBy="share-title">
      <IconButton onClick={onClose} title="Close" className="absolute top-4 right-4">
        <X />
      </IconButton>
      <h2 id="share-title" className="text-base font-semibold tracking-tight">
        Share project
      </h2>
      {title && (
        <p className="mt-1 truncate pr-8 text-sm font-medium text-pm-fg/80" title={title}>
          {title}
        </p>
      )}

      {loading ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-pm-muted">
          <LoaderCircle className="size-4 animate-spin" />
          Creating a link…
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-pm-muted">Anyone with this link can view this project.</p>
          <input
            type="text"
            readOnly
            value={shareUrl || ""}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-4 h-10 w-full rounded-lg border border-pm-line bg-pm-shell px-3 font-mono text-xs text-pm-fg/80 outline-none"
          />
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                if (shareUrl) {
                  navigator.clipboard.writeText(shareUrl);
                  onCopy?.();
                }
              }}
            >
              <Copy />
              Copy link
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => shareUrl && window.open(shareUrl, "_blank")}>
              <ExternalLink />
              Open
            </Button>
          </div>
          {shareId && (
            <button
              type="button"
              onClick={() => onDelete(shareId, sessionId)}
              className="mt-4 text-[13px] font-medium text-pm-danger hover:underline"
            >
              Stop sharing
            </button>
          )}
        </>
      )}
    </Modal>
  );
}
