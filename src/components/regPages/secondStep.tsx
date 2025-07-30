import { RegAllStep } from "@/utils/types";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
      path: ["passwordConfirm"],
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
  type FormData = z.infer<typeof stepTwoSchema>;
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    getValues,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { ...(data as FormData) },
  });

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const watchImage = watch("image");
  const croppedImageUrl = watchImage
    ? URL.createObjectURL(watchImage as Blob)
    : null;

  const [showEye, setShowEye] = useState<boolean>(false);
  const [showEye2, setShowEye2] = useState<boolean>(false);

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

  async function handleSubmitBtn(data: FormData) {
    try {
      const tempData: RegAllStep = { ...data, ...getValues() };

      setData((prev) => ({
        ...prev,
        ...getValues(),
      }));

      const form = new FormData();

      for (const key in tempData) {
        if (tempData.hasOwnProperty(key)) {
          const value = tempData[key as keyof RegAllStep];

          if (value instanceof Blob) {
            form.append(key, value);
          } else if (value instanceof Date) {
            form.append(key, value.toISOString());
          } else if (value !== undefined && value !== null) {
            form.append(key, String(value));
          }
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

      if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);

      setStep("end");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            setError(err.path[0] as keyof FormData, {
              type: "manual",
              message: err.message,
            });
          }
        });
      }

      if (axios.isAxiosError(error) && error?.response?.status === 409) {
        const message = error.response.data.message;

        if (message.includes("E-mail")) {
          setError("email", {
            type: "manual",
            message: t("errors.emailExist"),
          });
        }
        if (message.includes("Login")) {
          setError("login", {
            type: "manual",
            message: t("errors.loginExist"),
          });
        }
      }
    }
  }

  return (
    <>
      <AvatarModal
        canvasRef={canvasRef}
        image={image}
        setData={(blob) => setValue("image", blob, { shouldValidate: true })}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      <form
        onSubmit={handleSubmit(handleSubmitBtn)}
        className="form formtwo"
        noValidate
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
              placeholder={t("login")}
              {...register("login")}
              error={errors?.login?.message}
            />
            <Input
              type="email"
              placeholder={t("email")}
              {...register("email")}
              error={errors?.email?.message}
            />
            <InputWithItem
              type={showEye ? "text" : "password"}
              className="password"
              placeholder={t("password")}
              {...register("password")}
              error={errors?.password?.message}
            >
              {showEye ? (
                <Image
                  src="/assets/icons/passwordEyeV.svg"
                  width={25}
                  height={25}
                  alt="pass_eye"
                  draggable={false}
                  className="eye"
                  onClick={() => setShowEye(!showEye)}
                />
              ) : (
                <Image
                  src="/assets/icons/passwordEyeH.svg"
                  width={25}
                  height={25}
                  alt="pass_eye"
                  draggable={false}
                  className="eye"
                  onClick={() => setShowEye(!showEye)}
                />
              )}
            </InputWithItem>
            <InputWithItem
              type={showEye2 ? "text" : "password"}
              className="password"
              placeholder={t("passwordConfirm")}
              {...register("passwordConfirm")}
              error={errors?.passwordConfirm?.message}
            >
              {showEye2 ? (
                <Image
                  src="/assets/icons/passwordEyeV.svg"
                  width={25}
                  height={25}
                  alt="pass_eye"
                  draggable={false}
                  className="eye"
                  onClick={() => setShowEye2(!showEye2)}
                />
              ) : (
                <Image
                  src="/assets/icons/passwordEyeH.svg"
                  width={25}
                  height={25}
                  alt="pass_eye"
                  draggable={false}
                  className="eye"
                  onClick={() => setShowEye2(!showEye2)}
                />
              )}
            </InputWithItem>
          </div>
        </div>
        <div className="pagination">
          <div className="not_active"></div>
          <div className="active"></div>
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
        className="back_link"
      >
        {t("back")}
      </Link>
    </>
  );
}

export default RegistrationSecondStep;
