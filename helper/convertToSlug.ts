import unidecode from "unidecode";

export const convertToSlug = (text: string) => {
  const unidecodeText = unidecode(text.trim());

  const slug: string = unidecodeText.replace(/\s+/g, "-").toLowerCase();

  return slug;
};
