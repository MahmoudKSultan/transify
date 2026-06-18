#!/usr/bin/env bash
set -euo pipefail

PASS=0
FAIL=0

pass() {
    PASS=$((PASS + 1))
    echo "  ✓ $1"
}

fail() {
    FAIL=$((FAIL + 1))
    echo "  ✗ $1"
}

check() {
    local desc="$1" cmd="$2" expected="$3"
    local out; out=$(eval "$cmd" 2>/dev/null || true)
    if echo "$out" | grep -q "$expected"; then
        pass "$desc"
    else
        fail "$desc  (expected: $expected, got: $out)"
    fi
}

echo "=== Transify Highlight-to-Translate: QA Tests ==="
echo ""

echo "--- Files & Build ---"

check "global_key_listener.rs exists" \
    "ls src-tauri/src/presentation/global_key_listener.rs 2>&1" \
    "global_key_listener.rs"

check "no clipboard_watcher.rs" \
    "ls src-tauri/src/presentation/clipboard_watcher.rs 2>&1 || echo 'MISSING'" \
    "MISSING"

check "no isAutoTranslate in store" \
    "grep -c 'isAutoTranslate' src/features/translator/store/index.ts 2>/dev/null || echo 0" \
    "0"

check "no isAutoTranslate in types" \
    "grep -c 'isAutoTranslate' src/features/translator/types/index.ts 2>/dev/null || echo 0" \
    "0"

check "no isAutoTranslate in SettingsPanel" \
    "grep -c 'isAutoTranslate' src/widgets/settings-panel/SettingsPanel.tsx 2>/dev/null || echo 0" \
    "0"

check "no toggleAutoTranslate in store" \
    "grep -c 'toggleAutoTranslate' src/features/translator/store/index.ts 2>/dev/null || echo 0" \
    "0"

check "no toggleAutoTranslate in SettingsPanel" \
    "grep -c 'toggleAutoTranslate' src/widgets/settings-panel/SettingsPanel.tsx 2>/dev/null || echo 0" \
    "0"

check "no get_clipboard_watcher_state command" \
    "grep -c 'get_clipboard_watcher_state' src-tauri/src/presentation/commands/mod.rs 2>/dev/null || echo 0" \
    "0"

check "no set_clipboard_watcher_state command" \
    "grep -c 'set_clipboard_watcher_state' src-tauri/src/presentation/commands/mod.rs 2>/dev/null || echo 0" \
    "0"

check "rdev dependency in Cargo.toml" \
    "grep 'rdev' src-tauri/Cargo.toml" \
    "rdev"

check "arboard dependency in Cargo.toml" \
    "grep 'arboard' src-tauri/Cargo.toml" \
    "arboard"

check "simulate_copy function in global_key_listener" \
    "grep 'fn simulate_copy' src-tauri/src/presentation/global_key_listener.rs" \
    "fn simulate_copy"

check "read_clipboard function in global_key_listener" \
    "grep 'fn read_clipboard' src-tauri/src/presentation/global_key_listener.rs" \
    "fn read_clipboard"

check "xclip fallback in global_key_listener" \
    "grep 'xclip' src-tauri/src/presentation/global_key_listener.rs" \
    "xclip"

echo ""
echo "--- Rust Compiles ---"

check "cargo check (lib)" \
    "source \"\$HOME/.cargo/env\" && cd src-tauri && cargo check 2>&1 | tail -3" \
    "Finished"

echo ""
echo "--- TypeScript Compiles ---"

check "tsc --noEmit" \
    "npx tsc --noEmit 2>&1; echo EXIT_CODE=\$?" \
    "EXIT_CODE=0"

echo ""
echo "--- Key Components ---"

check "translate shortcut handler in useKeyboardShortcuts" \
    "grep \"matchShortcut(shortcuts.translate\" src/features/translator/hooks/useKeyboardShortcuts.ts" \
    "matchShortcut(shortcuts.translate"

check "global-shortcut-translate in useGlobalShortcut" \
    "grep \"global-shortcut-translate\" src/features/translator/hooks/useGlobalShortcut.ts" \
    "global-shortcut-translate"

check "ctrl+t default shortcut" \
    "grep \"ctrl+t\" src/features/translator/types/index.ts" \
    "ctrl+t"

check "SHORTCUT_VERSION=3" \
    "grep \"SHORTCUT_VERSION\" src/features/translator/store/index.ts" \
    "3"

check "useSyncShortcuts registers on first run" \
    "grep \"register_shortcut\" src/features/translator/hooks/useSyncShortcuts.ts" \
    "register_shortcut"

check "test_shortcut_flow command" \
    "grep 'fn test_shortcut_flow' src-tauri/src/presentation/commands/mod.rs" \
    "fn test_shortcut_flow"

check "event_received command" \
    "grep 'fn event_received' src-tauri/src/presentation/commands/mod.rs" \
    "fn event_received"

check "test button in App.tsx" \
    "grep \"test_shortcut_flow\" src/app/App.tsx" \
    "test_shortcut_flow"

echo ""
echo "--- Build Artifacts ---"

check "production binary exists" \
    "ls src-tauri/target/release/transify 2>&1" \
    "transify"

