import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { type Recipe, type Area, type Ingredient, type RecipeSummary } from "./api/meal";
import {
  type HistoryEntry,
  StepOne,
  StepTwo,
  Result,
  History,
} from "./components";
import styles from "./App.module.css";

type AppStep = "step1" | "step2" | "result";
type FormState = {
  area: Area | null;
  ingredient: Ingredient | null;
};

const App = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("step1");
  const [formState, setFormState] = useState<FormState>({
    area: null,
    ingredient: null,
  });
  const [recipesByArea, setRecipesByArea] = useState<RecipeSummary[]>([]);
  const [recipesByIngredient, setRecipesByIngredient] = useState<RecipeSummary[]>([]);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    "recipe-history",
    [],
  );

  const handleFeedback = (verdict: "like" | "dislike", recipe: Recipe) => {
    if (!formState.area || !formState.ingredient) return;

    const entry: HistoryEntry = {
      id: recipe.idMeal,
      title: recipe.strMeal,
      image: recipe.strMealThumb,
      timestamp: Date.now(),
      liked: verdict === "like",
      filters: {
        area: formState.area,
        ingredient: formState.ingredient,
      },
    };

    setHistory((prev) => [...prev, entry]);
  };

  const handleReset = () => {
    setCurrentStep("step1");
    setFormState({ area: null, ingredient: null });
    setRecipesByArea([]);
    setRecipesByIngredient([]);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>What to cook?</h1>
      </header>

      <main className={styles.main}>
        {currentStep === "step1" && (
          <StepOne
            selectedArea={formState.area}
            onAreaChange={(area) => setFormState((prev) => ({ ...prev, area }))}
            onSuccess={(recipes) => {
              setRecipesByArea(recipes);
              setCurrentStep("step2");
            }}
          />
        )}

        {currentStep === "step2" && (
          <StepTwo
            selectedIngredient={formState.ingredient}
            onIngredientChange={(ingredient) =>
              setFormState((prev) => ({ ...prev, ingredient }))
            }
            onBack={() => setCurrentStep("step1")}
            onSuccess={(recipes) => {
              setRecipesByIngredient(recipes);
              setCurrentStep("result");
            }}
          />
        )}

        {currentStep === "result" && (
          <Result
            recipesByArea={recipesByArea}
            recipesByIngredient={recipesByIngredient}
            onBack={() => setCurrentStep("step2")}
            onReset={handleReset}
            onFeedback={handleFeedback}
          />
        )}

        <History entries={history} onClear={() => setHistory([])} />
      </main>
    </div>
  );
};

export default App;
