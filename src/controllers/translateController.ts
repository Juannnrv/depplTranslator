import { fetchLanguages } from "../models/translateApi";

export const getLanguages = async () => {
  try {
    const languages = await fetchLanguages();
    return languages;
  } catch (error) {
    console.error("Error in controller:", error);
    throw error;
  }
};

export const detectLanguage = async (text: string): Promise<any> => {
  const url =
    "https://deep-translate1.p.rapidapi.com/language/translate/v2/detect";

  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "6945049258mshb1a156c47eb1f24p172a4cjsn790b765d9a6c",
      "x-rapidapi-host": "deep-translate1.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: text }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error detecting language:", error);
    throw error;
  }
};

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  const url = "https://deep-translate1.p.rapidapi.com/language/translate/v2";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "6945049258mshb1a156c47eb1f24p172a4cjsn790b765d9a6c",
      "x-rapidapi-host": "deep-translate1.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: text, source: sourceLang, target: targetLang }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log("API response:", result); // Log the entire API response for debugging
    const translatedText = result?.data?.translations?.translatedText;
    if (translatedText) {
      return translatedText;
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
};
