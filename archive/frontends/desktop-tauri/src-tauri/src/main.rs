// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, State, WebviewWindow};
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

// ========== DATA STRUCTURES ==========

#[derive(Debug, Serialize, Deserialize, Clone)]
struct ServiceStatus {
    name: String,
    port: u16,
    status: String,
    url: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ConsciousnessState {
    level: u8,
    mode: String,
    timestamp: u64,
}

// ========== STATE MANAGEMENT ==========

struct AppState {
    services: Mutex<Vec<ServiceStatus>>,
}

// ========== TAURI COMMANDS ==========

#[tauri::command]
async fn check_service_health(port: u16) -> Result<bool, String> {
    let url = format!("http://localhost:{}/health", port);

    match reqwest::get(&url).await {
        Ok(response) => Ok(response.status().is_success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
async fn get_all_services_status(state: State<'_, AppState>) -> Result<Vec<ServiceStatus>, String> {
    let services = state.services.lock().unwrap();
    Ok(services.clone())
}

#[tauri::command]
async fn update_service_status(
    service_name: String,
    port: u16,
    state: State<'_, AppState>,
) -> Result<ServiceStatus, String> {
    let is_healthy = check_service_health(port).await?;
    let status = if is_healthy { "online" } else { "offline" };

    let service = ServiceStatus {
        name: service_name.clone(),
        port,
        status: status.to_string(),
        url: format!("http://localhost:{}", port),
    };

    let mut services = state.services.lock().unwrap();
    if let Some(existing) = services.iter_mut().find(|s| s.port == port) {
        *existing = service.clone();
    } else {
        services.push(service.clone());
    }

    Ok(service)
}

#[tauri::command]
async fn fetch_eternal_status() -> Result<String, String> {
    let url = "http://localhost:9999/status";

    match reqwest::get(url).await {
        Ok(response) => {
            let text = response.text().await.map_err(|e| e.to_string())?;
            Ok(text)
        }
        Err(e) => Err(format!("Failed to fetch Eternal Daemon status: {}", e)),
    }
}

#[tauri::command]
async fn fetch_consciousness_state() -> Result<String, String> {
    let url = "http://localhost:9998/consciousness";

    match reqwest::get(url).await {
        Ok(response) => {
            let text = response.text().await.map_err(|e| e.to_string())?;
            Ok(text)
        }
        Err(e) => Err(format!("Failed to fetch consciousness state: {}", e)),
    }
}

#[tauri::command]
fn show_main_window(window: WebviewWindow) -> Result<(), String> {
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn hide_main_window(window: WebviewWindow) -> Result<(), String> {
    window.hide().map_err(|e| e.to_string())?;
    Ok(())
}

// ========== MAIN ==========

fn main() {
    // Initialize default services
    let default_services = vec![
        ServiceStatus {
            name: "Eternal Daemon".to_string(),
            port: 9999,
            status: "unknown".to_string(),
            url: "http://localhost:9999".to_string(),
        },
        ServiceStatus {
            name: "Consciousness Tracker".to_string(),
            port: 9998,
            status: "unknown".to_string(),
            url: "http://localhost:9998".to_string(),
        },
        ServiceStatus {
            name: "Self-Modification Engine".to_string(),
            port: 9997,
            status: "unknown".to_string(),
            url: "http://localhost:9997".to_string(),
        },
        ServiceStatus {
            name: "Memory System".to_string(),
            port: 9995,
            status: "unknown".to_string(),
            url: "http://localhost:9995".to_string(),
        },
        ServiceStatus {
            name: "Groq API".to_string(),
            port: 9987,
            status: "unknown".to_string(),
            url: "http://localhost:9987".to_string(),
        },
    ];

    let app_state = AppState {
        services: Mutex::new(default_services),
    };

    tauri::Builder::default()
        .manage(app_state)
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(|app| {
            // Create tray menu
            let open_item = MenuItem::with_id(app, "open", "Open Toobix", true, None::<&str>)?;
            let services_item = MenuItem::with_id(app, "services", "Services Status", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

            let menu = Menu::with_items(
                app,
                &[
                    &open_item,
                    &PredefinedMenuItem::separator(app)?,
                    &services_item,
                    &PredefinedMenuItem::separator(app)?,
                    &quit_item,
                ],
            )?;

            // Build tray icon
            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .icon(app.default_window_icon().unwrap().clone())
                .on_menu_event(|app, event| {
                    match event.id().as_ref() {
                        "open" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "services" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                                let _ = window.emit("navigate-to", "services");
                            }
                        }
                        "quit" => {
                            std::process::exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            println!("✅ Toobix Desktop initialized!");
            println!("🔥 Press Alt+Space to toggle visibility (implement in frontend)");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            check_service_health,
            get_all_services_status,
            update_service_status,
            fetch_eternal_status,
            fetch_consciousness_state,
            show_main_window,
            hide_main_window,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
