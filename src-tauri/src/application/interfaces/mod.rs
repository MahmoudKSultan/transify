use crate::domain::models::TranslationResult;
use crate::shared::errors::AppError;

#[async_trait::async_trait]
pub trait TranslationProvider: Send + Sync {
    async fn translate(
        &self,
        text: &str,
        source_lang: &str,
        target_lang: &str,
    ) -> Result<TranslationResult, AppError>;
}
