import { useState } from "react";
import type { Recipe } from "../../../api/meal";
import { Button } from "../../Button";

import styles from "./index.module.css";

type RecipeCardProps = {
  recipe: Recipe;
  onFeedback: (verdict: "like" | "dislike") => void;
};

export const RecipeCard = ({ recipe, onFeedback }: RecipeCardProps) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleLike = () => {
    onFeedback("like");
    setFeedbackGiven(true);
  };

  const handleDislike = () => {
    onFeedback("dislike");
    setFeedbackGiven(true);
  };

  return (
    <div className={styles.card}>
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className={styles.image}
      />

      <div className={styles.content}>
        <h2 className={styles.title}>{recipe.strMeal}</h2>

        <div className={styles.meta}>
          <span className={styles.badge}>{recipe.strCategory}</span>
          <span className={styles.badge}>{recipe.strArea}</span>
        </div>

        {recipe.strSource && (
          <a
            href={recipe.strSource}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View Full Recipe
          </a>
        )}

        {!feedbackGiven && (
          <div className={styles.feedback}>
            <p className={styles.feedbackQuestion}>
              Did it match your preference?
            </p>
            <div className={styles.feedbackButtons}>
              <Button onClick={handleLike}>Yes</Button>
              <Button variant="secondary" onClick={handleDislike}>
                No
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
