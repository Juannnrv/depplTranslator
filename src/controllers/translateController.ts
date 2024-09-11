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
      "x-rapidapi-key": "347f9d77aemsh69fd8070901c04cp1445c6jsndfe73e6482a7",
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
): Promise<any> => {
  const url = "https://deep-translate1.p.rapidapi.com/language/translate/v2";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "347f9d77aemsh69fd8070901c04cp1445c6jsndfe73e6482a7",
      "x-rapidapi-host": "deep-translate1.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
};
