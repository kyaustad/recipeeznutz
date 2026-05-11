import { motion } from "motion/react";
import { ANIM, cn, getRecipeImageFromStoredBase64String } from "@/lib/utils";
import type { Recipe } from "@/bindings/Recipe";
import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect, useMemo, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRightIcon,
  SquareArrowRightExitIcon,
  SearchIcon,
  SquareArrowRightEnterIcon,
  Trash2Icon,
} from "lucide-react";
import Fuse from "fuse.js";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/** Matches `EXPORT_CANCELLED` from `src-tauri/src/db.rs` when the save dialog is dismissed. */
const EXPORT_CANCELLED_CODE = "EXPORT_CANCELLED";

function invokeErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return String(error);
}

/** Select value: show every category */
const ALL_CATEGORIES = "__all__" as const;

type SortOption = "name-asc" | "name-desc" | "category";

export function RecipeList({
  children,
  recipesReloadToken,
  onRecipeSelected,
  activeRecipe,
  onRecipesImported,
  onRecipesDeleted,
}: {
  children?: ReactNode;
  /** Increment from parent to reload the list after mutations */
  recipesReloadToken: number;
  onRecipeSelected: (recipe: Recipe) => void;
  activeRecipe: Recipe | null;
  onRecipesImported: () => void;
  onRecipesDeleted: () => void;
}) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [importRecipesDialogOpen, setImportRecipesDialogOpen] = useState(false);
  const [deleteAllRecipesDialogOpen, setDeleteAllRecipesDialogOpen] =
    useState(false);

  useEffect(() => {
    const loadRecipes = async () => {
      const fetchedRecipes = await invoke<Recipe[]>("get_recipes_command");
      setRecipes(fetchedRecipes);
    };
    void loadRecipes();
  }, [recipesReloadToken]);

  const categories = useMemo(() => {
    const names = recipes.map((r) => r.category.trim()).filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [recipes]);

  useEffect(() => {
    if (
      categoryFilter !== ALL_CATEGORIES &&
      !categories.includes(categoryFilter)
    ) {
      setCategoryFilter(ALL_CATEGORIES);
    }
  }, [categories, categoryFilter]);

  const filteredSortedRecipes = useMemo(() => {
    let list =
      categoryFilter === ALL_CATEGORIES
        ? [...recipes]
        : recipes.filter((r) => r.category === categoryFilter);

    const q = searchQuery.trim();
    if (q) {
      const fuse = new Fuse(list, {
        keys: [
          { name: "name", weight: 0.45 },
          { name: "category", weight: 0.2 },
          {
            name: "ingredients",
            weight: 0.25,
            getFn: (r: Recipe) => r.ingredients.join(" "),
          },
          {
            name: "notes",
            weight: 0.1,
            getFn: (r: Recipe) => r.notes ?? "",
          },
        ],
        threshold: 0.38,
        ignoreLocation: true,
        ignoreDiacritics: true,
      });
      list = fuse.search(q).map((r) => r.item);
    }

    switch (sortBy) {
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "category":
        list.sort(
          (a, b) =>
            a.category.localeCompare(b.category) ||
            a.name.localeCompare(b.name),
        );
        break;
      default:
        list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [recipes, sortBy, categoryFilter, searchQuery]);

  return (
    <motion.div
      initial={ANIM.initial}
      animate={ANIM.animate}
      transition={ANIM.transition.mid}
      className="flex h-full min-h-0 flex-col"
    >
      <Card
        className={
          "flex min-h-0 min-w-0 w-full max-w-md flex-1 flex-col bg-secondary/50 p-4 sm:p-6 rounded-lg"
        }
      >
        <CardHeader className="flex shrink-0 flex-row items-center justify-between">
          <CardTitle className="text-xl">All Recipes</CardTitle>
          {children}
        </CardHeader>
        <Separator className="w-full shrink-0 bg-black/25 dark:invert"></Separator>

        {recipes.length > 0 ? (
          <>
            <div className="relative flex shrink-0 flex-row items-center pt-4">
              <SearchIcon
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 "
                aria-hidden
              />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes…"
                className="h-8 pl-8"
                aria-label="Search recipes"
              />
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-2 pt-3">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-muted-foreground text-xs font-medium">
                  Sort
                </span>
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortOption)}
                >
                  <SelectTrigger size="sm" className="w-full min-w-0">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-muted-foreground text-xs font-medium">
                  Category
                </span>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger size="sm" className="w-full min-w-0">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={ALL_CATEGORIES}>
                      All categories
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        ) : null}

        {recipes.length > 0 ? (
          filteredSortedRecipes.length > 0 ? (
            // overflow-hidden: establishes flex minimum so only the inner pane scrolls (not Card clip squashing items)
            <div className="mt-3 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]"
                role="list"
                aria-label="Recipe list"
              >
                <div className="flex flex-col gap-2">
                  {filteredSortedRecipes.map((recipe: Recipe) => (
                    <RecipeListItem
                      key={recipe.id ?? recipe.name}
                      recipe={recipe}
                      onRecipeSelected={onRecipeSelected}
                      isActive={activeRecipe?.id === recipe.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground mt-3 shrink-0 px-1 text-center text-sm">
              No recipes match your search or filters.
            </p>
          )
        ) : (
          <p className="text-muted-foreground shrink-0 text-center text-sm">{`No Recipes Yet!`}</p>
        )}
      </Card>
      <Separator className="w-full shrink-0 bg-black/25 dark:invert mt-2 max-w-md"></Separator>
      <div className="flex shrink-0 flex-row items-center justify-between p-4 max-w-md">
        <Button
          variant="default"
          disabled={recipes.length === 0}
          onClick={async () => {
            try {
              await invoke("export_recipes_command");
              toast.success("Recipes exported successfully.");
            } catch (error) {
              const msg = invokeErrorMessage(error);
              if (
                msg === EXPORT_CANCELLED_CODE ||
                msg.includes(EXPORT_CANCELLED_CODE)
              ) {
                toast.message("Export cancelled", {
                  description: "No file was saved.",
                });
              } else {
                toast.error(msg || "Export failed.");
              }
            }
          }}
        >
          <SquareArrowRightExitIcon />
          Export All Recipes
        </Button>
        <Dialog
          open={importRecipesDialogOpen}
          onOpenChange={setImportRecipesDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="default">
              <SquareArrowRightEnterIcon />
              Import Recipes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Recipes</DialogTitle>
            </DialogHeader>
            <DialogDescription>Import recipes from a file.</DialogDescription>
            {/* <Input type="file" accept=".nutbook" /> */}
            <div className="flex flex-row items-center gap-2">
              <Checkbox
                id="replace-existing"
                checked={replaceExisting}
                onCheckedChange={(checked) =>
                  setReplaceExisting(
                    checked === "indeterminate" ? false : checked,
                  )
                }
              />
              <Label htmlFor="replace-existing">Replace existing recipes</Label>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="default"
                onClick={() =>
                  invoke("import_recipes_command", {
                    replaceExisting: replaceExisting,
                  })
                    .then(() => {
                      toast.success("Recipes imported successfully");
                      onRecipesImported();
                      setImportRecipesDialogOpen(false);
                    })
                    .catch((error) => {
                      toast.error(`Failed to import recipes: ${error}`);
                    })
                }
              >
                Choose File
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex shrink-0 flex-row items-center justify-center p-2 pt-0 max-w-md">
        <Dialog
          open={deleteAllRecipesDialogOpen}
          onOpenChange={setDeleteAllRecipesDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={recipes.length === 0}>
              <Trash2Icon />
              Delete All Recipes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete All Recipes</DialogTitle>
            </DialogHeader>
            <DialogDescription>This action cannot be undone.</DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() =>
                  invoke("delete_all_recipes_command")
                    .then(() => {
                      toast.success("All recipes deleted successfully");
                      onRecipesImported();
                      onRecipesDeleted();
                      setDeleteAllRecipesDialogOpen(false);
                    })
                    .catch((error) => {
                      toast.error(`Failed to delete all recipes: ${error}`);
                    })
                }
              >
                Delete All Recipes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}

export function RecipeListItem({
  recipe,
  onRecipeSelected,
  isActive,
}: {
  recipe: Recipe;
  onRecipeSelected: (recipe: Recipe) => void;
  isActive: boolean;
}) {
  const firstImage = recipe.images[0];
  const hasImage = Boolean(firstImage?.trim());

  return (
    <Card
      role="listitem"
      className="relative mb-2 shrink-0 overflow-hidden py-0"
    >
      <CardContent className="flex min-h-[88px] gap-0 p-0">
        <div className="relative z-10 flex w-1/2 flex-col justify-center gap-0.5 px-4 py-2.5">
          <CardTitle className="text-base font-semibold leading-snug">
            {recipe.name}
          </CardTitle>
          <CardDescription className="leading-tight">
            {recipe.category}
          </CardDescription>
        </div>

        <div className="relative w-1/2 min-h-[88px] shrink-0">
          {hasImage ? (
            <img
              src={getRecipeImageFromStoredBase64String(firstImage!)}
              alt=""
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                // Fade image into the card surface — same bg-card shows through; no overlay seam
                "[mask-image:linear-gradient(to_right,hsl(0_0%_0%/0)_0%,hsl(0_0%_0%/0.22)_22%,hsl(0_0%_0%/1)_52%,hsl(0_0%_0%/1)_100%)]",
                "[-webkit-mask-image:linear-gradient(to_right,hsl(0_0%_0%/0)_0%,hsl(0_0%_0%/0.22)_22%,hsl(0_0%_0%/1)_52%,hsl(0_0%_0%/1)_100%)]",
              )}
            />
          ) : (
            <div className="absolute inset-0 bg-muted/35" aria-hidden />
          )}
          <div className="relative z-10 flex h-full items-center justify-end p-2">
            <div className="relative isolate flex items-center justify-center">
              {/* Radial scrim behind the control so it reads on busy / tinted images */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute left-1/2 top-1/2 z-0 h-[7.25rem] w-[7.25rem] -translate-x-1/2 -translate-y-1/2 rounded-full",
                  "bg-[radial-gradient(circle_closest-side,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0.12)_42%,transparent_72%)]",
                  "dark:bg-[radial-gradient(circle_closest-side,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.2)_48%,transparent_74%)]",
                )}
              />
              <Button
                type="button"
                variant={"outline"}
                size="icon-xl"
                className="relative z-10 shadow-sm dark:bg-primary dark:text-primary-foreground hover:cursor-pointer rounded-full"
                aria-label={`View ${recipe.name}`}
                onClick={() => onRecipeSelected(recipe)}
              >
                <ChevronRightIcon
                  className={cn(
                    "size-6 transition-transform duration-200",
                    isActive && "size-8 rotate-180 text-destructive ",
                  )}
                />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
