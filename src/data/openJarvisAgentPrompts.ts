import type { GuideAgentPrompt } from '../types/index.ts';

const sharedSetupInstructions = `GOAL
Set up OpenJarvis as a local-first personal AI assistant on this computer, then verify that it works. I want the default setup to run locally using the machine's own hardware. Do not use a hosted model, paid API, or third-party voice service.

WORK IN STAGES — DO NOT RUSH
1. INSPECT FIRST, WITHOUT CHANGING ANYTHING
   - Identify the operating system and version, CPU architecture, shell, available RAM, free disk space, and GPU/accelerator if present.
   - Check whether OpenJarvis, Ollama, Git, and the required runtimes are already installed. Do not print environment-variable values, tokens, API keys, or other secrets.
   - If any OpenAI, Anthropic, Google, or OpenRouter API-key environment variable is present, report only that a key appears to be configured (never reveal its value), because OpenJarvis may use a configured cloud provider instead of its local-first default.
   - Check the latest official OpenJarvis installation instructions before deciding the path:
     https://open-jarvis.github.io/OpenJarvis/getting-started/install/
     https://open-jarvis.github.io/OpenJarvis/getting-started/macos/
     https://open-jarvis.github.io/OpenJarvis/getting-started/wsl2/
     https://open-jarvis.github.io/OpenJarvis/getting-started/windows-native/
2. SHOW ME A SHORT PLAN AND WAIT FOR MY APPROVAL BEFORE INSTALLING
   Explain the platform-specific route, prerequisites, approximate disk/model download needs, and every system-level change. Do not run installation commands until I approve the plan.
3. USE THE CORRECT OFFICIAL INSTALL ROUTE
   - macOS / Linux: use the official Bash installer from open-jarvis.github.io:
     curl -fsSL https://open-jarvis.github.io/OpenJarvis/install.sh | bash
   - Windows native PowerShell (Windows 10/11): use the official PowerShell installer:
     irm https://open-jarvis.github.io/OpenJarvis/install.ps1 | iex
     First verify the documented prerequisites (Windows 10 1809+ or Windows 11, Python 3.11–3.13, Git on PATH, and about 5 GB free disk). The standard native CLI installer installs uv if missing; do not require MSVC build tools for this route. If a prerequisite is missing, explain how to install it and ask before making changes.
   - Windows via WSL2: this is the recommended, smoother Windows route in the current OpenJarvis docs. Install Ubuntu only if needed and approved, then run the official Bash installer inside Ubuntu. Models are stored in the WSL filesystem, not your Windows drive. Never run the Bash installer from native PowerShell, Git Bash, MSYS2, or Cygwin.
   - Treat native Windows PowerShell as the advanced alternative when the user wants to avoid WSL2; do not confuse the CLI installer prerequisites with the separate Windows ARM64 desktop build prerequisites.
   - Do not invent flags or use unofficial mirrors/domains. Do not run the installer as root or with sudo. Prefer reviewing the official installer source before execution and explain what it changes.
4. PROTECT MY MACHINE AND DATA
   - Do not overwrite, uninstall, reset, or upgrade an existing OpenJarvis/Ollama setup without asking first.
   - Do not delete existing models, Python versions, packages, files, or configuration.
   - Do not run destructive commands, change execution policy permanently, disable security protections, expose ports to the network, or install an always-on/background service unless I explicitly approve.
   - Ask before using administrator privileges, sudo, or any command that changes system-wide settings.
   - If the installer asks about analytics or optional usage sharing, choose No. Do not enable analytics.
   - Do not connect email, calendar, messaging, or other personal accounts.
5. CONFIGURE LOCAL MODEL AND VERIFY
   - Keep the local inference backend selected. Use the installer's hardware-aware starter configuration (currently it may pull qwen3.5:2b) unless the official docs and detected hardware clearly justify another local model. Explain larger model download/storage needs and ask before downloading one.
   - Do not put API keys into config files. Do not switch to a cloud provider.
   - After installation, verify with the documented health/diagnostic commands (for example, jarvis --version and jarvis doctor). Start a basic local text chat and confirm that a response is produced.
   - If the jarvis command is not found, follow the official PATH troubleshooting instructions; do not reinstall blindly.
6. OPTIONAL VOICE SETUP
   - Once text chat works, check the current official voice/chat documentation and identify the supported microphone and text-to-speech setup for this OS.
   - Prefer a local voice backend such as Kokoro when officially supported. Do not use ElevenLabs, hosted TTS, or any paid API.
   - Show the additional packages, model downloads, microphone permissions, and commands first, then ask me before installing optional voice dependencies. Verify voice input and spoken output only after approval.
7. FINISH WITH A CLEAR REPORT
   Tell me what was installed, where it was installed, which local model and inference backend are configured, whether analytics are off, which verification checks passed, how to start/stop it, and any remaining limitations. Include the exact commands I can reuse.

Do not claim success unless the relevant command or health check actually passed. If something fails, stop at that step, explain the error, and suggest the safest next action.`;

export const openJarvisAgentPrompts: GuideAgentPrompt[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Copy this into Claude Code with terminal access enabled.',
    prompt: `You are Claude Code, helping me install and verify OpenJarvis on my own computer. Use your terminal tools to inspect the environment, explain each action, and work only on the OpenJarvis installation. Do not edit unrelated project files.

${sharedSetupInstructions}`,
  },
  {
    id: 'codex',
    name: 'Codex',
    description: 'Copy this into Codex in a local coding-agent session.',
    prompt: `You are Codex acting as my local setup agent. First produce a concise inspection and execution plan. Use the terminal only for the approved OpenJarvis setup; do not modify the current repository or unrelated workspace files. Keep commands small, inspect their output, and stop when approval is needed.

${sharedSetupInstructions}`,
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    description: 'Copy this into Antigravity Agent mode with terminal access.',
    prompt: `You are Google Antigravity working in Agent mode as my local setup assistant. Use the terminal to inspect this computer, present a clear plan, and then carry out only the steps I approve. Keep the work scoped to installing and verifying OpenJarvis; do not edit unrelated workspace files or silently approve privileged/system changes.

${sharedSetupInstructions}`,
  },
];
