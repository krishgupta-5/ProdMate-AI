"use client";

import { SignIn } from "@clerk/nextjs";
import AuthLayout, { clerkAppearance } from "../../AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout switchHref="/signup" switchPrompt="New to Prodmate?" switchLabel="Create account">
      <SignIn routing="path" path="/login" signUpUrl="/signup" appearance={clerkAppearance} />
    </AuthLayout>
  );
}
