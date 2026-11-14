import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, createOrUpdateUser } from "@/lib/firebase-admin";
import { getFullUserData } from "@/lib/auth";
import { cleanTitle, isPlaceholderTitle, titleFromDescription } from "@/lib/session-title";
import { generateTitle } from "@/lib/pipeline/ArtifactController";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Fire-and-forget — don't block the response on user sync
    getFullUserData()
      .then((fullUserData) => createOrUpdateUser(userId, fullUserData))
      .catch(console.error);

    // Fetch all sessions for this user
    let sessionsSnapshot;
    try {
      sessionsSnapshot = await db
        .collection("sessions")
        .where("userId", "==", userId)
        .get();
    } catch (error) {
      console.error("Failed to fetch sessions from Firestore:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Run all per-session queries concurrently (1 doc each, not whole subcollections)
    const sessions = await Promise.all(
      sessionsSnapshot.docs.map(async (doc) => {
        const sessionId = doc.id;
        const sessionData = doc.data();

        // If we already have a real title, skip the messages query entirely
        // No real name yet (older chats, or ones renamed to a button label by an earlier bug):
        // ask the AI for one from the project idea, once, and save it.
        if (isPlaceholderTitle(sessionData.title) && sessionData.projectDescription && process.env.GROQ_API_KEY) {
          try {
            const named = cleanTitle(await generateTitle(sessionData.projectDescription, process.env.GROQ_API_KEY));
            if (named && !isPlaceholderTitle(named)) {
              await doc.ref.set({ title: named }, { merge: true });
              sessionData.title = named;
            }
          } catch (e) {
            console.error("Failed to name session", sessionId, e);
          }
        }

        const fallbackTitle = titleFromDescription(sessionData.projectDescription);
        if (sessionData.title && (!isPlaceholderTitle(sessionData.title) || !fallbackTitle)) {
          return {
            sessionId,
            updatedAt: sessionData.updatedAt?.toDate() || new Date(),
            messageCount: sessionData.messageCount ?? 0,
            lastMessage: sessionData.title,
          };
        }

        const lastMsgsSnap = await db
          .collection("sessions")
          .doc(sessionId)
          .collection("messages")
          .get();

        const userMessages = lastMsgsSnap.docs
          .map(d => d.data())
          .filter(d => d.role === "user")
          .sort((a, b) => {
            const ta = a.createdAt?.toDate?.()?.getTime() ?? 0;
            const tb = b.createdAt?.toDate?.()?.getTime() ?? 0;
            return tb - ta;
          });

        // Prefer the project idea (the first message) over whatever was typed last.
        const lastMessage = fallbackTitle ?? titleFromDescription(userMessages[userMessages.length - 1]?.content) ?? null;

        return {
          sessionId,
          updatedAt: sessionData.updatedAt?.toDate() || new Date(),
          messageCount: sessionData.messageCount ?? 0,
          lastMessage,
        };
      })
    );

    // Sort by most recent first
    sessions.sort((a, b) => {
      const dateA =
        a.updatedAt instanceof Date
          ? a.updatedAt.getTime()
          : new Date(a.updatedAt).getTime();
      const dateB =
        b.updatedAt instanceof Date
          ? b.updatedAt.getTime()
          : new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Failed to load user sessions:", error);
    return NextResponse.json(
      { error: "Failed to load user sessions" },
      { status: 500 }
    );
  }
}
