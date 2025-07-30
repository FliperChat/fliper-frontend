"use client";
import { ObjectType } from "@/utils/types";
import { useState } from "react";
import { z, ZodError } from "zod";

export default function useForm(
  initialValue?: { [key: string]: string },
  onSubmitCallback?: (values: ObjectType) => void,
  schema?: z.ZodSchema
) {
  const [values, setValues] = useState<ObjectType>(initialValue || {});
  const [errors, setErrors] = useState<ObjectType>({});
  const isValid = Object.values(errors).some((err: unknown) => {
    if (err === null || err === undefined) return true;

    if (typeof err === "string" || Array.isArray(err)) {
      return err.length === 0;
    }

    return false;
  });

  const handleZodError = (error: ZodError) => {
    const newErrors: { [key: string]: string } = {};
    error.errors.forEach((err) => {
      if (err.path.length > 0) {
        newErrors[err.path[0]] = err.message;
      }
    });
    setErrors(newErrors);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setValues((prev: ObjectType) => ({
      ...prev,
      [name]: value,
    }));

    if ((errors?.[name] as string)?.length > 0)
      setErrors((prev: ObjectType) => ({
        ...prev,
        [name]: null,
      }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (schema) schema?.parse(values);

      if (onSubmitCallback) onSubmitCallback(values);
    } catch (error) {
      if (error instanceof ZodError) {
        handleZodError(error);
      }
    }
  }

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleSubmit,
    setErrors,
  };
}
