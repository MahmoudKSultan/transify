use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Translation {
    pub input_text: String,
    pub output_text: String,
    pub source_lang: String,
    pub target_lang: String,
    pub detected_language: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranslationResult {
    pub translated_text: String,
    pub detected_language: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HistoryEntry {
    pub id: String,
    pub input_text: String,
    pub output_text: String,
    pub source_lang: String,
    pub target_lang: String,
    pub timestamp: i64,
}
