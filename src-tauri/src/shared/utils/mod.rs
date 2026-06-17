pub fn normalize_text(text: &str) -> String {
    text.trim()
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
}
