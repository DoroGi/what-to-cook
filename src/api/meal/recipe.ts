import { z } from "zod/mini";
import { BASE_URL } from ".";

export type Recipe = z.infer<typeof RecipeSchema>;

const RecipeSchema = z.object({
  idMeal: z.string(),
  strMeal: z.string(),
  strCategory: z.string(),
  strArea: z.string(),
  strMealThumb: z.string(),
  strSource: z.url(),
});
const RecipeDetailResponseSchema = z.object({
  meals: z.array(RecipeSchema),
});

export const fetchRecipeDetails = async (id: string): Promise<Recipe> => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  if (!response.ok) throw new Error("Failed to fetch recipe details");
  const data = RecipeDetailResponseSchema.parse(await response.json());
  if (!data.meals?.length) throw new Error("Failed to fetch recipe details");
  return data.meals[0];
};
