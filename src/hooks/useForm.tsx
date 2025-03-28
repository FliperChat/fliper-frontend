"use client";
import { useState } from "react";
import { z, ZodError } from "zod";

export default function useForm(
  initialValue?: { [key: string]: string },
  onSubmitCallback?: (values: { [key: string]: string | Blob }) => void,
  schema?: z.ZodSchema
) {
  const [values, setValues] = useState<{ [key: string]: string | Blob }>(
    initialValue || {}
  );
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const isValid = Object.values(errors).some(
    (err: string | null) => !err || err.length === 0
  );

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

    setValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    if ((errors?.[name] as string)?.length > 0)
      setErrors((prev: any) => ({
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
