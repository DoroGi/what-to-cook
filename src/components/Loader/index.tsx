import styles from "./index.module.css";

export const Loader = () => (
  <div className={styles.loader} role="status" aria-label="Loading">
    <div className={styles.spinner} />
  </div>
);
