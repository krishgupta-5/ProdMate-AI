"use client";

import React from "react";
import Link from "next/link";
import { LogoMark } from "./Logo";
import { Button, Modal } from "./ui";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} labelledBy="login-modal-title" className="max-w-sm text-center">
      <LogoMark className="mx-auto size-10 text-pm-fg" />
      <h2 id="login-modal-title" className="mt-4 text-lg font-semibold tracking-tight">
        Sign in to keep going
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-pm-muted">
        You need an account to send messages and save your projects. It&apos;s free during early access.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Button variant="primary" onClick={onLogin} className="w-full">
          Log in
        </Button>
        <Link href="/signup" className="w-full">
          <Button variant="outline" className="w-full">
            Create an account
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={onClose} className="mx-auto mt-1">
          Not now
        </Button>
      </div>
    </Modal>
  );
}
