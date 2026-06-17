use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct TranslateRequest {
    pub text: String,
    pub source_lang: String,
    pub target_lang: String,
}

#[derive(Debug, Serialize)]
pub struct TranslateResponse {
    pub translated_text: String,
    pub detected_language: Option<String>,
}
