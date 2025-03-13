import styles from "./auth.module.css";

function AuthComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.auth_background}>
      <main className={styles.auth_block}>{children}</main>
      <footer className={styles.auth_footer}>
        &#169; {new Date().getFullYear()} Flip
      </footer>
    </div>
  );
}

export default AuthComponent;
