const SAPLING_API_KEY = process.env.SAPLING_API_KEY; // Assurez-vous de définir cette variable d'environnement
const SAPLING_ENDPOINT = "https://api.sapling.ai/api/v1/aidetect";

/**
 * Détecte si un texte est généré par IA via Sapling.
 * @param {string} text - Le texte à analyser.
 * @returns {Promise<{score: number, sentence_scores: Array<{sentence: string, score: number}>}>}
 *   score : 0.0 (humain) → 1.0 (certainement IA)
 *   sentence_scores : score par phrase pour visualiser les parties suspectes
 */
async function detectSapling(text) {
  const response = await fetch(SAPLING_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: SAPLING_API_KEY,
      text,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Sapling API error ${response.status}: ${err}`);
  }

  return response.json();
}

export { detectSapling };
