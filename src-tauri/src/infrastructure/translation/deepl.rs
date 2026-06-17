use crate::application::interfaces::TranslationProvider;
use crate::domain::models::TranslationResult;
use crate::shared::errors::AppError;

pub struct DeepLProvider {
    api_key: String,
}

impl DeepLProvider {
    pub fn new(api_key: String) -> Self {
        Self { api_key }
    }
}

#[async_trait::async_trait]
impl TranslationProvider for DeepLProvider {
    async fn translate(
        &self,
        text: &str,
        _source_lang: &str,
        target_lang: &str,
    ) -> Result<TranslationResult, AppError> {
        let client = reqwest::Client::new();
        let response = client
            .post("https://api-free.deepl.com/v2/translate")
            .header("Authorization", format!("DeepL-Auth-Key {}", self.api_key))
            .form(&[
                ("text", text),
                ("target_lang", &target_lang.to_uppercase()),
            ])
            .send()
            .await
            .map_err(|_| AppError::NetworkError)?;

        let data: serde_json::Value = response.json().await.map_err(|_| AppError::TranslationFailed)?;
        let translated_text = data["translations"][0]["text"]
            .as_str()
            .unwrap_or("")
            .to_string();

        Ok(TranslationResult {
            translated_text,
            detected_language: None,
        })
    }
}
