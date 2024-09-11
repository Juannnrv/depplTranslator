export const fetchLanguages = async () => {
  const url =
    "https://deep-translate1.p.rapidapi.com/language/translate/v2/languages";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "347f9d77aemsh69fd8070901c04cp1445c6jsndfe73e6482a7",
      "x-rapidapi-host": "deep-translate1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.languages;
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw error;
  }
};
