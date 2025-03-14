import fs from "fs/promises";
import path from "path";

const cache = new Map<string, Record<string, any>>();

export const serverSideTranslations = async (
  locale: string,
  namespaces: string[]
) => {
  const translations: Record<string, any> = {};

  if (namespaces.length === 0) namespaces.push("common");

  for (const ns of namespaces) {
    const cacheKey = `${locale}-${ns}`;
    if (cache.has(cacheKey)) {
      translations[ns] = cache.get(cacheKey);
      continue;
    }

    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        "locales",
        locale,
        `${ns}.json`
      );
      const fileContent = await fs.readFile(filePath, "utf-8");
      const jsonData = JSON.parse(fileContent);

      cache.set(cacheKey, jsonData);
      translations[ns] = jsonData;
    } catch (error) {
      console.warn(`Ошибка загрузки файла ${locale}/${ns}.json:`, error);
      translations[ns] = {};
    }
  }

  return translations;
};
