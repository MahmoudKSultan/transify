use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct TranslationEvent {
    pub input_text: String,
    pub output_text: String,
    pub source_lang: String,
    pub target_lang: String,
    pub timestamp: i64,
}

#[derive(Clone, Serialize)]
pub struct ErrorEvent {
    pub message: String,
    pub timestamp: i64,
}
