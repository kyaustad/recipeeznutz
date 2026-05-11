# RecipeezNutz

Desktop recipe manager built with [Tauri](https://tauri.app/). The UI is a React application; persistence and file dialogs run in Rust. Recipes live in a local SQLite database, with optional backup and restore through **NutBook** (`.nutbook`) plaintext files.

## Screenshots

Light theme, recipe detail with image carousel, ingredients, steps, and notes:

![RecipeezNutz UI — light theme with recipe list and detail view](https://raw.githubusercontent.com/kyaustad/recipeeznutz/master/src/assets/screenshot-1.png)

Dark theme, same two-pane layout with search, sort, category filter, and bulk import/export controls:

![RecipeezNutz UI — dark theme with recipe list and detail view](https://raw.githubusercontent.com/kyaustad/recipeeznutz/master/src/assets/screenshot-2.png)

## Frontend (React)

The interface is implemented in React (TypeScript) with Vite. The main screen is a responsive **dashboard**: a left column lists recipes and global actions; selecting a recipe opens a **detail pane** with title, category, optional image carousel, ingredient and step lists, and notes.

The recipe list supports **fuzzy search** (name, category, ingredients, notes), **sorting** by name or category, and **filtering** by category. Each row shows the recipe name, category, and a thumbnail when an image exists. Motion (`motion/react`) is used for enter and transition animations.

Creating recipes uses a dialog form; viewing uses **RecipeView** with **Edit** and **Delete** for the active recipe. Toast notifications report success or failure for operations that call into the backend.

## Backend (Rust)

The Tauri shell exposes commands that wrap SQLite access and native dialogs. On startup, the app initializes a `recipes` table in an application data directory. Commands cover **create**, **read** (list all), **update**, **delete** (single or all), **export**, and **import**.

Export and import use the system file picker (`rfd`): export writes a chosen path; import reads a selected `.nutbook` file. Import can optionally **replace** every stored recipe before inserting the file contents.

## Recipes and NutBook files

Each recipe has a **name**, **category**, **ingredients** (list of strings), **steps** (list of strings), **images** (stored as strings, e.g. base64 for inline photos), and optional **notes**.

**NutBook** is the app’s interchange format: a **plaintext** file with the `.nutbook` extension containing a JSON array of recipe records. Use **Export All Recipes** to write that file and **Import Recipes** to merge or replace from another NutBook. This gives you a simple backup, migration, or sharing path without a cloud service.

## Development

```bash
pnpm install
pnpm tauri dev
```
