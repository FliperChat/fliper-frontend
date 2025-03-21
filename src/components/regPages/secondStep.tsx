import { RegAllStep, RegStepTwo } from "@/utils/types";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./reg.module.scss";
import Link from "next/link";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Input, InputWithItem } from "../input/customInput";
import Image from "next/image";
import { changeScrollActive } from "@/services/scroll";
import AvatarModal from "../modals/avatar/avatarModal";
import axios from "axios";
import { getCookie } from "cookies-next/client";

export const getStepTwoSchema = (t: (key: string) => string) =>
  z
    .object({
      login: z.string().min(5, t("errors.loginMin")),
      email: z.string().email(t("errors.emailCorrect")),
      password: z
        .string()
        .min(8, t("errors.passwordMin"))
        .max(50, t("errors.passwordMax"))
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

  const [showModal, setShowModal] = useState<boolean>(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [formData, setFormData] = useState<RegStepTwo>(data);
  const [errors, setErrors] = useState<{ [key: string]: string }>();

  const croppedImageUrl = formData.image
    ? URL.createObjectURL(formData.image)
    : null;

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

  function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;

    if (!files || files?.length < 1) return;

    const img = new window.Image();
    img.src = URL.createObjectURL(files[0]);
    img.onload = () => {
      setImage(img);
      setShowModal(true);
      changeScrollActive();
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    try {
      stepTwoSchema.parse(formData);

      const tempData = { ...data, ...formData };

      setData((prev) => ({
        ...prev,
        ...formData,
      }));

      const form = new FormData();

      for (const key in tempData) {
        if (tempData.hasOwnProperty(key)) {
          form.append(key, tempData[key as keyof RegAllStep] as any);
        }
      }

      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/profile/signup",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Lang": getCookie("lang")?.toString(),
          },
        }
      );

      setStep("end");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }

      if (error?.response?.status === 409) {
        const message = error.response.data.message;

        if (message.includes("E-mail")) {
          setErrors((prev) => ({
            ...prev,
            email: t("errors.emailExist"),
          }));
        }
        if (message.includes("Login")) {
          setErrors((prev) => ({
            ...prev,
            login: t("errors.loginExist"),
          }));
        }
      }
    }
  }

  return (
    <>
      <AvatarModal
        canvasRef={canvasRef}
        image={image}
        setFormData={setFormData}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      <form
        onSubmit={handleSubmit}
        className={`${styles.form} ${styles.formtwo}`}
      >
        <div className={styles.reg_block}>
          <div
            className={`${styles.upload_img} ${
              croppedImageUrl ? styles.uploaded_img : ""
            }`}
          >
            {croppedImageUrl ? (
              <>
                <p
                  className={styles.uploadText}
                  onClick={() => fileRef?.current?.click()}
                >
                  {t("uploaded")}
                </p>
                <Image
                  src={croppedImageUrl}
                  className={styles.croppedImg}
                  width={200}
                  height={200}
                  alt="prev img"
                  draggable={false}
                />
                <Image
                  src="/assets/icons/uploadImg.svg"
                  onClick={() => fileRef?.current?.click()}
                  width={200}
                  height={200}
                  alt="uploaded_image"
                  className={styles.borderImg}
                  draggable={false}
                />
              </>
            ) : (
              <>
                <p>{t("upload")}</p>
                <Image
                  src="/assets/icons/uploadReg.svg"
                  width={200}
                  height={200}
                  className={styles.upload_icon}
                  alt="upload_image"
                  onClick={() => fileRef?.current?.click()}
                  draggable={false}
                />
              </>
            )}
            <input
              type="file"
              ref={fileRef}
              className={styles.fileInput}
              accept=".png, .jpeg, .jpg"
              onChange={handleChangeFile}
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
              value={formData.email}
              onChange={handleChange}
              error={errors?.email}
            />
            <InputWithItem
              type={showEye ? "text" : "password"}
              name="password"
              className={styles.password}
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
              className={styles.password}
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
