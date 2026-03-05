import { Button } from "../Button";
import styles from "./index.module.css";

export type HistoryEntry = {
  id: string;
  title: string;
  image: string;
  timestamp: number;
  liked: boolean;
  filters: {
    area: string;
    ingredient: string;
  };
};
type HistoryProps = {
  entries: HistoryEntry[];
  onClear: () => void;
};

export const History = ({ entries, onClear }: HistoryProps) => {
  if (entries.length === 0) {
    return null;
  }

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>History</h3>
        <Button variant="secondary" onClick={onClear}>
          Clear History
        </Button>
      </div>
      <ul className={styles.list}>
        {sortedEntries.map((entry) => (
          <li key={`${entry.id}-${entry.timestamp}`} className={styles.item}>
            <img
              src={entry.image}
              alt={entry.title}
              className={styles.thumbnail}
            />
            <div className={styles.info}>
              <p className={styles.recipeName}>{entry.title}</p>
              <p className={styles.filters}>
                {entry.filters.area} / {entry.filters.ingredient}
              </p>
              <p className={styles.date}>
                {new Date(entry.timestamp).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`${styles.badge} ${entry.liked ? styles.liked : styles.disliked}`}
            >
              {entry.liked ? "Liked" : "Disliked"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
