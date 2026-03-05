import { Button } from "../Button";
import styles from "./index.module.css";

type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className={styles.error} role="alert">
    <p>{message}</p>
    {onRetry && <Button onClick={onRetry}>Try Again</Button>}
  </div>
);
