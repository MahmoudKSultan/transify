pub struct HotkeyService;

impl HotkeyService {
    pub fn new() -> Self {
        Self
    }

    pub fn register_global_shortcuts(
        _app: &tauri::AppHandle,
    ) -> Result<(), String> {
        Ok(())
    }
}
