"use client";

import { Input, InputWithItem } from "@/components/input/customInput";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { z } from "zod";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next/client";
import { useAuth } from "@/components/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

export const getStepTwoSchema = (t: (key: string) => string) =>
  z.object({
    login: z.string().min(5, t("errors.loginErr")),
    password: z.string().min(8, t("errors.passwordErr")),
  });

function SignInClient() {
  const [showEye, setShowEye] = useState<boolean>(false);

  const t = useTranslations("Auth.login");
  const { login } = useAuth();
  const router = useRouter();

  const schema = getStepTwoSchema(t);
  type FormData = z.infer<typeof schema>;
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/profile/signin",
        data,
        {
          headers: {
            "X-Lang": getCookie("lang")?.toString(),
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      login({ token: data.accessToken, refresh: data.refreshToken });
    },
    onError: (error: any) => {
      if (
        error?.response?.status === 404 &&
        error?.response?.data.message === "User not found"
      ) {
        setError("login", {
          type: "manual",
          message: t("errors.loginErr"),
        });

        setError("password", {
          type: "manual",
          message: t("errors.passwordErr"),
        });
      }
    },
  });

  async function handleSubmitBtn(data: FormData) {
    await mutation.mutateAsync(data);
  }

  return (
    <>
      <h1 className="title">{t("title")}</h1>
      <form
        onSubmit={handleSubmit(handleSubmitBtn)}
        className="form"
        noValidate
      >
        <Input
          type="text"
          placeholder={t("name")}
          {...register("login")}
          error={errors?.login?.message as string}
        />
        <InputWithItem
          type={showEye ? "text" : "password"}
          className="password"
          placeholder={t("password")}
          {...register("password")}
          error={errors?.password?.message as string}
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
        <button
          type="submit"
          className="button_bg"
          disabled={Object.keys(errors).length > 0}
        >
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
