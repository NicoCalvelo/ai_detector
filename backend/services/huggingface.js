const HF_API_KEY = process.env.HF_API_KEY; // Assurez-vous de définir cette variable d'environnement

const MODELS = {
  roberta:
    "https://router.huggingface.co/hf-inference/models/openai-community/roberta-base-openai-detector",
  chatgpt:
    "https://router.huggingface.co/hf-inference/models/Hello-SimpleAI/chatgpt-detector-roberta",
};

// Safe word count per chunk (~200 words ≈ 400 tokens, well under the 512-token limit)
// Using a conservative value to handle non-English/subword-heavy content
const CHUNK_WORDS = 200;

function splitIntoChunks(text) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += CHUNK_WORDS) {
    chunks.push(words.slice(i, i + CHUNK_WORDS).join(" "));
  }
  return chunks;
}

/**
 * Détecte si un texte est généré par IA via HuggingFace.
 * Le texte est découpé en chunks pour respecter la limite de 512 tokens des modèles.
 * Les scores sont moyennés sur l'ensemble des chunks.
 * @param {string} text - Le texte à analyser.
 * @param {'roberta' | 'chatgpt'} model - Le modèle à utiliser (défaut: 'roberta').
 * @returns {Promise<Array<{label: string, score: number}>>}
 *   Exemple : [{ label: 'FAKE', score: 0.91 }, { label: 'REAL', score: 0.09 }]
 *   FAKE = généré par IA, REAL = humain
 */
async function classifyChunk(endpoint, chunk) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: chunk }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HuggingFace API error ${response.status}: ${err}`);
  }

  const result = await response.json();
  // Single-input response: [[{ label, score }, ...]]
  return result[0];
}

async function detectHuggingFace(text, model = "roberta") {
  const endpoint = MODELS[model];
  if (!endpoint)
    throw new Error(
      `Modèle inconnu : ${model}. Utilisez 'roberta' ou 'chatgpt'.`,
    );

  const chunks = splitIntoChunks(text);

  // Send one request per chunk in parallel to avoid batch response format ambiguity
  const results = await Promise.all(
    chunks.map((chunk) => classifyChunk(endpoint, chunk)),
  );

  // Average scores across all chunks
  const totals = {};
  for (const chunkResult of results) {
    for (const { label, score } of chunkResult) {
      totals[label] = (totals[label] ?? 0) + score;
    }
  }
  const averaged = Object.entries(totals).map(([label, total]) => ({
    label,
    score: total / results.length,
  }));

  const top = averaged.sort((a, b) => b.score - a.score)[0];
  const verdict = top.label.toLowerCase() === "real" ? "HUMAIN" : "IA";
  const confidence = Math.round(top.score * 100);

  return { verdict, confidence, indices: [] };
}

export { detectHuggingFace };
