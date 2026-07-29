# ECG-QI

Prototype ECG quality-improvement workflow for Waterloo Regional Health
Network. It separates clinician and expert-review workspaces and includes case
submission, simulated AI comparison, expert adjudication, learning feedback,
and aggregate reporting.

All records and ECG traces are synthetic. This project is for demonstration
and education, not clinical diagnosis.

## Run locally

Requires Node.js 22 or newer.

```bash
corepack enable
pnpm install
pnpm dev
```

Use `pnpm build` for a production build and `pnpm test` for the route smoke
tests.

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
