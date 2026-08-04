# ECG-QI

Prototype ECG quality-improvement workflow for Waterloo Regional Health
Network. It separates clinician and expert-review workspaces and includes case
submission, simulated AI comparison, expert adjudication, learning feedback,
and aggregate reporting.

All records and ECG traces are synthetic. This project is for demonstration
and education, not clinical diagnosis.

## Repository layout

The project intentionally uses a small number of files. Each tracked file has a
specific job:

| Location | Purpose |
| --- | --- |
| `app/EcgQiApp.tsx` | Application shell, upload workflow, role-based navigation, and page views |
| `app/data.ts` | Mock cases, chart data, shared domain types, and simulated AI data |
| `app/globals.css` | All visual styles and responsive rules |
| `app/[[...slug]]/page.tsx` | One catch-all route that serves every app screen |
| `app/layout.tsx` | Site metadata, fonts, favicon, and root HTML layout |
| `worker/index.ts` | Small Cloudflare/Sites runtime adapter |
| `vite.config.ts` | Shared build configuration for Sites and GitHub Pages |
| `index.html` | Static entry point used only by GitHub Pages |
| `tests/rendered-html.test.mjs` | Smoke tests for login and deep-linked routes |

The remaining root files are standard package, TypeScript, hosting, and
deployment configuration. Do not combine the files above merely to reduce the
count: their separation keeps mock data, interface code, styling, and hosting
concerns easy to find.

## Where to make changes

- Change sample patients, diagnoses, charts, or AI fixtures in `app/data.ts`.
- Change workflow behavior, pages, navigation, or local state in
  `app/EcgQiApp.tsx`.
- Change colors, spacing, layout, or responsive behavior in `app/globals.css`.
- Add a new source file only when it represents a distinct reusable feature or
  domain. Small page-specific components should stay in `app/EcgQiApp.tsx`.

This is a front-end prototype. Submitted cases are held in React memory and
reset when the page reloads. If persistent multi-user data is added later, keep
the UI structure and replace the in-memory submission functions in `Shell`
with a small server-backed data layer.

## Run locally

Requires Node.js 22 or newer.

```bash
corepack enable
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm dev          # local development server
pnpm build        # production Sites build
pnpm build:pages  # static GitHub Pages build
pnpm test         # production build plus route smoke tests
```

## Run in GitHub Codespaces

1. Open the repository on GitHub.
2. Select **Code** → **Codespaces** → **Create codespace on main**.
3. In the Codespaces terminal, run:

```bash
nvm install 22
nvm use 22
corepack enable
pnpm install
pnpm dev --host 0.0.0.0
```

4. When Codespaces reports that port `3000` is available, select **Open in
   Browser**. If the notification is dismissed, open the **Ports** tab, find
   port `3000`, and select its globe icon.

Keep the terminal process running while using the app. Stop it with `Ctrl+C`.
To get later repository changes, run `git pull` before starting the app again.

If the Codespace must be shared with someone else, open the **Ports** tab,
right-click port `3000`, choose **Port Visibility**, and set it to **Public**.
The public URL remains available only while the Codespace and development
server are running.
