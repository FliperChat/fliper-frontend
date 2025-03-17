import { useTranslations } from "next-intl";
import styles from "./reg.module.scss";
import { RegAllStep } from "@/utils/types";

function RegistrationLastStep({
  setStep,
  data,
}: {
  setStep: (step: "two") => void;
  data: RegAllStep;
}) {
  const t = useTranslations("Auth.reg.stepEnd");

  return (
    <>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.email_content}>
        {t("content", { email: data.email as string })}
      </p>
      <button
        onClick={() => setStep("two")}
        className={`button_ebg ${styles.back_btn}`}
      >
        {t("btn")}
      </button>
    </>
  );
}

export default RegistrationLastStep;
