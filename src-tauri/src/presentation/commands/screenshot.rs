use base64::Engine;
use std::io::Read;
use std::process::Command;

fn tool_available(tool: &str) -> bool {
    Command::new("which")
        .arg(tool)
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

fn capture_with_tool(tool: &str, output_path: &str) -> Result<(), String> {
    match tool {
        "scrot" => {
            let status = Command::new("scrot")
                .args(["-s", output_path])
                .status()
                .map_err(|e| format!("Failed to run scrot: {}", e))?;
            if !status.success() {
                return Err("Capture cancelled or failed.".into());
            }
            Ok(())
        }
        "gnome-screenshot" => {
            let status = Command::new("gnome-screenshot")
                .args(["-a", "-f", output_path])
                .status()
                .map_err(|e| format!("Failed to run gnome-screenshot: {}", e))?;
            if !status.success() {
                return Err("Capture cancelled or failed.".into());
            }
            Ok(())
        }
        "import" => {
            let status = Command::new("import")
                .args([output_path])
                .status()
                .map_err(|e| format!("Failed to run import: {}", e))?;
            if !status.success() {
                return Err("Capture cancelled or failed.".into());
            }
            Ok(())
        }
        _ => Err(format!("Unknown capture tool: {}", tool)),
    }
}

#[tauri::command]
pub fn capture_screen_region() -> Result<String, String> {
    let tools = ["scrot", "gnome-screenshot", "import"];
    let tool = tools.iter().find(|t| tool_available(t)).ok_or_else(|| {
        eprintln!("[Transify-Rust] No capture tool found");
        "No screen capture tool found. Install one: sudo apt install scrot".to_string()
    })?;

    eprintln!("[Transify-Rust] Capturing screen with: {}", tool);

    let tmp_path = format!("/tmp/transify-capture-{}.png", std::process::id());

    capture_with_tool(tool, &tmp_path)?;

    let mut file =
        std::fs::File::open(&tmp_path).map_err(|e| format!("Failed to open capture: {}", e))?;

    let mut buf = Vec::new();
    file.read_to_end(&mut buf)
        .map_err(|e| format!("Failed to read capture: {}", e))?;

    let _ = std::fs::remove_file(&tmp_path);

    let encoded = base64::engine::general_purpose::STANDARD.encode(&buf);
    eprintln!("[Transify-Rust] Capture done: {} bytes encoded", encoded.len());

    Ok(encoded)
}
