import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/db";
import { usuarios } from "@/db/schema";
import { SESSION_COOKIE, verifySession, type SessionPayload } from "./session";

// TODO: Cambiar a `false` cuando se quiera reactivar el inicio de sesión por GitHub.
export const BYPASS_GITHUB_AUTH_FOR_TESTS = true;

export const TEST_USER = {
  id: "test-user-local",
  nombre: "Socio (Pruebas)",
  email: "test@forge-sh.dev",
  passwordHash: "test",
};

export async function getOrCreateTestSession(): Promise<SessionPayload> {
  const exp = Math.floor(Date.now() / 1000) + 86400;
  try {
    const db = getDb();
    const existing = await db
      .select({ id: usuarios.id, nombre: usuarios.nombre, email: usuarios.email })
      .from(usuarios)
      .limit(1)
      .get();
    if (existing) {
      return { uid: existing.id, nombre: existing.nombre, email: existing.email, exp };
    }

    await db.insert(usuarios).values(TEST_USER).onConflictDoNothing();
  } catch {
    // Fallback en caso de que la tabla aún no esté migrada.
  }
  return { uid: TEST_USER.id, nombre: TEST_USER.nombre, email: TEST_USER.email, exp };
}

// Returns the current partner's session, or null. Use in server components /
// route handlers. Reads SESSION_SECRET from the Cloudflare env.
export async function getSession(): Promise<SessionPayload | null> {
  const { env } = getCloudflareContext();
  const secret = env.SESSION_SECRET;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = secret ? await verifySession(token, secret) : null;
  if (session) return session;

  if (BYPASS_GITHUB_AUTH_FOR_TESTS) {
    return getOrCreateTestSession();
  }
  return null;
}

// Enforces auth in /admin server components — redirects to /login if missing.
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
