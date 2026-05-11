// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod db;
mod models;

use db::*;
use models::*;

#[tauri::command]
fn create_recipe_command(recipe: NewRecipe) -> Result<(), String> {
    create_recipe(recipe).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_recipes_command() -> Result<Vec<Recipe>, String> {
    get_recipes().map_err(|e| e.to_string())
}

#[tauri::command]
fn update_recipe_command(recipe: Recipe) -> Result<(), String> {
    update_recipe(recipe).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_recipe_command(id: i32) -> Result<(), String> {
    delete_recipe(id).map_err(|e| e.to_string())
}

#[tauri::command]
fn export_recipes_command() -> Result<(), String> {
    export_recipes()
}

#[tauri::command]
fn import_recipes_command(replace_existing: bool) -> Result<(), String> {
    import_recipes(replace_existing).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_all_recipes_command() -> Result<(), String> {
    delete_all_recipes().map_err(|e| e.to_string())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            db::init_db(app.handle()).expect("Failed to initialize local Database");
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            create_recipe_command,
            get_recipes_command,
            update_recipe_command,
            delete_recipe_command,
            export_recipes_command,
            import_recipes_command,
            delete_all_recipes_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
