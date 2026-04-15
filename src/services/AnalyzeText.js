import axios from "axios";

export const ExtractText = async (url) => {
  try {
    const response = await axios.post("http://localhost:5000/api/extract", {
      url: url,
    });

    console.log("Réponse API :", response.data);

    return response.data.content; // { success, url, length, content }
  } catch (error) {
    console.error("Erreur API :", error.response?.data || error.message);
    throw error;
  }
};

export const DetectText = async (text) => {
  const response = await axios.post("http://localhost:5000/api/detect", {
    text,
  });
  return response.data; // array of { service, success, data, error }
};
