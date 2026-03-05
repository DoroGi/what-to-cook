import { useState, useRef, useEffect } from "react";
import { useDebounce } from "./hooks/useDebounce";
import styles from "./index.module.css";

type IngredientAutocompleteProps = {
  ingredients: string[];
  value: string | null;
  onChange: (value: string | null) => void;
};

export const IngredientAutocomplete = ({
  ingredients,
  value,
  onChange,
}: IngredientAutocompleteProps) => {
  const [searchTerm, setSearchTerm] = useState(value ?? "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const filteredIngredients = ingredients
    .filter((ing) => ing.toLowerCase().includes(debouncedSearch.toLowerCase()))
    .slice(0, 10);

  const handleInputChange = (newValue: string) => {
    setSearchTerm(newValue);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
    if (newValue !== value) {
      onChange(null);
    }
  };

  const handleSelect = (ingredient: string) => {
    setSearchTerm(ingredient);
    onChange(ingredient);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredIngredients.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredIngredients.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredIngredients.length - 1,
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredIngredients[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.autocomplete}>
      <input
        ref={inputRef}
        id="ingredient-input"
        type="text"
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder="Start typing an ingredient..."
        className={styles.input}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showSuggestions && filteredIngredients.length > 0}
        aria-controls="ingredient-suggestions"
      />
      {showSuggestions && filteredIngredients.length > 0 && (
        <ul
          ref={suggestionsRef}
          id="ingredient-suggestions"
          className={styles.suggestions}
          role="listbox"
        >
          {filteredIngredients.map((ing, index) => (
            <li
              key={ing}
              onClick={() => handleSelect(ing)}
              className={`${styles.suggestionItem} ${index === highlightedIndex ? styles.highlighted : ""}`}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              {ing}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
