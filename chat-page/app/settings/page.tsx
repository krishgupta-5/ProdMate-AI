"use client";

import React, { useEffect, useRef, useState } from "react";
import { useClerk, useUser, SignOutButton } from "@clerk/nextjs";
import { Gauge, KeyRound, LogOut, Monitor, Moon, Palette, Settings, SlidersHorizontal, Sun, User } from "lucide-react";
import AppShell, { BackButton, Crumb, PageHeading, TopBar } from "../chat/components/AppShell";
import { Button, Card, Modal } from "../chat/components/ui";
import { useTheme, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/cn";
import { useSmoothScroll } from "@/lib/use-smooth-scroll";

import { LANDING_URL } from "@/lib/site";

type Tab = "profile" | "appearance" | "preferences" | "security" | "billing";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User /> },
  { id: "appearance", label: "Appearance", icon: <Palette /> },
  { id: "preferences", label: "Workspace data", icon: <SlidersHorizontal /> },
  { id: "security", label: "Security", icon: <KeyRound /> },
  { id: "billing", label: "Usage & billing", icon: <Gauge /> },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsContent />
    </AppShell>
  );
}

function SettingsContent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  useSmoothScroll(scrollRef);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <>
      <TopBar left={
          <>
            <BackButton />
            <Crumb icon={<Settings />}>Settings</Crumb>
          </>
        } />

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-5 pt-4 pb-20 sm:px-8">
          <PageHeading title="Settings" description="Manage your account, how ProdMate looks, and your usage." />

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:gap-12">
            {/* Section nav */}
            <aside className="md:w-52 md:shrink-0">
              <nav className="flex gap-1 overflow-x-auto md:sticky md:top-4 md:flex-col">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={cn(
                      "flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-3 text-left text-[13.5px] font-medium whitespace-nowrap transition-colors [&_svg]:size-4",
                      activeTab === t.id
                        ? "bg-pm-shell text-pm-fg"
                        : "text-pm-muted hover:bg-pm-shell/60 hover:text-pm-fg",
                    )}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </nav>

              <div className="mt-8 hidden flex-col gap-2 px-3 text-xs text-pm-muted md:flex">
                <a href={`${LANDING_URL}/terms`} className="transition-colors hover:text-pm-fg">Terms of Service</a>
                <a href={`${LANDING_URL}/privacy`} className="transition-colors hover:text-pm-fg">Privacy Policy</a>
                <a href={`${LANDING_URL}/cookies`} className="transition-colors hover:text-pm-fg">Cookie Policy</a>
              </div>
            </aside>

            <div key={activeTab} className="min-w-0 flex-1 fade-up" style={{ "--rise": "8px", "--duration": "0.4s" } as React.CSSProperties}>
              {activeTab === "profile" && <ProfileSection />}
              {activeTab === "appearance" && <AppearanceSection />}
              {activeTab === "preferences" && <PreferencesSection />}
              {activeTab === "security" && <SecuritySection />}
              {activeTab === "billing" && <BillingSection />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Sections
// ─────────────────────────────────────────────

function ProfileSection() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return (
      <Section title="Profile" description="Loading your profile…">
        <div className="h-40 animate-pulse rounded-2xl bg-pm-shell" />
      </Section>
    );
  }

  const initials = (user.firstName?.[0] || "") + (user.lastName?.[0] || "");

  return (
    <Section title="Profile" description="Your name and email come from your sign-in account.">
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          {user.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.imageUrl} alt="" className="size-16 rounded-2xl object-cover" />
          ) : (
            <div className="grid size-16 place-items-center rounded-2xl bg-pm-shell text-lg font-semibold text-pm-muted">
              {initials || "U"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-semibold">{user.fullName || "Unnamed user"}</div>
            <div className="truncate text-sm text-pm-muted">{user.primaryEmailAddress?.emailAddress}</div>
          </div>
          <SignOutButton>
            <Button variant="outline" size="sm">
              <LogOut />
              Log out
            </Button>
          </SignOutButton>
        </div>

        <div className="my-6 h-px bg-pm-line" />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Display name" value={user.fullName || ""} readOnly />
          <Field label="Email address" value={user.primaryEmailAddress?.emailAddress || ""} type="email" readOnly />
        </div>
      </Card>
    </Section>
  );
}

const THEME_OPTIONS: { id: ThemePreference; label: string; icon: React.ReactNode }[] = [
  { id: "light", label: "Light", icon: <Sun /> },
  { id: "dark", label: "Dark", icon: <Moon /> },
  { id: "system", label: "System", icon: <Monitor /> },
];

