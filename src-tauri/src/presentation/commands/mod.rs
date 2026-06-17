use crate::application::dto::{TranslateRequest, TranslateResponse};
use crate::application::use_cases::TranslateUseCase;
use crate::infrastructure::translation::google::GoogleTranslateProvider;
use tauri::{AppHandle, Emitter, Manager, State};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

pub struct AppState {
    pub translate_use_case: TranslateUseCase,
}

#[tauri::command]
pub async fn translate(
    state: State<'_, AppState>,
    request: TranslateRequest,
) -> Result<TranslateResponse, String> {
    let result = state
        .translate_use_case
        .execute(&request.text, &request.source_lang, &request.target_lang)
        .await
        .map_err(|e| e.to_string())?;

    Ok(TranslateResponse {
        translated_text: result.translated_text,
        detected_language: result.detected_language,
    })
}

#[tauri::command]
pub fn register_shortcut(app: AppHandle, shortcut_str: String) -> Result<(), String> {
    eprintln!("[Transify-Rust] register_shortcut called with: {}", shortcut_str);

    let gs = app.global_shortcut();

    // Unregister everything first
    let _ = gs.unregister_all();

    if shortcut_str.is_empty() {
        eprintln!("[Transify-Rust] Empty shortcut, skipping");
        return Ok(());
    }

    let parts: Vec<&str> = shortcut_str.split('+').collect();
    let mut modifiers = Modifiers::empty();
    let mut key_code = None;

    for part in &parts {
        match part.to_lowercase().as_str() {
            "ctrl" | "control" => modifiers |= Modifiers::CONTROL,
            "alt" | "option" => modifiers |= Modifiers::ALT,
            "shift" => modifiers |= Modifiers::SHIFT,
            "meta" | "cmd" | "super" => modifiers |= Modifiers::SUPER,
            key => {
                key_code = Some(match key {
                    "t" => Code::KeyT,
                    "s" => Code::KeyS,
                    "c" => Code::KeyC,
                    "a" => Code::KeyA,
                    "b" => Code::KeyB,
                    "d" => Code::KeyD,
                    "e" => Code::KeyE,
                    "f" => Code::KeyF,
                    "g" => Code::KeyG,
                    "h" => Code::KeyH,
                    "i" => Code::KeyI,
                    "j" => Code::KeyJ,
                    "k" => Code::KeyK,
                    "l" => Code::KeyL,
                    "m" => Code::KeyM,
                    "n" => Code::KeyN,
                    "o" => Code::KeyO,
                    "p" => Code::KeyP,
                    "q" => Code::KeyQ,
                    "r" => Code::KeyR,
                    "u" => Code::KeyU,
                    "v" => Code::KeyV,
                    "w" => Code::KeyW,
                    "x" => Code::KeyX,
                    "y" => Code::KeyY,
                    "z" => Code::KeyZ,
                    "enter" | "return" => Code::Enter,
                    "escape" | "esc" => Code::Escape,
                    "space" => Code::Space,
                    "arrowup" | "up" => Code::ArrowUp,
                    "arrowdown" | "down" => Code::ArrowDown,
                    "arrowleft" | "left" => Code::ArrowLeft,
                    "arrowright" | "right" => Code::ArrowRight,
                    "1" => Code::Digit1,
                    "2" => Code::Digit2,
                    "3" => Code::Digit3,
                    "4" => Code::Digit4,
                    "5" => Code::Digit5,
                    "6" => Code::Digit6,
                    "7" => Code::Digit7,
                    "8" => Code::Digit8,
                    "9" => Code::Digit9,
                    "0" => Code::Digit0,
                    _ => return Err(format!("Unknown key: {}", key)),
                });
            }
        }
    }

    let key_code = key_code.ok_or("No key specified")?;
    let shortcut = Shortcut::new(Some(modifiers), key_code);

    eprintln!("[Transify-Rust] Registering shortcut with modifiers={:?}, code={:?}", modifiers, key_code);

    // Register the shortcut and set handler
    gs.on_shortcut(shortcut, move |app, _shortcut, event| {
        eprintln!("[Transify-Rust] SHORTCUT EVENT FIRED! state={:?}", event.state);
        if event.state == ShortcutState::Pressed {
            eprintln!("[Transify-Rust] Setting window focus...");
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                let _ = window.unminimize();
                eprintln!("[Transify-Rust] Window focus done");
            } else {
                eprintln!("[Transify-Rust] WARNING: Could not find 'main' window!");
            }
            eprintln!("[Transify-Rust] Emitting global-shortcut-translate event...");
            let _ = app.emit("global-shortcut-translate", ());
            eprintln!("[Transify-Rust] Event emitted");
        }
    })
    .map_err(|e| format!("Failed to register shortcut: {}", e))?;

    eprintln!("[Transify-Rust] Shortcut registration successful");
    Ok(())
}

#[tauri::command]
pub fn test_shortcut_flow(app: AppHandle) -> Result<(), String> {
    eprintln!("[Transify-Rust] test_shortcut_flow called!");
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_focus();
        let _ = window.unminimize();
        eprintln!("[Transify-Rust] Window focused");
    } else {
        eprintln!("[Transify-Rust] WARNING: no 'main' window");
    }
    eprintln!("[Transify-Rust] Emitting event...");
    let _ = app.emit("global-shortcut-translate", ());
    eprintln!("[Transify-Rust] Event emitted");
    Ok(())
}

#[tauri::command]
pub fn event_received(event_name: String) -> Result<(), String> {
    eprintln!("[Transify-Rust] ✓ FRONTEND CONFIRMED event received: {}", event_name);
    Ok(())
}

pub fn create_app_state() -> AppState {
    let provider = Box::new(GoogleTranslateProvider);
    let translate_use_case = TranslateUseCase::new(provider);

    AppState { translate_use_case }
}
