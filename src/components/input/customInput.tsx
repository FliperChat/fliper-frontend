import styles from "./customInput.module.scss";

export function Input({
  error = "",
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
}) {
  return (
    <fieldset>
      <div
        className={`${error?.length > 0 ? styles.inp_field_error : ""} ${
          styles.input_field
        }`}
      >
        <input
          {...props}
          className={`${className} ${styles.input} ${
            error.length > 0 ? styles.inp_error : ""
          }`.trim()}
        />
      </div>
      {error.length > 0 ? <p className={styles.error}>{error}</p> : null}
    </fieldset>
  );
}

export function InputWithItem({
  children,
  error = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <fieldset>
      <div
        className={`${error?.length > 0 ? styles.inp_field_error : ""} ${
          styles.input_field
        }`}
      >
        <input
          {...props}
          className={`${props.className} ${styles.input} ${
            error.length > 0 ? styles.inp_error : ""
          }`}
        />
        {children}
      </div>
      {error.length > 0 ? <p className={styles.error}>{error}</p> : null}
    </fieldset>
  );
}
