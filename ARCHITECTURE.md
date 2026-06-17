# Desktop Translator Tool
## Architecture, UX, and Engineering Guidelines

---

# 1. Project Vision

Build a modern desktop translation tool that is:

- Extremely fast to use (zero friction)
- Accessibility-first
- Keyboard-friendly
- Clean, minimal, and distraction-free
- Powered by Google Translate API (or equivalent service)
- Works cross-platform (Windows / Linux / macOS)

### Core idea:
Translation should feel like "instant mental extension", not an app.

User should be able to:
- Paste text → instantly get translation
- Copy text → auto-translate
- Use global shortcut → translate anywhere
- See results instantly without navigation

---

# 2. Tech Stack

## Frontend

- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand (state management)

## Desktop Layer

- Tauri v2

## Backend

- Rust (Tauri commands)

## Translation Engine

- Google Translate API (primary)
- Fallback: LibreTranslate or DeepL-ready abstraction

## Utilities

- zod (validation)
- hotkeys library (global shortcuts)
- clipboard plugin (Tauri)
- tracing (logging)

---

# 3. Core UX Philosophy

## Principle: "Zero Friction Translation"

User should never think about the app.

Everything should be:

- Instant
- Predictable
- Accessible
- Keyboard-first

---

## UX Goals

### 1. Instant Input → Output

No forms. No extra clicks.

Paste → translate instantly.

---

### 2. Always Visible Output

Translation appears immediately in UI.

No hidden states.

---

### 3. One Primary Action

Everything revolves around:

Translate Now

---

### 4. Keyboard First Design

Every feature must be usable without mouse.

---

### 5. Accessibility First

Must support:

- Screen readers
- High contrast mode
- Keyboard navigation
- Focus states
- Scalable text

Follow WCAG principles.

---

# 4. Core Features

## Feature 1: Instant Translation

```text
Input Text → Auto Detect Language → Translate → Output
```

No submit button required.

---

## Feature 2: Auto Clipboard Translate

If user copies text anywhere:

→ App detects (optional toggle)
→ Automatically translates
→ Shows result

---

## Feature 3: Global Shortcut Translator

Example:

```text
Ctrl + Shift + T
```

Opens mini overlay:

- Paste text
- Instant translation

---

## Feature 4: Language Detection

Auto detect source language:

- English
- Arabic
- French
- Spanish
- etc.

---

## Feature 5: Swap Languages

One-click swap:

EN → AR
AR → EN

Shortcut:

```text
Ctrl + Shift + S
```

---

## Feature 6: History (optional but recommended)

Stores:

- original text
- translated text
- timestamp

---

# 5. Suggested UX Improvements (IMPORTANT)

These make the app "feel premium":

---

## Improvement 1: Floating Mini Translator

A small overlay window:

- always on top
- paste → instant result
- draggable

---

## Improvement 2: Smart Auto Paste

When app opens:

- auto-focus input
- auto-paste clipboard content

---

## Improvement 3: Instant Swap Button

Visual swap animation between languages

---

## Improvement 4: "Quick Copy Result"

One click or auto-copy translated text

---

## Improvement 5: Typing Debounce Translation

Instead of waiting for submit:

- translate after 300ms pause

---

## Improvement 6: Context Mode (future idea)

User can select:

- Formal
- Casual
- Technical
- Simple

---

# 6. System Design

```text
UI Layer (React)
    ↓
Translation Store (Zustand)
    ↓
Translation Service (Tauri Command)
    ↓
Provider Abstraction Layer
    ↓
Google Translate API
```

---

# 7. Architecture Principles

## Clean Architecture

UI must NOT directly call APIs.

All external calls go through Rust backend.

---

## Dependency Rule

Inner layers must not depend on outer layers.

---

## Separation of Concerns

### UI Layer
- rendering
- input handling

### Application Layer
- translation logic flow

### Infrastructure Layer
- Google API
- clipboard
- OS integration

---

# 8. Folder Structure

## Frontend (React)

```
src/
│
├── app/
├── pages/
├── features/
│   ├── translator/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   └── types/
│
├── widgets/
│   ├── translator-panel/
│   ├── history-panel/
│
├── shared/
│   ├── ui/
│   ├── lib/
│   ├── hooks/
│   ├── constants/
│   └── utils/
│
└── main.tsx
```

---

## Backend (Rust / Tauri)

