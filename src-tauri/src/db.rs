use crate::models::{NewRecipe, Recipe};
use rusqlite::{Connection, Result};
use serde_json;
use std::fs;
use std::path::PathBuf;
use std::sync::OnceLock;
use tauri::{AppHandle, Manager};

static DB_PATH: OnceLock<PathBuf> = OnceLock::new();

pub fn init_db(app: &AppHandle) -> Result<()> {
    let tauri_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get AppData Directory");

    let db_dir = tauri_dir.join("data");

    if !db_dir.exists() {
        fs::create_dir_all(&db_dir).expect("Failed to create data directory!");
    }

    let db_path = db_dir.join("recipes.db");

    let _ = DB_PATH.set(db_path.clone());

    let conn = Connection::open(&db_path)?;

    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,
            category TEXT NOT NULL,

            ingredients TEXT NOT NULL,
            steps TEXT NOT NULL,

            images TEXT NOT NULL,
            notes TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
        ",
    )?;

    println!("Database initialized at {:#?}", db_path.to_str());

    Ok(())
}

fn get_connection() -> Result<Connection> {
    let path = DB_PATH.get().expect("Error in path to DB");

    Connection::open(path)
}

pub fn create_recipe(recipe: NewRecipe) -> Result<()> {
    let conn = get_connection()?;

    let ingredients_json = serde_json::to_string(&recipe.ingredients).unwrap();

    let steps_json = serde_json::to_string(&recipe.steps).unwrap();

    let images_json = serde_json::to_string(&recipe.images).unwrap();

    conn.execute(
        "
        INSERT INTO recipes
        (
            name,
            category,
            ingredients,
            steps,
            images,
            notes
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        ",
        (
            recipe.name,
            recipe.category,
            ingredients_json,
            steps_json,
            images_json,
            recipe.notes,
        ),
    )?;

    Ok(())
}

pub fn get_recipes() -> Result<Vec<Recipe>> {
    let conn = get_connection()?;

    let mut stmt = conn.prepare(
        "
            SELECT
                id,
                name,
                category,
                ingredients,
                steps,
                images,
                notes
            FROM recipes
            ORDER BY name ASC
        ",
    )?;

    let recipe_iter = stmt.query_map([], |row| {
        let ingredients_json: String = row.get(3)?;
        let steps_json: String = row.get(4)?;
        let images_json: String = row.get(5)?;

        Ok(Recipe {
            id: row.get(0)?,

            name: row.get(1)?,
            category: row.get(2)?,

            ingredients: serde_json::from_str(&ingredients_json).unwrap(),

            steps: serde_json::from_str(&steps_json).unwrap(),

            images: serde_json::from_str(&images_json).unwrap(),

            notes: row.get(6)?,
        })
    })?;

    let mut recipes = Vec::new();

    for recipe in recipe_iter {
        recipes.push(recipe?);
    }

    Ok(recipes)
}

pub fn update_recipe(recipe: Recipe) -> Result<()> {
    let conn = get_connection()?;

    let ingredients_json = serde_json::to_string(&recipe.ingredients).unwrap();
    let steps_json = serde_json::to_string(&recipe.steps).unwrap();
    let images_json = serde_json::to_string(&recipe.images).unwrap();

    conn.execute(
        "
            UPDATE recipes
            SET
                name = ?1,
                category ?2,
                ingredients = ?3,
                steps = ?4,
                images = ?5,
                notes = ?6
            WHERE id = ?7
            ",
        (
            recipe.name,
            recipe.category,
            ingredients_json,
            steps_json,
            images_json,
            recipe.notes,
            recipe.id,
        ),
    )?;

    Ok(())
}

pub fn delete_recipe(id: i32) -> Result<()> {
    let conn = get_connection()?;

    conn.execute("DELETE FROM recipes WHERE id = ?1", [id])?;

    Ok(())
}
