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
import { ChevronRightIcon, EyeIcon, SearchIcon } from "lucide-react";
import Fuse from "fuse.js";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Select value: show every category */
const ALL_CATEGORIES = "__all__" as const;

type SortOption = "name-asc" | "name-desc" | "category";

export function RecipeList({
  children,
  refetchRecipes,
}: {
  children?: ReactNode;
  refetchRecipes: () => void;
}) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadRecipes = async () => {
      const fetchedRecipes = await invoke<Recipe[]>("get_recipes_command");
      setRecipes(fetchedRecipes);
    };
    void loadRecipes();
  }, [refetchRecipes]);

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
    >
      <Card
        className={
          "min-w-sm max-w-md min-h-full bg-secondary/50 p-6 rounded-lg"
        }
      >
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl">All Recipes</CardTitle>
          {children}
        </CardHeader>
        <Separator className="w-full bg-black/25 dark:invert"></Separator>

        {recipes.length > 0 ? (
          <>
            <div className="relative pt-4 items-center flex flex-row">
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
            <div className="grid grid-cols-2 gap-2 pt-3">
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
            <div className="mt-3 flex flex-col gap-0">
              {filteredSortedRecipes.map((recipe: Recipe) => (
                <RecipeListItem
                  key={recipe.id ?? recipe.name}
                  recipe={recipe}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-3 px-1 text-center text-sm">
              No recipes match your search or filters.
            </p>
          )
        ) : (
          <p className="text-muted-foreground text-center text-sm">{`No Recipes Yet!`}</p>
        )}
      </Card>
    </motion.div>
  );
}

export function RecipeListItem({ recipe }: { recipe: Recipe }) {
  const firstImage = recipe.images[0];
  const hasImage = Boolean(firstImage?.trim());

  return (
    <Card className="relative mb-2 overflow-hidden py-0">
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
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`View ${recipe.name}`}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
