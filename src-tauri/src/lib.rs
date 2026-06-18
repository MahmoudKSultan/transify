mod application;
mod domain;
mod infrastructure;
mod presentation;
mod shared;

use presentation::commands::{
    cancel_capture, capture_screen_region, create_app_state, event_received, register_shortcut,
    test_shortcut_flow, translate,
};
use presentation::global_key_listener::start_global_key_listener;
use std::sync::atomic::AtomicBool;
use std::sync::Arc;
use tauri::Emitter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let key_listener_enabled = Arc::new(AtomicBool::new(true));
    let listener_for_thread = Arc::clone(&key_listener_enabled);

    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(create_app_state())
        .manage(key_listener_enabled)
        .invoke_handler(tauri::generate_handler![
            translate,
            register_shortcut,
            test_shortcut_flow,
            event_received,
            capture_screen_region,
            cancel_capture,
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Focused(focused) = event {
                if *focused {
                    let _ = window.emit("window-focused", ());
                }
            }
        })
        .setup(move |app| {
            let handle = app.handle().clone();
            start_global_key_listener(handle, listener_for_thread);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

