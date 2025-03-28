"use client";

import { Input, InputWithItem } from "@/components/input/customInput";
import useForm from "@/hooks/useForm";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { z } from "zod";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next/client";

export const getStepTwoSchema = (t: (key: string) => string) =>
  z.object({
    login: z.string().min(5, t("errors.loginErr")),
    password: z.string().min(8, t("errors.passwordErr")),
  });

function SignInClient() {
  const t = useTranslations("Auth.login");
  const { values, errors, handleChange, handleSubmit, setErrors } = useForm(
    {
      login: "",
      password: "",
    },
    handleSubmitBtn,
    getStepTwoSchema(t)
  );
  const [showEye, setShowEye] = useState<boolean>(false);

  const router = useRouter();

  async function handleSubmitBtn(values: { [key: string]: string | Blob }) {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/profile/signin",
        values,
        {
          headers: {
            "X-Lang": getCookie("lang")?.toString(),
          },
        }
      );
    } catch (error: any) {
      if (
        error?.response?.status === 404 &&
        error?.response?.data.message === "User not found"
      ) {
        setErrors((prev) => ({
          ...prev,
          login: t("errors.loginErr"),
          password: t("errors.passwordErr"),
        }));
      }
    }
  }

  return (
    <>
      <h1 className="title">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="form" noValidate>
        <Input
          type="text"
          name="login"
          placeholder={t("name")}
          value={values.login as string}
          onChange={handleChange}
          error={errors?.login || undefined}
        />
        <InputWithItem
          type={showEye ? "text" : "password"}
          name="password"
          className="password"
          placeholder={t("password")}
          value={values.password as string}
          onChange={handleChange}
          error={errors?.password || undefined}
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
        <button type="submit" className="button_bg">
          {t("btn1")}
        </button>
      </form>
      <div className="choice_a">
        <Link href="/accounts/forgot" className="link link_a">
          {t("forgot")}
        </Link>
        <div className="or">{t("or")}</div>
        <button
          className="button_ebg second_btn"
          onClick={() => router.push("/accounts/signup")}
        >
          {t("btn2")}
        </button>
        <Link href="/accounts" className="link link_a">
          {t("cancel")}
        </Link>
      </div>
    </>
  );
}

export default SignInClient;
