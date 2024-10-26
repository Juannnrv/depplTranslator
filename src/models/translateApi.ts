export const fetchLanguages = async () => {
  const url =
    "https://deep-translate1.p.rapidapi.com/language/translate/v2/languages";
  const options = {
    method: "GET",
    headers: {
      'x-rapidapi-key': '6945049258mshb1a156c47eb1f24p172a4cjsn790b765d9a6c',
      'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
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
