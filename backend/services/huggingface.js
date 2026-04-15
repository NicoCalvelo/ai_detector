const HF_API_KEY = process.env.HF_API_KEY; // Assurez-vous de définir cette variable d'environnement

const MODELS = {
    roberta: 'https://router.huggingface.co/hf-inference/models/roberta-base-openai-detector/v1',
    chatgpt: 'https://router.huggingface.co/hf-inference/models/Hello-SimpleAI/chatgpt-detector-roberta/v1',
};

/**
 * Détecte si un texte est généré par IA via HuggingFace.
 * @param {string} text - Le texte à analyser.
 * @param {'roberta' | 'chatgpt'} model - Le modèle à utiliser (défaut: 'roberta').
 * @returns {Promise<Array<{label: string, score: number}>>}
 *   Exemple : [{ label: 'FAKE', score: 0.91 }, { label: 'REAL', score: 0.09 }]
 *   FAKE = généré par IA, REAL = humain
 */
async function detectHuggingFace(text, model = 'roberta') {
    const endpoint = MODELS[model];
    if (!endpoint) throw new Error(`Modèle inconnu : ${model}. Utilisez 'roberta' ou 'chatgpt'.`);

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`HuggingFace API error ${response.status}: ${err}`);
    }

    const result = await response.json();
    // result = [[{ label, score }, ...]]
    return result[0];
}

export { detectHuggingFace };
