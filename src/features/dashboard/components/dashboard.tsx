import { motion, AnimatePresence } from "motion/react";
import { ANIM } from "@/lib/utils";
import type { Recipe } from "@/bindings/Recipe";
import { RecipeList } from "./recipe-list";
import { useCallback, useState } from "react";
import { AddRecipeDialog } from "@/features/recipe-crud/components/create-recipe";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { RecipeView } from "./recipe-view";

export function Dashboard() {
  const [addNewRecipeDialogOpen, setAddNewRecipeDialogOpen] =
    useState<boolean>(false);
  const [recipesReloadToken, setRecipesReloadToken] = useState(0);
  const refetchRecipes = useCallback(() => {
    setRecipesReloadToken((n) => n + 1);
  }, []);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const determineActiveRecipe = (recipe: Recipe) => {
    if (activeRecipe?.id === recipe.id) {
      setActiveRecipe(null);
    } else {
      setActiveRecipe(recipe);
    }
  };

  return (
    <>
      <AddRecipeDialog
        open={addNewRecipeDialogOpen}
        openChanged={(newOpen) => {
          setAddNewRecipeDialogOpen(newOpen);
        }}
        onRecipeCreated={refetchRecipes}
      ></AddRecipeDialog>
      <AnimatePresence mode="wait">
        <div className="flex min-h-0 w-full max-w-full flex-1 flex-col gap-4 p-4 md:flex-row md:items-stretch md:gap-6 md:p-6">
          <motion.div
            initial={ANIM.initial}
            animate={ANIM.animate}
            transition={ANIM.transition.top}
            className="flex h-full min-h-0 w-full min-w-0 shrink-0 flex-col md:w-[min(100%,26rem)] lg:w-1/3"
          >
            <RecipeList
              recipesReloadToken={recipesReloadToken}
              onRecipeSelected={(recipe) => determineActiveRecipe(recipe)}
              activeRecipe={activeRecipe}
              onRecipesImported={refetchRecipes}
              onRecipesDeleted={() => setActiveRecipe(null)}
            >
              <Button onClick={(_e) => setAddNewRecipeDialogOpen(true)}>
                <PlusCircleIcon></PlusCircleIcon>Add
              </Button>
            </RecipeList>
          </motion.div>
          {activeRecipe !== null ? (
            <RecipeView
              recipe={activeRecipe}
              onRecipeUpdated={(updated) => {
                setActiveRecipe(updated);
                refetchRecipes();
              }}
              onRecipeDeleted={() => {
                setActiveRecipe(null);
                refetchRecipes();
              }}
            />
          ) : null}
        </div>
      </AnimatePresence>
    </>
  );
}
