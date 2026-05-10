use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, ts_rs::TS)]
#[ts(export)]
pub struct Recipe {
    pub id: Option<i32>,

    pub name: String,
    pub category: String,

    pub ingredients: Vec<String>,
    pub steps: Vec<String>,

    pub images: Vec<String>,

    pub notes: Option<String>,
}

#[derive(Serialize, Deserialize, ts_rs::TS)]
#[ts(export)]
pub struct NewRecipe {
    pub name: String,
    pub category: String,

    pub ingredients: Vec<String>,
    pub steps: Vec<String>,

    pub images: Vec<String>,
    pub notes: Option<String>,
}
