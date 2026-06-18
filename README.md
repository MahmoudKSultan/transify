<div align="center">
  <img src="src-tauri/icons/icon.png" width="128" height="128" alt="Transify icon">
  <h1>Transify</h1>
  <p><strong>Cross-platform desktop translator</strong> — built with Tauri, React, and Rust</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#screenshots">Screenshots</a> •
    <a href="#installation">Installation</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#roadmap">Roadmap</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/v/release/MahmoudKSultan/transify?style=flat-square&label=version" alt="Version">
    <img src="https://img.shields.io/github/license/MahmoudKSultan/transify?style=flat-square" alt="License">
    <img src="https://img.shields.io/badge/tauri-v2-blueviolet?style=flat-square&logo=tauri" alt="Tauri v2">
    <img src="https://img.shields.io/badge/react-18-blue?style=flat-square&logo=react" alt="React 18">
    <img src="https://img.shields.io/badge/typescript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/rust-1.70+-orange?style=flat-square&logo=rust" alt="Rust">
    <img src="https://img.shields.io/badge/platform-linux%20|%20windows%20|%20macos-lightgrey?style=flat-square" alt="Platform">
  </p>
</div>

A fast, accessible translation app that lives in your system tray. Select text in any app, press **Ctrl+T**, and get an instant translation — no API key required.

> **Select → Ctrl+T → Translate** — works on Linux, Windows, and macOS.

## Features

- **Select & Translate** — select text in any application, press `Ctrl+T`, Transify copies the text and translates it
- **Global Shortcut** — `Ctrl+T` works system-wide; on Wayland it uses direct input listening (`rdev`)
- **Screenshot OCR Translation** *(coming soon)* — capture a screen region, extract text, and translate it
- **Instant Translation** — type or paste text, translation appears after 300ms debounce
- **Auto Language Detection** — Google Translate detects source language automatically
- **Editable Shortcuts** — customize every shortcut from Settings (Ctrl+T, Ctrl+S, Ctrl+Shift+C, etc.)
- **Theming** — Light, Dark, and System themes, plus High Contrast Mode (WCAG AA)
- **Translation History** — all translations saved locally with timestamps
- **Auto-copy Result** — optional toggle to copy translated text to clipboard
- **Fully Keyboard Navigable** — every feature works without a mouse
- **Screen Reader Friendly** — ARIA labels, focus states, proper landmarks

## Screenshots

> *Screenshots coming soon. Transify has a clean, minimal interface with input panel, language selector, output panel, and action toolbar.*

```
┌──────────────────────────────────┐
│  Transify                        │
├──────────────────────────────────┤
│  Source Text                     │
│  ┌────────────────────────────┐  │
│  │  Hello world               │  │
│  │                            │  │
│  └────────────────────────────┘  │
├─────────────┬────────────────────┤
│  Auto ▼     │  Arabic ▼    ⟲    │
├─────────────┴────────────────────┤
│  Translated Text                 │
│  ┌────────────────────────────┐  │
│  │  مرحباً بالعالم            │  │
│  └────────────────────────────┘  │
├──────────────────────────────────┤
│  📷 Capture  [Translate]  Copy  │
└──────────────────────────────────┘
```

## Installation

### Download the latest release

