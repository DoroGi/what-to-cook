import { useEffect, useState } from "react";
import {
  fetchAreas,
  fetchRecipesSummaryByArea,
  type Area,
  type RecipeSummary,
} from "../../api/meal";
import { Loader, ErrorMessage, Button } from "..";

import styles from "./index.module.css";

type StepOneProps = {
  selectedArea: Area | null;
  onAreaChange: (area: Area | null) => void;
  onSuccess: (recipes: RecipeSummary[]) => void;
};

export const StepOne = ({
  selectedArea,
  onAreaChange,
  onSuccess,
}: StepOneProps) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAreas();
      setAreas(data);
    } catch {
      setError("Failed to load cuisines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleNext = async () => {
    if (!selectedArea) return;
    setLoading(true);
    setError(null);
    try {
      const recipes = await fetchRecipesSummaryByArea(selectedArea);
      if (recipes.length === 0) {
        setError("No recipes found for this cuisine. Try a different one.");
        return;
      }
      onSuccess(recipes);
    } catch {
      setError("Failed to load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Step 1: Choose a Cuisine</h2>

      {loading && <Loader />}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={loadAreas} />
      )}
      {!loading && !error && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="area-select" className={styles.label}>
              Cuisine / Area
            </label>
            <select
              id="area-select"
              value={selectedArea ?? ""}
              onChange={(e) => onAreaChange(e.target.value || null)}
              className={styles.select}
            >
              <option value="">Select a cuisine...</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.actions}>
            <Button onClick={handleNext} disabled={!selectedArea || loading}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
