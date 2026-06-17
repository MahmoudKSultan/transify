use crate::application::interfaces::TranslationProvider;
use crate::domain::models::TranslationResult;
use crate::shared::errors::AppError;

pub struct TranslateUseCase {
    provider: Box<dyn TranslationProvider>,
}

impl TranslateUseCase {
    pub fn new(provider: Box<dyn TranslationProvider>) -> Self {
        Self { provider }
    }

    pub async fn execute(
        &self,
        text: &str,
        source_lang: &str,
        target_lang: &str,
    ) -> Result<TranslationResult, AppError> {
        if text.trim().is_empty() {
            return Err(AppError::EmptyInput);
        }

        let result = self
            .provider
            .translate(text, source_lang, target_lang)
            .await
            .map_err(|_| AppError::TranslationFailed)?;

        Ok(result)
    }
}
