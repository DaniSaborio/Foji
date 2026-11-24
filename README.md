# Fōji — Gestión de Proyectos (`FORGE/SH`)

Plataforma de gestión de proyectos de ingeniería de **FORGE/SH** (`forge-sh.dev`), enfocada en la planificación, ejecución y seguimiento integral de proyectos:

1. **Tablero Kanban de ideas y proyectos** (`idea` → `en_progreso` → `listo` → `pausado`).
2. **Gestión de Sprints y Tareas** por proyecto (`por_hacer`, `en_progreso`, `revision`, `hecho`) con backlog e importación/creación directa de issues de GitHub.
3. **Integración con GitHub (OAuth + GitHub App)** para creación de repositorios, sincronización de issues/milestones y cálculo automático de progreso.
4. **Bug Tracker global** por prioridad y estado, vinculable a proyectos e issues de GitHub.
5. **Mini-CRM de clientes** (relación N:N con proyectos).
6. **Portal público del cliente** de solo lectura con etapa actual, barra de progreso, línea de tiempo y chat en tiempo real.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Cloudflare Workers** vía **`@opennextjs/cloudflare`** (OpenNext)
- **Cloudflare D1** (SQLite) + **Drizzle ORM** para esquema y migraciones
- **Durable Objects** (WebSockets nativos con hibernación) para el chat en tiempo real
- **R2** declarado (binding `FILES`) para almacenamiento de archivos
- **Tailwind CSS** (Paleta oficial `FORGE/SH`: Obsidian Void, Forge Violet, Neon Magenta, Electric Cyan)
- Autenticación: OAuth con GitHub + cookie de sesión firmada (`foji_session`, HMAC-SHA256) + WebCrypto PBKDF2-SHA256 nativo

## Arquitectura clave

Next/OpenNext no maneja upgrades WebSocket directamente. Por eso el `main` del Worker es **`worker.ts`** (patrón "custom worker" de OpenNext), que:

1. Re-exporta el Durable Object `ChatRoom`.
2. Intercepta `GET /api/chat` con `Upgrade: websocket`, **autentica** (token público para el cliente, cookie de sesión para el socio) y reenvía la conexión al DO del proyecto (`env.CHAT_ROOM.idFromName(projectId)`).
3. Delega el resto de peticiones al handler generado por OpenNext (`.open-next/worker.js`).

Los mensajes se transmiten por el DO **y** se persisten en D1 (`mensajes_chat`), de modo que el historial sobrevive a la hibernación del DO.

## Módulos

| Módulo | Ubicación |
|---|---|
| 1. Auth interna & GitHub OAuth | `src/lib/{password,session,auth,github-oauth}.ts`, `src/app/api/auth/*`, `src/app/login` |
| 2. Kanban ideas/proyectos | `src/app/admin/kanban`, `src/widgets/kanban-board` (drag-and-drop nativo HTML5) |
| 3. Sprints y Tareas | `src/widgets/sprint-board`, `src/server/services/sprint.service.ts` |
| 4. Integración GitHub (App + OAuth) | `src/lib/{github-app,github-oauth}.ts`, `src/app/api/webhooks/github` |
| 5. Gestión de proyectos | `src/app/admin/proyectos/[id]` (sprints, etapas, progreso, link público, clientes) |
| 6. Bug Tracker | `src/app/admin/bugs`, `src/widgets/bugs-list` |
| 7. Mini-CRM clientes | `src/app/admin/clientes` (relación N:N con proyectos) |
| 8. Vista pública cliente | `src/app/p/[token]` (roadmap + progreso + chat, rate-limit por IP) |
| 9. Chat en tiempo real | `src/durable-objects/chat-room.ts`, `worker.ts`, inbox en `src/app/admin` |
| 10. Notificaciones | `src/lib/notifications.ts` (Telegram; canales pluggables) |

## Puesta en marcha (local)

```bash
pnpm install

# 1. Variables de entorno locales
cp .dev.vars.example .dev.vars   # edita SESSION_SECRET y credenciales de seed

# 2. Migraciones sobre la D1 local
pnpm db:migrate:local

# 3. Sembrar los socios + etapas por defecto (lee de .dev.vars)
pnpm seed

# 4a. Desarrollo de UI (rápido, SIN chat WebSocket — next dev no usa worker.ts)
pnpm dev

# 4b. Preview COMPLETO (worker.ts real: chat, DO, WS) sobre la build de Cloudflare
pnpm cf:preview
```

> El chat en tiempo real solo funciona con `cf:preview` / `cf:deploy` (que usan `worker.ts`), no con `pnpm dev`.

## Despliegue

```bash
# 1. Crear los recursos una sola vez
wrangler d1 create foji-db        # copia el database_id a wrangler.jsonc
wrangler r2 bucket create foji-files

# 2. Migraciones + seed en remoto
pnpm db:migrate:remote
pnpm seed -- --remote

# 3. Secrets de producción
wrangler secret put SESSION_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put GITHUB_APP_ID
wrangler secret put GITHUB_APP_PRIVATE_KEY
wrangler secret put GITHUB_WEBHOOK_SECRET
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID

# 4. Deploy
pnpm cf:deploy
```

## Esquema de datos

`src/db/schema.ts` (Drizzle). Entidades principales:
- `usuarios`
- `github_cuentas`
- `clientes`
- `etapas`
- `proyectos`
- `proyecto_clientes` (pivote N:N)
- `ideas_comentarios`
- `eventos_progreso`
- `mensajes_chat`
- `bugs`
- `sprints`
- `tareas`
