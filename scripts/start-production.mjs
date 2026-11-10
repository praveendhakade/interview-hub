import { cp, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const project = process.cwd();
const standalone = resolve(project, ".next/standalone");
await mkdir(resolve(standalone, ".next"), { recursive: true });
await cp(resolve(project, ".next/static"), resolve(standalone, ".next/static"), { recursive: true, force: true });
await cp(resolve(project, "public"), resolve(standalone, "public"), { recursive: true, force: true });

const server = spawn(process.execPath, ["server.js"], {
  cwd: standalone,
  env: { ...process.env, HOSTNAME: process.env.HOSTNAME ?? "0.0.0.0", PORT: process.env.PORT ?? "3000" },
  stdio: "inherit",
  windowsHide: true,
});

server.once("error", (error) => {
  console.error("Could not start the production server:", error);
  process.exitCode = 1;
});
server.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => server.kill(signal));
}
