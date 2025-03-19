import { z } from "zod";
import validator from "validator";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { RegAllStep, RegStepOne } from "@/utils/types";
import { Input } from "../input/customInput";
import { useTranslations } from "next-intl";
import styles from "./reg.module.scss";

export const getStepOneSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t("errors.nameMin")),
    phone: z.string().refine(validator.isMobilePhone, {
      message: t("errors.invalidPhone"),
    }),
    birthDay: z.coerce
      .date({
        required_error: t("errors.requiredDate"),
        invalid_type_error: t("errors.invalidDate"),
      })
      .refine(
        (date) => {
          const today = new Date();
          const minAgeDate = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );
          return date <= minAgeDate;
        },
        {
          message: t("errors.birthdayMinAge"),
          path: ["birthday"],
        }
      ),
  });

function RegistrationFirstStep({
  setStep,
  data,
  setData,
}: {
  setStep: (step: "two") => void;
  data: RegAllStep;
  setData: Dispatch<SetStateAction<RegAllStep>>;
}) {
  const t = useTranslations("Auth.reg.stepOne");

  const stepOneSchema = getStepOneSchema(t);

  const [formData, setFormData] = useState<RegStepOne>(data);
  const [errors, setErrors] = useState<{ [key: string]: string }>();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if ((errors?.[name] as string)?.length > 0)
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    try {
      stepOneSchema.parse({
        ...formData,
        date: new Date(formData?.birthDay as string),
      });

      setData((prev) => ({
        ...prev,
        ...formData,
      }));
      setStep("two");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  }

  return (
    <>
      <h1 className={styles.title}>{t("title")}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="text"
          name="name"
          placeholder={t("name")}
          value={formData.name}
          onChange={handleChange}
          error={errors?.name}
        />
        <Input
          type="text"
          name="phone"
          placeholder={t("phone")}
          value={formData.phone}
          onChange={handleChange}
          error={errors?.phone}
        />
        <Input
          type="date"
          name="birthDay"
          placeholder={t("date")}
          value={formData.birthDay as string}
          onChange={handleChange}
          error={errors?.birthDay}
        />
        <div className={styles.pagination}>
          <div className={styles.active}></div>
          <div className={styles.not_active}></div>
        </div>
        <button type="submit" className="button_bg">
          {t("next")}
        </button>
      </form>
      <Link href="/accounts" className={`link ${styles.cancel}`}>
        {t("cancel")}
      </Link>
    </>
  );
}

export default RegistrationFirstStep;
