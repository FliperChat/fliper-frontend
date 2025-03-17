import { RegAllStep, RegStepTwo } from "@/utils/types";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./reg.module.scss";
import Link from "next/link";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Input, InputWithItem } from "../input/customInput";
import Image from "next/image";

export const getStepTwoSchema = (t: (key: string) => string) =>
  z
    .object({
      login: z.string().min(5, t("errors.loginMin")),
      email: z.string().email(t("errors.emailCorrect")),
      password: z
        .string()
        .min(8, t("errors.passwordMin"))
        .regex(/[a-z]/, t("errors.passwordLowercase"))
        .regex(/\d/, t("errors.passwordNumber")),
      passwordConfirm: z.string(),
      image: z.any(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: t("errors.passwordsMatch"),
      path: ["passwordConfirm", "password"],
    });

function RegistrationSecondStep({
  setStep,
  data,
  setData,
}: {
  setStep: (step: "one" | "end") => void;
  data: RegAllStep;
  setData: Dispatch<SetStateAction<RegAllStep>>;
}) {
  const t = useTranslations("Auth.reg.stepTwo");

  const stepTwoSchema = getStepTwoSchema(t);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<RegStepTwo>(data);
  const [errors, setErrors] = useState<{ [key: string]: string }>();

  const [showEye, setShowEye] = useState<boolean>(false);
  const [showEye2, setShowEye2] = useState<boolean>(false);

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
      stepTwoSchema.parse(formData);

      setData((prev) => ({
        ...prev,
        ...formData,
      }));
      setStep("end");
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
      <form
        onSubmit={handleSubmit}
        className={`${styles.form} ${styles.formtwo}`}
      >
        <div className={styles.reg_block}>
          <div className={styles.upload_img}>
            <p>{t("upload")}</p>
            <Image
              src="/assets/icons/uploadReg.svg"
              width={200}
              height={200}
              alt="upload_image"
              onClick={() => fileRef?.current?.click()}
              draggable={false}
            />
            <input
              type="file"
              ref={fileRef}
              className={styles.fileInput}
              accept="image/png, image/jpeg, image/jpg"
              name="image"
            />
          </div>
          <div className={styles.form_data}>
            <Input
              type="text"
              name="login"
              placeholder={t("login")}
              value={formData.login}
              onChange={handleChange}
              error={errors?.login}
            />
            <Input
              type="email"
              name="email"
              placeholder={t("email")}
              value={formData.login}
              onChange={handleChange}
              error={errors?.login}
            />
            <InputWithItem
              type={showEye ? "text" : "password"}
              name="password"
              placeholder={t("password")}
              value={formData.password}
              onChange={handleChange}
              error={errors?.password}
            >
              {showEye ? (
                <Image
                  src="/assets/icons/passwordEyeV.svg"
                  width={25}
                  height={25}
                  alt="pass_eye"
                  draggable={false}
                  className={styles.eye}
                  onClick={() => setShowEye(!showEye)}
                />
              ) : (
                <Image
                  src="/assets/icons/passwordEyeH.svg"
                  width={25}
                  height={25}
                  alt="pass_eye"
                  draggable={false}
                  className={styles.eye}
                  onClick={() => setShowEye(!showEye)}
                />
              )}
            </InputWithItem>
            <InputWithItem
              type={showEye2 ? "text" : "password"}
              name="passwordConfirm"
              placeholder={t("passwordConfirm")}
              value={formData.passwordConfirm}
              onChange={handleChange}
              error={errors?.passwordConfirm}
            >
              {showEye2 ? (
                <Image
                  src="/assets/icons/passwordEyeV.svg"
                  width={25}
                  height={25}
                  alt="pass_eye"
                  draggable={false}
                  className={styles.eye}
                  onClick={() => setShowEye2(!showEye2)}
                />
              ) : (
                <Image
                  src="/assets/icons/passwordEyeH.svg"
                  width={25}
                  height={25}
                  alt="pass_eye"
                  draggable={false}
                  className={styles.eye}
                  onClick={() => setShowEye2(!showEye2)}
                />
              )}
            </InputWithItem>
          </div>
        </div>
        <div className={styles.pagination}>
          <div className={styles.not_active}></div>
          <div className={styles.active}></div>
        </div>
        <button type="submit" className={`button_bg ${styles.btn_p2}`}>
          {t("next")}
        </button>
      </form>
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();

          setStep("one");
        }}
        className={styles.back_link}
      >
        {t("back")}
      </Link>
    </>
  );
}

export default RegistrationSecondStep;
