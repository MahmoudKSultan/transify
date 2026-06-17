pub struct AppConfig {
    pub max_history: usize,
    pub debounce_ms: u64,
    pub default_source_lang: String,
    pub default_target_lang: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            max_history: 100,
            debounce_ms: 300,
            default_source_lang: "auto".to_string(),
            default_target_lang: "en".to_string(),
        }
    }
}
