import styles from "./index.module.css";

type ButtonProps = {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({
  variant = "primary",
  children,
  onClick,
  disabled,
}: ButtonProps) => (
  <button
    className={`${styles.button} ${styles[variant]}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
