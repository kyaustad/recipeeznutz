import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Recipe } from "@/bindings/Recipe";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ImagePlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function parseLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

const recipeFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    category: z.string().trim().min(1, "Category is required"),
    ingredientsRaw: z.string(),
    stepsRaw: z.string(),
    images: z.array(z.string()),
    notes: z.string(),
  })
  .superRefine((data, ctx) => {
    if (parseLines(data.ingredientsRaw).length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Add at least one ingredient (one per line).",
        path: ["ingredientsRaw"],
      });
    }
    if (parseLines(data.stepsRaw).length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Add at least one step (one per line).",
        path: ["stepsRaw"],
      });
    }
  });

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

function recipeToFormValues(r: Recipe): RecipeFormValues {
  return {
    name: r.name,
    category: r.category,
    ingredientsRaw: r.ingredients.join("\n"),
    stepsRaw: r.steps.join("\n"),
    images: [...r.images],
    notes: r.notes ?? "",
  };
}

function formValuesToRecipe(values: RecipeFormValues, id: number): Recipe {
  return {
    id,
    name: values.name.trim(),
    category: values.category.trim(),
    ingredients: parseLines(values.ingredientsRaw),
    steps: parseLines(values.stepsRaw),
    images: values.images,
    notes: values.notes.trim() === "" ? null : values.notes.trim(),
  };
}

export function EditRecipeDialog({
  recipe,
  children,
  onRecipeUpdated,
}: {
  recipe: Recipe;
  children: ReactNode;
  onRecipeUpdated?: (recipe: Recipe) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<RecipeFormValues>({
    resolver: standardSchemaResolver(recipeFormSchema),
    defaultValues: recipeToFormValues(recipe),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const images = watch("images");

  useEffect(() => {
    if (open) {
      reset(recipeToFormValues(recipe));
    }
  }, [open, recipe, reset]);

  const onPickFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;
    try {
      const next = await Promise.all(
        Array.from(list).map((f) => readFileAsDataUrl(f)),
      );
      setValue("images", [...images, ...next], { shouldValidate: true });
    } catch {
      toast.error("Could not read one or more image files.");
    }
    e.target.value = "";
  };

  const removeImageAt = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const onSubmit = handleSubmit(async (values) => {
    if (recipe.id == null) {
      toast.error("Cannot update a recipe without an id.");
      return;
    }
    const updated = formValuesToRecipe(values, recipe.id);
    setSubmitting(true);
    try {
      await invoke("update_recipe_command", { recipe: updated });
      toast.success("Recipe updated.");
      onRecipeUpdated?.(updated);
      setOpen(false);
    } catch (err) {
      toast.error(String(err));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[70vh] min-h-[50vh] min-w-[min(100%,42rem)] flex-col gap-0 overflow-hidden sm:max-w-2xl">
        <DialogHeader className="my-2">
          <DialogTitle>Edit recipe</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden pe-1"
        >
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="edit-recipe-name">Name</FieldLabel>
              <FieldContent>
                <Input
                  id="edit-recipe-name"
                  autoComplete="off"
                  placeholder="e.g. Weeknight lentil soup"
                  {...register("name")}
                />
                <FieldError errors={[errors.name]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.category}>
              <FieldLabel htmlFor="edit-recipe-category">Category</FieldLabel>
              <FieldContent>
                <Input
                  id="edit-recipe-category"
                  autoComplete="off"
                  placeholder="e.g. Dinner"
                  {...register("category")}
                />
                <FieldError errors={[errors.category]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.ingredientsRaw}>
              <FieldLabel htmlFor="edit-recipe-ingredients">
                Ingredients
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="edit-recipe-ingredients"
                  placeholder={
                    "One ingredient per line\n2 cups flour\n1 tsp salt"
                  }
                  rows={5}
                  className="min-h-[120px] resize-y font-mono text-sm"
                  {...register("ingredientsRaw")}
                />
                <FieldError errors={[errors.ingredientsRaw]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.stepsRaw}>
              <FieldLabel htmlFor="edit-recipe-steps">Steps</FieldLabel>
              <FieldContent>
                <Textarea
                  id="edit-recipe-steps"
                  placeholder={
                    "One step per line\nPreheat oven\nMix dry ingredients"
                  }
                  rows={5}
                  className="min-h-[120px] resize-y font-mono text-sm"
                  {...register("stepsRaw")}
                />
                <FieldError errors={[errors.stepsRaw]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.images}>
              <FieldLabel>Images</FieldLabel>
              <FieldContent className="gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={onPickFiles}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlusIcon className="size-4" />
                  Add images
                </Button>
                <p className="text-muted-foreground text-xs">
                  Existing images are kept.
                </p>
                {images.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {images.map((src, i) => (
                      <li
                        key={`${i}-${src.slice(0, 32)}`}
                        className="bg-muted/40 flex items-center gap-3 rounded-lg border p-2"
                      >
                        <img
                          src={src}
                          alt=""
                          className="size-12 shrink-0 rounded-md object-cover"
                        />
                        <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">
                          Image {i + 1}
                        </span>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="shrink-0"
                          onClick={() => removeImageAt(i)}
                          aria-label={`Remove image ${i + 1}`}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <FieldError errors={[errors.images]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-recipe-notes">
                Notes (optional)
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="edit-recipe-notes"
                  placeholder="Tips, substitutions, storage…"
                  rows={3}
                  className="resize-y"
                  {...register("notes")}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-auto gap-2 border-t pt-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