| Platform | Format | Download |
|----------|--------|----------|
| Linux | AppImage | [Transify-0.1.0-x86_64.AppImage](https://github.com/MahmoudKSultan/transify/releases) |
| Linux | .deb (Debian/Ubuntu) | [Transify_0.1.0_amd64.deb](https://github.com/MahmoudKSultan/transify/releases) |
| Linux | .rpm (Fedora/RHEL) | [Transify-0.1.0-1.x86_64.rpm](https://github.com/MahmoudKSultan/transify/releases) |

### Linux (AppImage — portable)

```bash
chmod +x Transify-0.1.0-x86_64.AppImage
./Transify-0.1.0-x86_64.AppImage
```

### Debian / Ubuntu

```bash
sudo dpkg -i Transify_0.1.0_amd64.deb
transify
```

### Fedora / RHEL

```bash
sudo rpm -i Transify-0.1.0-1.x86_64.rpm
transify
```

### Build from source

**Prerequisites:** [Rust](https://rustup.rs/), [Node.js](https://nodejs.org/) 18+, [Tauri system deps](https://v2.tauri.app/start/prerequisites/)

```bash
git clone https://github.com/MahmoudKSultan/transify.git
cd transify
npm install
npx tauri build
```

Artifacts are in `src-tauri/target/release/bundle/`.

## Usage

### Quick Start

1. Launch Transify
2. Type or paste text — translation appears automatically
3. Use **Ctrl+T** from any app to translate clipboard content
4. Use **Ctrl+S** to swap languages
5. Use **Ctrl+Shift+C** to clear input

### Global Shortcut (Ctrl+T)

The global shortcut lets you translate text from any application:

1. **Select text** in your browser, editor, or terminal
2. **Press Ctrl+T** — Transify copies the text and opens to show the translation
3. **Done** — the translated text appears in the output panel

> **Note on Wayland:** If you're on GNOME Wayland, run `sudo usermod -a -G input $USER && reboot` for the global shortcut to work system-wide.

### Screenshot OCR Translation

> *This feature is in development. Track progress on the `feature/screenshot-translation` branch.*

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     UI Layer (React)                     │
│  ┌──────────┐  ┌───────┐  ┌─────────┐  ┌──────────┐   │
│  │ Translator│  │History│  │Settings │  │ Screenshot│   │
│  │  Panel    │  │ Panel │  │  Panel  │  │  OCR      │   │
│  └─────┬────┘  └───┬───┘  └────┬────┘  └─────┬────┘   │
│        └───────────┴───────────┴──────────────┘        │
│                        │                                │
│              ┌─────────▼──────────┐                      │
│              │   Zustand Store    │                      │
│              └─────────┬──────────┘                      │
│                        │                                │
│              ┌─────────▼──────────┐                      │
│              │  Tauri IPC (invoke)│                      │
│              └─────────┬──────────┘                      │
├────────────────────────┼────────────────────────────────┤
│              ┌─────────▼──────────┐                      │
│              │    Rust Backend    │                      │
│              │  (Tauri Commands)  │                      │
│              └─────────┬──────────┘                      │
├────────────────────────┼────────────────────────────────┤
│  ┌──────────┐  ┌───────▼────┐  ┌──────────────────┐    │
│  │Google    │  │   OCR      │  │   Screen Capture  │    │
│  │Translate │  │  Provider  │  │   (future)        │    │
│  │  API     │  │ (Tesseract)│  │                   │    │
│  └──────────┘  └────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
transify/
├── src/                          # React frontend
│   ├── app/                      # Root App component
│   ├── features/
│   │   ├── translator/           # Core translation feature
│   │   │   ├── components/       # Translator, InputPanel, OutputPanel, etc.
│   │   │   ├── hooks/            # useKeyboardShortcuts, useGlobalShortcut, etc.
│   │   │   ├── store/            # Zustand state
│   │   │   ├── services/         # Translation API calls
│   │   │   └── types/            # TS types & constants
│   │   └── screenshot-translation/  # (coming soon)
│   ├── widgets/                  # Panel components
│   ├── shared/                   # UI primitives, utils, constants
│   └── main.tsx
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── domain/               # Domain models & entities
│   │   ├── application/          # Use cases & interfaces
│   │   ├── infrastructure/       # Google Translate, clipboard
│   │   └── presentation/         # Tauri commands, key listener
│   ├── icons/                    # App icons (all platforms)
│   └── tauri.conf.json
├── app-icon.svg                  # Source icon
└── test-highlight-to-translate.sh # QA test suite (37 tests)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Desktop Shell** | [Tauri v2](https://v2.tauri.app/) |
| **Frontend** | React 18, TypeScript, TailwindCSS, Zustand |
| **Backend** | Rust, arboard (clipboard), rdev (key listener) |
| **Translation** | Google Translate (free, no API key) |
| **OCR** | Tesseract (planned) |
| **UI Components** | Radix UI, Lucide icons |

## Keyboard Shortcuts

| Action | Default | Customizable |
|--------|---------|:------------:|
| Translate clipboard | `Ctrl+T` | ✓ |
| Swap languages | `Ctrl+S` | ✓ |
| Clear input | `Ctrl+Shift+C` | ✓ |
| Focus input | `Ctrl+L` | ✓ |
| Enter to translate | `Enter` | — |
| Capture & translate (OCR) | `Ctrl+Shift+O` | ✓ *(planned)* |

## Roadmap

- [x] Text translation with Google Translate
- [x] Global shortcut (Ctrl+T) for instant translate
- [x] Accessibility-first UI (WCAG AA)
- [x] Customizable keyboard shortcuts
- [x] Translation history
- [x] Light/dark/high-contrast themes
- [ ] **Screenshot OCR translation** — capture region → OCR → translate
- [ ] Multi-language OCR (Arabic, French, German, etc.)
- [ ] Floating mini-translator overlay
- [ ] OCR history with image previews
- [ ] Text-to-speech (pronunciation)
- [ ] Offline translation mode
- [ ] AI summarization & tone rewriting
- [ ] Plugin system (DeepL, OpenAI, LibreTranslate)

## Development

```bash
# Frontend only (hot reload)
npm run dev            # → http://localhost:5180

# Full Tauri app
npx tauri dev          # Hot reload frontend + Rust

# Build production
npx tauri build

# Run QA tests
bash test-highlight-to-translate.sh
```

The dev server runs on port **5180** to avoid conflicts.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

Please run `bash test-highlight-to-translate.sh` before submitting.

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
  <p>Built with ❤️ using Tauri, React, and Rust</p>
  <p>
    <a href="https://github.com/MahmoudKSultan/transify/issues">Report Bug</a> •
    <a href="https://github.com/MahmoudKSultan/transify/discussions">Discussion</a> •
    <a href="https://github.com/MahmoudKSultan/transify/releases">Releases</a>
  </p>
</div>