check "deb bundle exists" \
    "ls src-tauri/target/release/bundle/deb/Transify_0.1.0_amd64.deb 2>&1" \
    ".deb"

check "AppImage bundle exists" \
    "ls src-tauri/target/release/bundle/appimage/Transify_0.1.0_amd64.AppImage 2>&1" \
    ".AppImage"

echo ""
echo "--- App Icon ---"

check "icon.png generated (512x512)" \
    "file src-tauri/icons/icon.png | grep -oE '[0-9]+ x [0-9]+'" \
    "512 x 512"

check "32x32.png is correct size" \
    "file src-tauri/icons/32x32.png | grep -oE '[0-9]+ x [0-9]+'" \
    "32 x 32"

check "128x128.png is correct size" \
    "file src-tauri/icons/128x128.png | grep -oE '[0-9]+ x [0-9]+'" \
    "128 x 128"

check "128x128@2x.png is correct size" \
    "file src-tauri/icons/128x128@2x.png | grep -oE '[0-9]+ x [0-9]+'" \
    "256 x 256"

check "icon.ico is valid" \
    "file src-tauri/icons/icon.ico" \
    "MS Windows icon resource"

check "icon.icns is valid" \
    "file src-tauri/icons/icon.icns" \
    "Mac OS X icon"

check "app-icon.svg source exists" \
    "ls app-icon.svg 2>&1" \
    "app-icon.svg"

check "vite.svg contains translate icon" \
    "grep -l 'A' public/vite.svg && grep -l '文' public/vite.svg && echo 'ok'" \
    "ok"

check "index.html references vite.svg" \
    "grep 'vite.svg' index.html" \
    "vite.svg"

check "tauri.conf.json lists new icon.png" \
    "grep 'icon.png' src-tauri/tauri.conf.json" \
    "icon.png"

echo ""
echo "--- Screenshot Translation Feature ---"

check "screenshot-translation types exist" \
    "ls src/features/screenshot-translation/types/index.ts 2>&1" \
    "index.ts"

check "screenshot-translation store exists" \
    "ls src/features/screenshot-translation/store/index.ts 2>&1" \
    "index.ts"

check "OCR service exists" \
    "ls src/features/screenshot-translation/services/ocr.ts 2>&1" \
    "ocr.ts"

check "Capture service exists" \
    "ls src/features/screenshot-translation/services/capture.ts 2>&1" \
    "capture.ts"

check "CaptureButton component exists" \
    "ls src/features/screenshot-translation/components/CaptureButton.tsx 2>&1" \
    "CaptureButton.tsx"

check "useScreenshotTranslation hook exists" \
    "ls src/features/screenshot-translation/hooks/useScreenshotTranslation.ts 2>&1" \
    "useScreenshotTranslation.ts"

check "capture_screen_region Rust command exists" \
    "grep 'fn capture_screen_region' src-tauri/src/presentation/commands/screenshot.rs" \
    "fn capture_screen_region"

check "capture_screen_region registered in lib.rs" \
    "grep 'capture_screen_region' src-tauri/src/lib.rs" \
    "capture_screen_region"

check "ocr shortcut key defined" \
    "grep \"ocr.*ctrl+shift+o\" 2>/dev/null src/features/translator/types/index.ts || grep ocr src/features/translator/types/index.ts | head -1" \
    "ocr"

check "ocr shortcut action in SHORTCUT_ACTIONS" \
    "grep \"key.*ocr\" src/shared/utils/shortcuts.ts" \
    "ocr"

check "SHORTCUT_VERSION incremented to 3" \
    "grep \"SHORTCUT_VERSION = 3\" src/features/translator/store/index.ts" \
    "3"

check "OCR shortcut handler in useKeyboardShortcuts" \
    "grep \"screenshot-translation/store\" src/features/translator/hooks/useKeyboardShortcuts.ts" \
    "screenshot-translation/store"

check "CaptureButton in ActionBar" \
    "grep \"CaptureButton\" src/features/translator/components/ActionBar.tsx" \
    "CaptureButton"

check "tesseract.js dependency installed" \
    "grep \"tesseract.js\" package.json" \
    "tesseract.js"

check "Rust screenshot command module registered" \
    "grep \"pub mod screenshot\" src-tauri/src/presentation/commands/mod.rs" \
    "screenshot"

check "base64 crate in Cargo.toml" \
    "grep \"base64\" src-tauri/Cargo.toml" \
    "base64"

check "CaptureOverlay component exists" \
    "ls src/features/screenshot-translation/components/CaptureOverlay.tsx 2>&1" \
    "CaptureOverlay.tsx"

check "cancel_capture Rust command exists" \
    "grep 'fn cancel_capture' src-tauri/src/presentation/commands/screenshot.rs" \
    "fn cancel_capture"

check "cancel_capture registered in lib.rs" \
    "grep cancel_capture src-tauri/src/lib.rs" \
    "cancel_capture"

check "CaptureOverlay in App.tsx" \
    "grep CaptureOverlay src/app/App.tsx" \
    "CaptureOverlay"

echo ""
echo "--- Summary ---"
echo "  PASS: $PASS"
echo "  FAIL: $FAIL"
echo ""

if [ "$FAIL" -eq 0 ]; then
    echo "All tests passed!"
else
    echo "Some tests failed."
    exit 1
fi