```
src-tauri/
│
├── src/
│
├── domain/
│   ├── models/
│   ├── entities/
│
├── application/
│   ├── use_cases/
│   ├── interfaces/
│   └── dto/
│
├── infrastructure/
│   ├── translation/
│   │   ├── google.rs
│   │   ├── deepl.rs
│   │   └── lib.rs
│   │
│   ├── clipboard/
│   ├── hotkeys/
│   └── storage/
│
├── presentation/
│   ├── commands/
│   └── events/
│
├── shared/
│   ├── errors/
│   ├── utils/
│   └── config/
│
└── main.rs
```

---

# 9. Core Data Flow

## Translation Flow

```text
User Input
   ↓
Normalize Text
   ↓
Detect Language
   ↓
Call Translation API
   ↓
Receive Result
   ↓
Update UI
   ↓
Copy to Clipboard (optional)
   ↓
Store in History
```

---

# 10. State Management

Use Zustand:

```ts
interface TranslatorState {
  inputText: string;
  outputText: string;

  sourceLang: string;
  targetLang: string;

  isLoading: boolean;
  error: string | null;

  history: TranslationItem[];
}
```

---

# 11. Accessibility Requirements (CRITICAL)

## Must Support:

### Keyboard Navigation

- Tab navigation
- Enter to translate
- Escape to clear input
- Shortcuts for swap

---

### Screen Readers

- ARIA labels everywhere
- Output labeled clearly:

"Translated text result"

---

### Contrast

- High contrast mode supported
- No low-contrast gray text

---

### Font Scaling

- Respect system font scaling
- Avoid fixed pixel layouts

---

### Focus States

Every interactive element must have:

- visible focus ring
- consistent styling

---

# 12. UI Design System

## Style

- Minimal
- Rounded
- Soft shadows
- Calm colors

---

## Layout

```
┌────────────────────────────┐
│ Translator                 │
├────────────────────────────┤
│ [ Input Text Area       ]  │
│                            │
│                            │
├───────────────┬────────────┤
│ EN ▼          │ AR ▼       │
│ Swap          │            │
├───────────────┴────────────┤
│ Output Text Area           │
│                            │
├────────────────────────────┤
│ Copy   Paste   Clear       │
└────────────────────────────┘
```

---

# 13. Performance Requirements

- Translation under 300ms (API dependent)
- UI must never freeze
- Debounced input
- Cache repeated translations
- Minimal re-renders

---

# 14. Error Handling

Must handle:

- No internet
- API failure
- Rate limiting
- Empty input
- Unsupported language

Never crash app.

Always show friendly message:

"Translation failed. Try again."

---

# 15. Clipboard Integration

Rules:

- Only copy when user enables auto-copy
- Never spam clipboard
- Compare previous output before copying

---

# 16. Hotkeys System

Global shortcuts:

| Action | Shortcut |
|--------|----------|
| Open translator | Ctrl + Shift + T |
| Swap languages | Ctrl + Shift + S |
| Clear input | Ctrl + Shift + C |

---

# 17. Logging

Log:

- translation requests
- failures
- API latency
- shortcut triggers

---

# 18. Testing Strategy

Unit Tests:

- language detection
- normalization
- caching logic

Integration Tests:

- full translation pipeline

UI Tests:

- input → output flow

---

# 19. Future Features (IMPORTANT)

Design must support:

### AI Enhancements

- Context-aware translation
- Tone control (formal/casual)
- Grammar correction

---

### Speech

- text-to-speech
- speech-to-text

---

### OCR Integration

- translate screen text directly

---

### Offline Mode

- local translation model

---

### Plugins System

Allow adding:

- DeepL
- OpenAI translation
- custom APIs

---

# 20. Definition of Done

Feature is complete only if:

✔ Fully typed  
✔ Accessible  
✔ Keyboard usable  
✔ No UI blocking  
✔ Clean architecture respected  
✔ Modular structure  
✔ Error handled  
✔ Logging added  
✔ Works cross-platform  
✔ No duplicated logic  

---

# 21. Core Screens

## Screen 1 — Main Translator (Primary)

```
┌────────────────────────────────────┐
│ Instant Translate                  │
├────────────────────────────────────┤
│                                    │
│  [ INPUT TEXT AREA ]              │
│  (auto focus on open)             │
│                                    │
├──────────────┬─────────────────────┤
│ EN ▼         │ AR ▼               │
│ Swap ⟲       │                    │
├──────────────┴─────────────────────┤
│                                    │
│  [ OUTPUT TEXT AREA ]             │
│  (auto updated)                   │
│                                    │
├────────────────────────────────────┤
│ Copy | Paste | Clear | Speak       │
└────────────────────────────────────┘
```

UX Notes:
- Input auto-focused on launch
- Output updates instantly
- Swap animation is smooth (200ms)
- Copy button highlights on success

---

## Screen 2 — Floating Overlay Mode

