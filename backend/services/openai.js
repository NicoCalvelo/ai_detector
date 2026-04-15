import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Assurez-vous de définir cette variable d'environnement

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

const SYSTEM_PROMPT = `Tu es un expert en détection de contenu généré par IA.
Analyse le texte fourni et retourne UNIQUEMENT un JSON valide,
sans markdown, sans commentaire, avec exactement ces champs :
{
  "verdict": "HUMAIN" | "IA" | "HYBRIDE" | "INDETERMINABLE",
  "confidence": entier entre 0 et 100,
  "indices": [liste de 3 strings max décrivant les indices détectés],
  "limite": string ou null si pas de limite à signaler
}
Règles :
- HYBRIDE si le texte mélange écriture humaine et lissage IA
- INDETERMINABLE si tu ne peux pas trancher avec une confiance > 60%
- Ne force jamais un verdict binaire si tu n'es pas sûr
- Les indices doivent nommer des éléments précis du texte`;

/**
 * Analyse stylistique d'un texte via GPT-4o.
 * @param {string} text - Le texte à analyser.
 * @returns {Promise<{verdict: string, confidence: number, indices: string[], limite: string|null}>}
 *   verdict    : 'HUMAIN' | 'IA' | 'HYBRIDE' | 'INDETERMINABLE'
 *   confidence : 0–100
 *   indices    : jusqu'à 3 indices textuels détectés
 *   limite     : remarque sur les limites de l'analyse, ou null
 */
async function detectOpenAI(text) {
    const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: text },
        ],
    });

    const raw = response.choices[0].message.content;

    try {
        return JSON.parse(raw);
    } catch {
        throw new Error(`OpenAI a retourné une réponse non-JSON : ${raw}`);
    }
}

export { detectOpenAI };
