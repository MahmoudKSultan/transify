# Transify

A modern desktop translation tool built with **Tauri v2**, **React**, and **Rust**. Translate text instantly with a global shortcut — no API key required.

<p align="center">
  <img src="src-tauri/icons/icon.png" width="128" height="128" alt="Transify icon: two speech bubbles with A and 文 characters">
</p>

## Features

- **Instant translation** — paste or type text, translation appears immediately (300ms debounce)
- **Select → Ctrl+T → Translate** — select text in any app, press `Ctrl+T`, get the translation. No manual copy needed.
- **Global shortcut** — `Ctrl+T` works even when Transify is not focused (on X11/XWayland; on Wayland via `rdev` + `input` group)
- **Language auto-detection** — Google Translate detects the source language automatically
- **Language swap** — one-click swap between source/target languages
- **Translation history** — all translations are saved locally
- **Theming** — light, dark, and system theme — plus high contrast mode for accessibility
- **Auto-copy result** — optional toggle to copy translated text to clipboard automatically
- **Fully keyboard navigable** — all features accessible without a mouse
- **Screen reader friendly** — ARIA labels, focus states, and WCAG AA compliant
- **Editable shortcuts** — customize keyboard shortcuts from Settings (Ctrl+T, Ctrl+S, etc.)

## How It Works

1. **Select text** in any application (browser, terminal, editor)
2. **Press Ctrl+T** — Transify detects the shortcut, copies the selected text, reads it from clipboard, and translates it
3. **Result appears** instantly in the Transify window

No API key needed. The app uses the free Google Translate endpoint (`translate.googleapis.com`).

## Installation

### Option 1: AppImage (portable, recommended)

```bash
chmod +x Transify_0.1.0_amd64.AppImage
./Transify_0.1.0_amd64.AppImage
```

### Option 2: Debian / Ubuntu

```bash
sudo dpkg -i Transify_0.1.0_amd64.deb
transify
```

### Option 3: Fedora / RHEL

```bash
sudo rpm -i Transify-0.1.0-1.x86_64.rpm
transify
```

## Building from Source

### Prerequisites

- [Rust](https://rustup.rs/) (1.70+)
- [Node.js](https://nodejs.org/) (18+)
- [Tauri v2 system dependencies](https://v2.tauri.app/start/prerequisites/)

### Build

```bash
git clone <repo-url>
cd transify
npm install
npx tauri build
```

Build artifacts will be in `src-tauri/target/release/bundle/`.

## Development

```bash
npm install
npm run dev        # Vite frontend on http://localhost:5180
npx tauri dev      # Full Tauri app with hot reload
```

The dev server runs on **port 5180** (configured to avoid conflicts).

## Keyboard Shortcuts

| Action | Default | Customizable |
|--------|---------|-------------|
| **Translate clipboard** | `Ctrl+T` | Yes |
| **Swap languages** | `Ctrl+S` | Yes |
| **Clear input** | `Ctrl+Shift+C` | Yes |
| **Focus input** | `Ctrl+L` | Yes |
| **Translate (Enter)** | `Enter` | No |

All shortcuts can be remapped in **Settings → Shortcuts**.

## Architecture

```
UI Layer (React + Zustand)
    ↓
Tauri IPC (invoke commands)
    ↓
Application Layer (Rust use-cases)
    ↓
Infrastructure (Google Translate API)
```

### Project Structure

```
src/                    # React frontend
├── features/translator # Translator domain
├── widgets/            # Panel components
├── shared/             # UI primitives, utils, constants
└── app/                # Root app component

src-tauri/              # Rust backend
├── src/domain/         # Domain models & entities
├── src/application/    # Use cases & interfaces
├── src/infrastructure/ # Google Translate, clipboard
└── src/presentation/   # Tauri commands, key listener
```

## Global Shortcut on Wayland

Tauri's global shortcut plugin does not work on GNOME Wayland. Transify uses the `rdev` crate as a fallback to listen for `Ctrl+T` at the OS input level. If you're on Wayland, you may need:

```bash
sudo usermod -a -G input $USER
# then reboot
```

## Tech Stack

- **Desktop shell:** [Tauri v2](https://v2.tauri.app/)
- **Frontend:** React 18, TypeScript, TailwindCSS, Zustand
- **Backend:** Rust, arboard, rdev
- **Translation:** Google Translate (free, no API key)

## License

MIT
