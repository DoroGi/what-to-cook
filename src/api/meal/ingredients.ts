import { z } from "zod/mini";
import { BASE_URL } from ".";

export type Ingredient = string;

const IngredientSchema = z.string();
const IngredientListResponseSchema = z.object({
  meals: z.nullable(z.array(z.object({ strIngredient: IngredientSchema }))),
});

export const fetchIngredients = async (): Promise<Ingredient[]> => {
  const response = await fetch(`${BASE_URL}/list.php?i=list`);
  if (!response.ok) throw new Error("Failed to fetch ingredients");
  const data = IngredientListResponseSchema.parse(await response.json());
  return data.meals?.map((m) => m.strIngredient) ?? [];
};