Purpose: Fast translation anywhere on system

```
┌──────────────────────────┐
│ Quick Translate          │
├──────────────────────────┤
│ [ paste / type ]        │
│                         │
│ ----------------------  │
│ Output appears here     │
├──────────────────────────┤
│ EN → AR   [Swap]        │
└──────────────────────────┘
```

Behavior:
- Opens via shortcut
- Always on top
- Closes on Escape
- Auto-pastes clipboard content

---

## Screen 3 — History (Optional)

```
┌────────────────────────────┐
│ Translation History        │
├────────────────────────────┤
│ EN → AR                   │
│ Hello → مرحبا            │
│ 10:42 AM                 │
├────────────────────────────┤
│ EN → FR                   │
│ ...                      │
└────────────────────────────┘
```

---

## Screen 4 — Settings

```
┌────────────────────────────┐
│ Settings                  │
├────────────────────────────┤
│ Shortcuts                │
│ Clipboard Auto Copy: ON  │
│ History: ON              │
│ Theme: Dark              │
│ Accessibility           │
└────────────────────────────┘
```

---

# 22. Component Spec

## Core Components

### Input Panel
- TextArea (auto expand)
- placeholder: "Paste text..."

### Output Panel
- Read-only text block
- Copy button
- Optional speak button

### Language Selector
- Dropdown (source)
- Dropdown (target)
- Swap button between them

### Action Bar
- Copy
- Paste
- Clear
- Speak

### Status Indicator
- Ready / Loading / Error
- Small badge style

---

# 23. Design System

## Colors

- **Primary:** Blue accent for actions
- **Success:** Green (copy success)
- **Error:** Red (fail states)
- **Neutral:** Gray backgrounds

## Typography
- Font: Inter
- Sizes: 12px (labels), 14px (body), 16px (input), 20px (headers)

## Spacing System
- 4px base unit
- 8 / 12 / 16 / 24 / 32

## Radius
- 8px (inputs)
- 12px (cards)
- 16px (overlay)

## Shadows
- Soft elevation
- No heavy drop shadows

---

# 24. Interaction Design

## Input Behavior
- Typing triggers debounce (300ms)
- Instant translation after pause
- No submit button

## Swap Animation
- Smooth slide transition
- 200–250ms easing

## Copy Feedback
- Button turns green briefly
- Optional toast: "Copied"

## Loading State
- Subtle shimmer in output
- No blocking UI

---

# 25. Accessibility Spec (CRITICAL)

## Keyboard Navigation

| Action | Key |
|--------|-----|
| Translate | Enter |
| Swap languages | Ctrl + Shift + S |
| Clear input | Ctrl + Shift + C |
| Open overlay | Ctrl + Shift + T |
| Close overlay | Esc |

## Screen Reader Rules
- Input labeled
- Output labeled
- Buttons descriptive
- Status announced

## Contrast
- Minimum WCAG AA compliance
- No low-contrast gray text

## Focus States
- Visible ring
- Never removed

## Motion
- Respect "reduce motion" OS setting

---

# 26. User Flows

## Flow 1: Normal Translation
1. Open app
2. Paste text
3. Wait 300ms
4. See translation
5. Copy if needed

## Flow 2: Quick Overlay Translation
1. Press shortcut
2. Overlay opens
3. Paste text
4. Instant result
5. Close overlay

## Flow 3: System Copy Translate
1. Copy text anywhere
2. App detects clipboard change
3. Translation appears
4. Optional auto-copy result

---

# 27. Edge Cases

- Empty input → no API call
- No internet → show error state
- API timeout → retry option
- Unsupported language → fallback detection
- Rapid typing → debounce prevents spam requests

---

# 28. Performance Requirements

- No UI blocking
- Debounced API calls
- Cached repeated translations
- Instant UI updates
- Minimal re-renders

---

# 29. Error States

## Types
- Network error
- API error
- Rate limit
- Invalid input

## UX Behavior
- Show inline message
- Never crash UI
- Provide retry button

---

# 30. Future UX Extensions

- AI tone rewriting (formal/casual)
- Speech input/output
- OCR translation mode
- Multi-window sync
- Plugin system (DeepL, OpenAI, etc.)
- Translation suggestions
- Word breakdown mode (learning mode)

---

# 31. Success Metrics

- Time to first translation < 1s
- 80%+ keyboard usage
- <1% error rate
- High repeat usage (daily tool behavior)

---

# 32. Definition of Done

- Fully accessible (WCAG AA)
- Keyboard complete
- Zero UI blocking
- Clean architecture
- Modular components
- Cross-platform working
- No duplicated logic
- Smooth UX interactions
