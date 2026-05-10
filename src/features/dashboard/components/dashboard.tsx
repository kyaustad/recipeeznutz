import { motion } from "motion/react";
import { ANIM } from "@/lib/utils";
import type { Recipe } from "@/bindings/Recipe";
import { RecipeList } from "./recipe-list";
import { useState } from "react";
import { AddRecipeDialog } from "@/features/recipe-crud/components/create-recipe";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

export function Dashboard() {
  const [addNewRecipeDialogOpen, setAddNewRecipeDialogOpen] =
    useState<boolean>(false);
  const refetchRecipes = () => {};
  return (
    <>
      <AddRecipeDialog
        open={addNewRecipeDialogOpen}
        openChanged={(newOpen) => {
          setAddNewRecipeDialogOpen(newOpen);
        }}
        onRecipeCreated={refetchRecipes}
      ></AddRecipeDialog>
      <motion.div
        initial={ANIM.initial}
        animate={ANIM.animate}
        transition={ANIM.transition.top}
        className={"w-full h-full min-h-[90vh] flex p-6"}
      >
        <RecipeList refetchRecipes={refetchRecipes}>
          <Button onClick={(_e) => setAddNewRecipeDialogOpen(true)}>
            <PlusCircleIcon></PlusCircleIcon>Add
          </Button>
        </RecipeList>
      </motion.div>
    </>
  );
}
