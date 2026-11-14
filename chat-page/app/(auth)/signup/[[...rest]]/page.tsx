"use client";

import { SignUp } from "@clerk/nextjs";
import AuthLayout, { clerkAppearance } from "../../AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout switchHref="/login" switchPrompt="Have an account?" switchLabel="Log in">
      <SignUp routing="path" path="/signup" signInUrl="/login" appearance={clerkAppearance} />
    </AuthLayout>
  );
}
