import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { BYPASS_GITHUB_AUTH_FOR_TESTS, getOrCreateTestSession } from "@/lib/auth";
import { signState } from "@/lib/oauth-state";
import { authorizeUrl } from "@/lib/github-oauth";
import { sessionCookieString, signSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// Inicia "Entrar con GitHub". No requiere sesión: ES el login.
export async function GET(req: NextRequest) {
  const { env } = getCloudflareContext();

  if (BYPASS_GITHUB_AUTH_FOR_TESTS) {
    const testSession = await getOrCreateTestSession();
    const res = NextResponse.redirect(new URL("/admin", req.url));
    if (env.SESSION_SECRET) {
      const token = await signSession(
        {
          uid: testSession.uid,
          nombre: testSession.nombre,
          email: testSession.email,
        },
        env.SESSION_SECRET,
      );
      res.headers.set("Set-Cookie", sessionCookieString(token));
    }
    return res;
  }

  if (!env.GITHUB_APP_CLIENT_ID || !env.GITHUB_APP_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "GitHub OAuth no configurado (falta CLIENT_ID/SECRET)" },
      { status: 500 },
    );
  }
  const redirectUri = new URL("/api/github/callback", req.url).toString();
  const state = await signState("", env.SESSION_SECRET); // sin uid: es login
  return NextResponse.redirect(authorizeUrl(env, redirectUri, state));
}
