import { cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptsDirectory, "..");
const frontendBuild = path.join(projectRoot, "frontend", "dist");
const stagedBuild = path.join(projectRoot, "dist");

await rm(stagedBuild, { recursive: true, force: true });
await cp(frontendBuild, stagedBuild, { recursive: true });

console.log("Staged the frontend server build in dist/ for hosting.");
