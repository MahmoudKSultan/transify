use rdev::{listen, simulate, Event, EventType, Key};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};

fn simulate_copy() -> bool {
    let pairs = [
        (EventType::KeyPress(Key::ControlLeft), EventType::KeyRelease(Key::ControlLeft)),
        (EventType::KeyPress(Key::KeyC), EventType::KeyRelease(Key::KeyC)),
    ];

    for (press, release) in &pairs {
        if simulate(press).is_err() {
            return false;
        }
        thread::sleep(Duration::from_millis(10));
        if simulate(release).is_err() {
            return false;
        }
        thread::sleep(Duration::from_millis(10));
    }
    true
}

fn read_clipboard() -> Option<String> {
    match arboard::Clipboard::new() {
        Ok(mut cb) => match cb.get_text() {
            Ok(text) => {
                let trimmed = text.trim().to_string();
                if !trimmed.is_empty() {
                    return Some(trimmed);
                }
            }
            Err(_) => {}
        },
        Err(_) => {}
    }

    if let Ok(output) = std::process::Command::new("xclip")
        .args(["-selection", "primary", "-o", "-silent"])
        .output()
    {
        if output.status.success() {
            let text = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !text.is_empty() {
                return Some(text);
            }
        }
    }

    None
}

fn focus_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_focus();
        let _ = window.unminimize();
    }
}

pub fn start_global_key_listener(app: AppHandle, enabled: Arc<AtomicBool>) {
    thread::spawn(move || {
        let mut ctrl_pressed = false;
        let mut shift_pressed = false;
        let mut alt_pressed = false;

        eprintln!("[Transify-Rust] Global key listener started (default shortcuts active)");

        let callback = move |event: Event| {
            if !enabled.load(Ordering::Relaxed) {
                return;
            }

            match event.event_type {
                EventType::KeyPress(Key::ControlLeft) | EventType::KeyPress(Key::ControlRight) => {
                    ctrl_pressed = true;
                }
                EventType::KeyRelease(Key::ControlLeft)
                | EventType::KeyRelease(Key::ControlRight) => {
                    ctrl_pressed = false;
                }
                EventType::KeyPress(Key::ShiftLeft) | EventType::KeyPress(Key::ShiftRight) => {
                    shift_pressed = true;
                }
                EventType::KeyRelease(Key::ShiftLeft)
                | EventType::KeyRelease(Key::ShiftRight) => {
                    shift_pressed = false;
                }
                EventType::KeyPress(Key::Alt) => {
                    alt_pressed = true;
                }
                EventType::KeyRelease(Key::Alt) => {
                    alt_pressed = false;
                }
                EventType::KeyPress(Key::KeyT) if ctrl_pressed && !shift_pressed && !alt_pressed => {
                    eprintln!("[Transify-Rust] Ctrl+T detected (translate)");
                    ctrl_pressed = false;

                    let sim_ok = simulate_copy();
                    if sim_ok {
                        thread::sleep(Duration::from_millis(100));
                    }

                    if let Some(text) = read_clipboard() {
                        eprintln!("[Transify-Rust] Clipboard: \"{:.50}\"", text);
                    } else {
                        eprintln!("[Transify-Rust] No text found in clipboard");
                    }

                    focus_window(&app);
                    let _ = app.emit("global-shortcut-translate", ());
                }
                EventType::KeyPress(Key::KeyS) if ctrl_pressed && !shift_pressed && !alt_pressed => {
                    eprintln!("[Transify-Rust] Ctrl+S detected (swap)");
                    ctrl_pressed = false;
                    focus_window(&app);
                    let _ = app.emit("global-shortcut-swap", ());
                }
                EventType::KeyPress(Key::KeyC) if ctrl_pressed && shift_pressed && !alt_pressed => {
                    eprintln!("[Transify-Rust] Ctrl+Shift+C detected (clear)");
                    ctrl_pressed = false;
                    shift_pressed = false;
                    focus_window(&app);
                    let _ = app.emit("global-shortcut-clear", ());
                }
                EventType::KeyPress(Key::KeyF) if ctrl_pressed && shift_pressed && !alt_pressed => {
                    eprintln!("[Transify-Rust] Ctrl+Shift+F detected (focus input)");
                    ctrl_pressed = false;
                    shift_pressed = false;
                    focus_window(&app);
                    let _ = app.emit("global-shortcut-focus", ());
                }
                EventType::KeyPress(Key::KeyO) if ctrl_pressed && shift_pressed && !alt_pressed => {
                    eprintln!("[Transify-Rust] Ctrl+Shift+O detected (OCR)");
                    ctrl_pressed = false;
                    shift_pressed = false;
                    // Don't focus window — startCapture() hides it anyway
                    let _ = app.emit("global-shortcut-ocr", ());
                }
                _ => {}
            }
        };

        if let Err(e) = listen(callback) {
            eprintln!("[Transify-Rust] Global key listener error: {:?}", e);
            eprintln!("[Transify-Rust] Try: sudo usermod -a -G input $USER && reboot");
        }
    });
}
