import { z } from "zod/mini";
import { BASE_URL, type Area, type Ingredient } from ".";

export type RecipeSummary = z.infer<typeof RecipeSummarySchema>;

const RecipeSummarySchema = z.object({
  idMeal: z.string(),
  strMeal: z.string(),
  strMealThumb: z.string(),
});
const RecipeSummaryListResponseSchema = z.object({
  meals: z.nullable(z.array(RecipeSummarySchema)),
});

const fetchRecipesSummary = async (
  queryParam: string,
  value: string,
): Promise<RecipeSummary[]> => {
  const params = new URLSearchParams({ [queryParam]: value });
  const response = await fetch(`${BASE_URL}/filter.php?${params}`);
  if (!response.ok) throw new Error("Failed to fetch recipes");
  const data = RecipeSummaryListResponseSchema.parse(await response.json());
  return data.meals ?? [];
};

export const fetchRecipesSummaryByArea = (area: Area) =>
  fetchRecipesSummary("a", area);

export const fetchRecipesSummaryByIngredient = (ingredient: Ingredient) =>
  fetchRecipesSummary("i", ingredient);
