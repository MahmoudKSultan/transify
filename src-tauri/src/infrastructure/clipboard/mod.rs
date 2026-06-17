pub struct ClipboardService;

impl ClipboardService {
    pub fn new() -> Self {
        Self
    }

    pub async fn read(&self) -> Result<String, String> {
        Ok(String::new())
    }

    pub async fn write(&self, _text: &str) -> Result<(), String> {
        Ok(())
    }
}
