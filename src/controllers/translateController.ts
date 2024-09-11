import { fetchLanguages } from "../models/translateApi";

export const getLanguages = async () => {
    try {
      const languages = await fetchLanguages();
      return languages;
    } catch (error) {
      console.error('Error in controller:', error);
      throw error;
    }
  }