use crate::application::interfaces::TranslationProvider;
use crate::domain::models::TranslationResult;
use crate::shared::errors::AppError;

pub struct GoogleTranslateProvider;

#[async_trait::async_trait]
impl TranslationProvider for GoogleTranslateProvider {
    async fn translate(
        &self,
        text: &str,
        source_lang: &str,
        target_lang: &str,
    ) -> Result<TranslationResult, AppError> {
        let source = if source_lang == "auto" { "auto" } else { source_lang };
        let url = format!(
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl={}&tl={}&dt=t&q={}",
            source,
            target_lang,
            urlencoding(text)
        );

        let client = reqwest::Client::new();
        let response = client.get(&url).send().await.map_err(|_| AppError::NetworkError)?;
        let data: serde_json::Value = response.json().await.map_err(|_| AppError::TranslationFailed)?;

        let translated_text = data[0]
            .as_array()
            .ok_or(AppError::TranslationFailed)?
            .iter()
            .filter_map(|segment| segment[0].as_str())
            .collect::<Vec<_>>()
            .join("");

        let detected_language = if source_lang == "auto" {
            data[2].as_str().map(String::from)
        } else {
            None
        };

        Ok(TranslationResult {
            translated_text,
            detected_language,
        })
    }
}

fn urlencoding(s: &str) -> String {
    s.chars()
        .map(|c| match c {
            'A'..='Z' | 'a'..='z' | '0'..='9' | '-' | '_' | '.' | '~' => c.to_string(),
            _ => format!("%{:02X}", c as u8),
        })
        .collect()
}
