import { useState, useEffect, useMemo } from "react";
import {
  fetchRecipeDetails,
  type Recipe,
  type RecipeSummary,
} from "../../api/meal";
import { Button, Loader, ErrorMessage } from "..";
import { RecipeCard } from "./RecipeCard";
import styles from "./index.module.css";

type ResultProps = {
  recipesByArea: RecipeSummary[];
  recipesByIngredient: RecipeSummary[];
  onBack: () => void;
  onReset: () => void;
  onFeedback: (verdict: "like" | "dislike", recipe: Recipe) => void;
};

export const Result = ({
  recipesByArea,
  recipesByIngredient,
  onBack,
  onReset,
  onFeedback,
}: ResultProps) => {
  const candidates = useMemo(() => {
    const areaIds = new Set(recipesByArea.map((r) => r.idMeal));
    return recipesByIngredient.filter((r) => areaIds.has(r.idMeal));
  }, [recipesByIngredient, recipesByArea]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [usedRecipeIds, setUsedRecipeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      setError(null);
      if (candidates.length <= usedRecipeIds.size) {
        setError(
          "No more recipes available with these filters. Try different combinations.",
        );
        return setLoading(false);
      }
      const unseen = candidates.filter((r) => !usedRecipeIds.has(r.idMeal));
      const candidate = unseen[Math.floor(Math.random() * unseen.length)];
      try {
        const recipe = await fetchRecipeDetails(candidate.idMeal);
        setRecipe(recipe);
      } catch {
        setError("Failed to load recipe. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [candidates, usedRecipeIds]);

  const handleNewIdea = () => {
    if (!recipe) return;
    setUsedRecipeIds((prev) => new Set([...prev, recipe.idMeal]));
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={onBack} />;

  return (
    <>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <div className={styles.actionsRight}>
          <Button variant="secondary" onClick={handleNewIdea}>
            New Idea
          </Button>
          <Button onClick={onReset}>Start Over</Button>
        </div>
      </div>
      <RecipeCard
        recipe={recipe!}
        onFeedback={(verdict) => onFeedback(verdict, recipe!)}
      />
    </>
  );
};
