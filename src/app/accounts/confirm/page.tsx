"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function SingUpConfirm({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (!searchParams) {
    notFound();
  }

  const at = (await searchParams)?.at;
  if (!at) {
    notFound();
  }

  const lang = (await cookies()).get("lang")?.value || "en";

  let status;
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/confirm-reg?at=${at}&lang=${lang}`,
      null,
      {
        headers: {
          "X-Lang": lang,
        },
      }
    );

    status = response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404 || error.response?.status === 406) {
        notFound();
      }
    }
  }

  if (status === 202) redirect("/accounts/signin");

  return null;
}
