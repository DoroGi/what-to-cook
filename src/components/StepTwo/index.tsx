import { useEffect, useState } from "react";
import {
  fetchIngredients,
  fetchRecipesSummaryByIngredient,
  type Ingredient,
  type RecipeSummary,
} from "../../api/meal";
import { Button, Loader, ErrorMessage } from "..";
import { IngredientAutocomplete } from "./IngredientAutocomplete";
import styles from "./index.module.css";

type StepTwoProps = {
  selectedIngredient: Ingredient | null;
  onIngredientChange: (ingredient: Ingredient | null) => void;
  onBack: () => void;
  onSuccess: (recipes: RecipeSummary[]) => void;
};

export const StepTwo = ({
  selectedIngredient,
  onIngredientChange,
  onBack,
  onSuccess,
}: StepTwoProps) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIngredients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIngredients();
      setIngredients(data);
    } catch {
      setError("Failed to load ingredients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const handleSubmit = async () => {
    if (!selectedIngredient) return;
    setLoading(true);
    setError(null);
    try {
      const recipes = await fetchRecipesSummaryByIngredient(selectedIngredient);
      if (recipes.length === 0) {
        setError("No recipes found for this ingredient. Try a different one.");
        return;
      }
      onSuccess(recipes);
    } catch {
      setError(
        "Failed to load recipes. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>
      <h2 className={styles.title}>Step 2: Choose an Ingredient</h2>

      {loading && <Loader />}
      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={ingredients.length === 0 ? loadIngredients : handleSubmit}
        />
      )}
      {!loading && !error && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="ingredient-input" className={styles.label}>
              Main Ingredient
            </label>
            <IngredientAutocomplete
              ingredients={ingredients}
              value={selectedIngredient}
              onChange={onIngredientChange}
            />
          </div>

          <div className={styles.actions}>
            <Button
              onClick={handleSubmit}
              disabled={!selectedIngredient || loading}
            >
              Find Recipe
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