function AppearanceSection() {
  const { preference, setPreference } = useTheme();

  return (
    <Section title="Appearance" description="Choose how ProdMate looks on this device.">
      <Card className="p-6">
        <div className="text-sm font-medium">Theme</div>
        <p className="mt-0.5 text-[13px] text-pm-muted">System follows your device&apos;s light or dark setting.</p>

        <div role="radiogroup" aria-label="Theme" className="mt-5 grid gap-3 sm:grid-cols-3">
          {THEME_OPTIONS.map((o) => {
            const selected = preference === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPreference(o.id)}
                className={cn(
                  "group overflow-hidden rounded-xl border text-left transition-[border-color,box-shadow]",
                  selected
                    ? "border-pm-primary shadow-[0_0_0_3px_color-mix(in_oklch,var(--pm-primary)_18%,transparent)]"
                    : "border-pm-line hover:border-pm-line-strong",
                )}
              >
                <ThemePreview kind={o.id} />
                <div className="flex items-center gap-2 border-t border-pm-line px-3 py-2.5 text-[13px] font-medium [&_svg]:size-3.5 [&_svg]:text-pm-muted">
                  {o.icon}
                  {o.label}
                  <span
                    className={cn(
                      "ml-auto grid size-4 place-items-center rounded-full border",
                      selected ? "border-pm-primary bg-pm-primary" : "border-pm-line-strong",
                    )}
                  >
                    {selected && <span className="size-1.5 rounded-full bg-white" />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </Section>
  );
}

/** A tiny drawing of the app (sidebar + card) in one theme. */
function Mini({ dark }: { dark: boolean }) {
  return (
    <div className={cn("flex h-full w-full gap-1.5 p-2", dark ? "bg-[#1c1c1c]" : "bg-[#f4f4f4]")}>
      <div className="flex w-1/4 flex-col gap-1 pt-1">
        <div className={cn("h-1.5 w-3/4 rounded-full", dark ? "bg-white/70" : "bg-black/70")} />
        <div className="h-1.5 w-full rounded-full bg-[#6c5ce7]" />
        <div className={cn("h-1.5 w-2/3 rounded-full", dark ? "bg-white/20" : "bg-black/15")} />
      </div>
      <div className={cn("flex flex-1 flex-col items-center justify-center gap-1 rounded-md", dark ? "bg-[#262626]" : "bg-white")}>
        <div className="size-2.5 rounded-full bg-[#6c5ce7]" />
        <div className={cn("h-1.5 w-1/2 rounded-full", dark ? "bg-white/60" : "bg-black/60")} />
        <div className={cn("mt-0.5 h-3 w-3/4 rounded", dark ? "bg-white/10" : "bg-black/[0.06]")} />
      </div>
    </div>
  );
}

/** The light, dark, or half-and-half (system) preview on each theme option. */
function ThemePreview({ kind }: { kind: ThemePreference }) {
  return (
    <div className="relative h-24 w-full">
      {kind === "system" ? (
        <>
          <div className="absolute inset-0">
            <Mini dark={false} />
          </div>
          <div className="absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]">
            <Mini dark />
          </div>
        </>
      ) : (
        <Mini dark={kind === "dark"} />
      )}
    </div>
  );
}

function PreferencesSection() {
  const [isClearing, setIsClearing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [clearError, setClearError] = useState("");

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      const response = await fetch("/api/chat-history?clearAll=true", { method: "DELETE" });
      if (response.ok) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("chatHistory_")) localStorage.removeItem(key);
        });
        window.location.reload();
      } else {
        setClearError("Failed to clear chat history. Please try again.");
        setTimeout(() => setClearError(""), 3000);
        setIsClearing(false);
        setShowConfirmDialog(false);
      }
    } catch (error) {
      console.error("Error clearing history:", error);
      setIsClearing(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <Section title="Workspace data" description="Manage the history ProdMate keeps for you.">
      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <div className="text-sm font-medium">Clear workspace data</div>
          <p className="mt-0.5 text-[13px] text-pm-muted">Permanently remove all chat history and local configuration.</p>
        </div>
        <Button variant="danger" size="sm" onClick={() => setShowConfirmDialog(true)}>
          Clear data
        </Button>
      </Card>

      {clearError && <p className="mt-3 text-[13px] text-pm-danger">{clearError}</p>}

      {showConfirmDialog && (
        <Modal onClose={() => !isClearing && setShowConfirmDialog(false)} labelledBy="clear-title">
          <h2 id="clear-title" className="text-base font-semibold tracking-tight">
            Clear workspace data?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-pm-muted">
            This permanently deletes all chat history and local configuration. You can&apos;t undo this.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowConfirmDialog(false)} disabled={isClearing}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearHistory} disabled={isClearing}>
              {isClearing ? "Clearing…" : "Yes, clear data"}
            </Button>
          </div>
        </Modal>
      )}
    </Section>
  );
}

