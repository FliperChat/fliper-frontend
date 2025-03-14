import { GetServerSidePropsContext } from "next";
import { langConvert } from "./converts";

export function getLang({ req }: GetServerSidePropsContext | any): string {
  const locale =
    req.cookies.lang ||
    langConvert(
      req.headers["accept-language"]?.split(",")[0]?.split("-")[0] as string
    ) ||
    "en";

  return locale;
}
