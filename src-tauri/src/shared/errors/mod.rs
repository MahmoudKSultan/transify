use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Translation failed")]
    TranslationFailed,
    #[error("Network error")]
    NetworkError,
    #[error("Rate limit exceeded")]
    RateLimit,
    #[error("Empty input")]
    EmptyInput,
    #[error("Unsupported language")]
    UnsupportedLanguage,
    #[error("Clipboard error: {0}")]
    Clipboard(String),
    #[error("Shortcut error: {0}")]
    Shortcut(String),
}
