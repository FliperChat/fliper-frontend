import { z } from "zod";
import validator from "validator";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { RegAllStep } from "@/utils/types";
import { Input } from "../input/customInput";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  type FormData = z.infer<typeof stepOneSchema>;
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
  } = useForm<FormData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: { ...(data as FormData) },
  });

  async function handleSubmitBtn(data: FormData) {
    try {
      setData((prev) => ({
        ...prev,
        ...data,
      }));
      setStep("two");
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
    }
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
          {...register("name")}
          error={errors?.name?.message}
        />
        <Input
          type="text"
          placeholder={t("phone")}
          {...register("phone")}
          error={errors?.phone?.message}
        />
        <Input
          type="date"
          placeholder={t("date")}
          {...register("birthDay")}
          error={errors?.birthDay?.message}
        />
        <div className="pagination">
          <div className="active"></div>
          <div className="not_active"></div>
        </div>
        <button type="submit" className="button_bg">
          {t("next")}
        </button>
      </form>
      <Link href="/accounts" className="link cancel">
        {t("cancel")}
      </Link>
    </>
  );
}

export default RegistrationFirstStep;