function SecuritySection() {
  const { user } = useUser();
  const clerk = useClerk();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const isOAuthUser = !!user?.externalAccounts && user.externalAccounts.length > 0;
  const hasPassword = user?.passwordEnabled || false;

  const resetForm = () => {
    setShowPasswordForm(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      await clerk.user?.updatePassword({ currentPassword, newPassword });
      setPasswordSuccess("Password changed.");
      resetForm();
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error: unknown) {
      console.error("Password change error:", error);
      const code = (error as { errors?: { code?: string }[] })?.errors?.[0]?.code;
      if (code === "invalid_password") setPasswordError("Current password is incorrect");
      else if (code === "password_length_too_short") setPasswordError("Password must be at least 8 characters long");
      else if (code === "password_already_used") setPasswordError("This password has been used before");
      else setPasswordError("Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const provider = user?.externalAccounts?.[0]?.provider || "Google";

  return (
    <Section title="Security" description="How you sign in, and your password.">
      <Card className="p-6">
        <div className="text-xs font-medium tracking-wide text-pm-muted uppercase">Sign-in method</div>
        <div className="mt-3 flex items-center gap-3 text-sm">
          {isOAuthUser ? (
            <>
              <span className="flex-1">
                You sign in with <strong className="font-semibold capitalize">{provider}</strong>.
              </span>
              {user?.externalAccounts?.[0]?.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.externalAccounts[0].imageUrl} alt="" className="size-6 rounded-md" />
              )}
            </>
          ) : hasPassword ? (
            <span>You sign in with your email and a password.</span>
          ) : (
            <span className="text-pm-muted">No sign-in method is set up.</span>
          )}
        </div>

        <div className="my-6 h-px bg-pm-line" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium">Password</div>
            <p className="mt-0.5 text-[13px] text-pm-muted">
              {isOAuthUser
                ? `Managed by ${provider}.`
                : hasPassword
                  ? "Change the password you use to sign in."
                  : "Your account has no password. You sign in through a connected provider."}
            </p>
          </div>
          {!isOAuthUser && hasPassword && (
            <Button variant="outline" size="sm" onClick={() => (showPasswordForm ? resetForm() : setShowPasswordForm(true))}>
              {showPasswordForm ? "Cancel" : "Change password"}
            </Button>
          )}
        </div>

        {passwordSuccess && (
          <p className="mt-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-[13px] text-emerald-600">{passwordSuccess}</p>
        )}
        {passwordError && <p className="mt-4 rounded-lg bg-pm-danger/10 px-3 py-2 text-[13px] text-pm-danger">{passwordError}</p>}

        {!isOAuthUser && hasPassword && showPasswordForm && (
          <form onSubmit={handleChangePassword} className="mt-6 flex flex-col gap-4">
            <Field label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} disabled={isChangingPassword} />
            <Field label="New password" type="password" value={newPassword} onChange={setNewPassword} disabled={isChangingPassword} />
            <Field label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} disabled={isChangingPassword} />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating…" : "Update password"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </Section>
  );
}

function BillingSection() {
  const [tokenData, setTokenData] = useState<{ tokensUsed: number; tokensLimit: number; resetAt?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetMessage, setResetMessage] = useState("Usage details unavailable");

  useEffect(() => {
    fetch("/api/token-quota")
      .then((res) => res.json())
      .then((data) => {
        setTokenData(data);
        if (data?.resetAt) {
          const diffMs = Math.max(0, data.resetAt - Date.now());
          const hours = Math.floor(diffMs / 3_600_000);
          const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
          setResetMessage(hours > 24 ? `Resets in ${Math.floor(hours / 24)} days` : `Resets in ${hours}h ${minutes}m`);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const used = tokenData ? tokenData.tokensUsed.toLocaleString() : "0";
  const limit = tokenData
    ? tokenData.tokensLimit >= 1000
      ? `${tokenData.tokensLimit / 1000}K`
      : tokenData.tokensLimit.toLocaleString()
    : "0";
  const percentage =
    tokenData && tokenData.tokensLimit > 0 ? Math.min(100, Math.round((tokenData.tokensUsed / tokenData.tokensLimit) * 100)) : 0;


  return (
    <Section title="Usage & billing" description="Your plan and how many AI tokens you've used.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col p-6">
          <div className="text-xs font-medium tracking-wide text-pm-muted uppercase">Plan</div>
          <div className="mt-3 text-2xl font-semibold tracking-tight">Free</div>
          <div className="mt-1 text-sm text-pm-muted">$0 / month during early access</div>
          <a href={`${LANDING_URL}/#pricing`} className="mt-6">
            <Button variant="outline" size="sm">
              See plans
            </Button>
          </a>
        </Card>

        <Card className="p-6">
          <div className="text-xs font-medium tracking-wide text-pm-muted uppercase">This cycle</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{loading ? "…" : used}</span>
            <span className="text-sm text-pm-muted">/ {loading ? "…" : `${limit} tokens`}</span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-pm-shell">
            <div
              className="h-full rounded-full bg-pm-primary transition-[width] duration-700 ease-[var(--ease-pm)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-3 text-xs text-pm-muted">{loading ? "Loading usage…" : resetMessage}</div>
        </Card>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// Shared pieces
// ─────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 mb-5 text-sm text-pm-muted">{description}</p>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  type = "text",
  readOnly = false,
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-pm-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        suppressHydrationWarning
        className={cn(
          "h-10 w-full rounded-lg border border-pm-line px-3 text-sm outline-none transition-[border-color,box-shadow]",
          readOnly || disabled
            ? "cursor-not-allowed bg-pm-shell text-pm-muted"
            : "bg-pm-card focus:border-pm-primary/50 focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--pm-primary)_15%,transparent)]",
        )}
      />
    </div>
  );
}
