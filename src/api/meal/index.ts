export const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export { fetchAreas, type Area } from "./areas";
export { fetchIngredients, type Ingredient } from "./ingredients";
export {
  fetchRecipesSummaryByArea,
  fetchRecipesSummaryByIngredient,
  type RecipeSummary,
} from "./recipeSummary";
export { fetchRecipeDetails, type Recipe } from "./recipe";
