import type { Recipe } from "@/bindings/Recipe";
import { ANIM, cn, getRecipeImageFromStoredBase64String } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PenBoxIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { EditRecipeDialog } from "@/features/recipe-crud/components/edit-recipe";

export function RecipeView({
  recipe,
  onRecipeUpdated,
  onRecipeDeleted,
}: {
  recipe: Recipe;
  onRecipeUpdated?: (recipe: Recipe) => void;
  onRecipeDeleted: () => void;
}) {
  const handleRecipeDelete = async (recipeId: string) => {
    try {
      await invoke("delete_recipe_command", { id: parseInt(recipeId) });
    } catch (error) {
      toast.error("Failed to delete recipe");
      return;
    }
    toast.success("Recipe deleted successfully");
    onRecipeDeleted();
  };
  return (
    <motion.div
      initial={ANIM.initial}
      animate={ANIM.animate}
      transition={{ duration: 0.2, ease: "easeInOut" as const }}
      exit={{
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2, ease: "easeInOut" as const },
      }}
      className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col items-stretch justify-start"
    >
      <Card className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden p-4 md:p-6">
        <CardHeader className="flex shrink-0 flex-row items-center justify-between">
          <div className="flex flex-col items-start justify-center">
            <CardTitle className="text-3xl font-bold">{recipe.name}</CardTitle>
            <CardDescription>{recipe.category}</CardDescription>
          </div>
          <div className="flex flex-row items-center justify-center gap-4">
            <EditRecipeDialog recipe={recipe} onRecipeUpdated={onRecipeUpdated}>
              <Button variant="outline">
                <PenBoxIcon />
                Edit
              </Button>
            </EditRecipeDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="">
                  <TrashIcon />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-destructive">
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={(_e) =>
                      handleRecipeDelete(recipe.id?.toString() ?? "")
                    }
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 min-w-0 flex-1 flex-col items-stretch justify-start gap-4 overflow-y-auto overscroll-y-contain">
          {recipe.images.length > 0 ? (
            <Carousel
              className="w-full"
              opts={{
                align: "center",
                loop: recipe.images.length > 1,
                dragFree: false,
              }}
            >
              <CarouselContent className="-ml-2 sm:-ml-3">
                {recipe.images.map((image, index) => (
                  <CarouselItem
                    key={`${recipe.id ?? recipe.name}-${index}`}
                    className={cn(
                      "pl-2 sm:pl-3",
                      recipe.images.length === 1
                        ? "basis-full"
                        : "basis-[88%] sm:basis-[82%] md:basis-[78%] lg:basis-[70%]",
                    )}
                  >
                    <div className="bg-muted/40 relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-inner ring-1 ring-border/50">
                      <img
                        src={getRecipeImageFromStoredBase64String(image)}
                        alt={`${recipe.name} — image ${index + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {recipe.images.length > 1 ? (
                <>
                  <div className="absolute top-1/2 left-3 z-20 -translate-y-1/2 md:left-4">
                    <div className="relative isolate flex items-center justify-center">
                      {/* Radial scrim behind the control so it reads on busy images */}
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute top-1/2 left-1/2 z-0 h-[7.25rem] w-[7.25rem] -translate-x-1/2 -translate-y-1/2 rounded-full",
                          "bg-[radial-gradient(circle_closest-side,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0.12)_42%,transparent_72%)]",
                          "dark:bg-[radial-gradient(circle_closest-side,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.2)_48%,transparent_74%)]",
                        )}
                      />
                      <CarouselPrevious
                        variant="outline"
                        size="icon-xl"
                        className={cn(
                          "!relative !top-auto !right-auto !bottom-auto !left-auto !translate-none touch-manipulation rounded-full shadow-sm dark:bg-primary dark:text-primary-foreground hover:cursor-pointer",
                        )}
                      />
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-3 z-20 -translate-y-1/2 md:right-4">
                    <div className="relative isolate flex items-center justify-center">
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute top-1/2 left-1/2 z-0 h-[5.25rem] w-[5.25rem] -translate-x-1/2 -translate-y-1/2 rounded-full",
                          "bg-[radial-gradient(circle_closest-side,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0.12)_42%,transparent_72%)]",
                          "dark:bg-[radial-gradient(circle_closest-side,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.2)_48%,transparent_74%)]",
                        )}
                      />
                      <CarouselNext
                        variant="outline"
                        size="icon-xl"
                        className={cn(
                          "!relative !top-auto !right-auto !bottom-auto !left-auto !translate-none touch-manipulation rounded-full shadow-sm dark:bg-primary dark:text-primary-foreground hover:cursor-pointer",
                        )}
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </Carousel>
          ) : null}
          <Separator className="w-full bg-black/25 dark:invert"></Separator>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-8">
            <section
              aria-labelledby="recipe-ingredients-heading"
              className="flex min-w-0 flex-col gap-2"
            >
              <h2 id="recipe-ingredients-heading" className="text-xl font-bold">
                Ingredients
              </h2>
              <ul className="list-inside list-disc gap-4 flex flex-col items-stretch justify-start">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={`${ingredient}-${i}`} className="font-mono">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>
            <section
              aria-labelledby="recipe-steps-heading"
              className="flex min-w-0 flex-col gap-2"
            >
              <h2 id="recipe-steps-heading" className="text-xl font-bold">
                Steps
              </h2>
              <ol className="list-inside list-decimal gap-4 flex flex-col items-stretch justify-start">
                {recipe.steps.map((step, i) => (
                  <li key={`${step}-${i}`}>{step}</li>
                ))}
              </ol>
            </section>
            <section
              aria-labelledby="recipe-notes-heading"
              className="border-border/60 flex min-w-0 flex-col gap-2 border-t pt-6 lg:col-span-2 lg:pt-8"
            >
              <h2 id="recipe-notes-heading" className="text-xl font-bold">
                Notes
              </h2>
              <p className="text-base">
                {recipe.notes?.trim() ? recipe.notes : "—"}
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
