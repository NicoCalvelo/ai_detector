import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import { detectHuggingFace } from './services/huggingface.js';
import { detectOpenAI } from './services/openai.js';
import { detectSapling } from './services/sapling.js';

const app = express();
const PORT = 5000;

// Autorise les requêtes provenant d'autres domaines (ton futur front-end)
app.use(cors()); 
// Permet à Express de lire le JSON envoyé dans le corps des requêtes
app.use(express.json()); 

async function extractTextFromHtml(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        
        const html = await response.text();
        const $ = cheerio.load(html);
        
        $('script, style, noscript, iframe, nav, footer, header').remove();
        
        let text = $('body').text();
        return text.replace(/\s+/g, ' ').trim();
    } catch (error) {
        throw new Error(`Échec de l'extraction: ${error.message}`);
    }
}

/**
 * Création de la route API (Endpoint)
 * On utilise POST car on va envoyer une URL dans le corps de la requête
 */
app.post('/api/extract', async (req, res) => {
    const targetUrl = req.body.url;

    if (!targetUrl) {
        return res.status(400).json({ erreur: "Veuillez fournir une 'url' dans le corps de la requête." });
    }

    try {
        console.log(`📡 Scraping en cours pour : ${targetUrl}`);
        const extractedText = await extractTextFromHtml(targetUrl);
        
        // On renvoie le résultat en JSON propre
        res.json({
            success: true,
            url: targetUrl,
            length: extractedText.length,
            content: extractedText
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            erreur: error.message
        });
    }
});

app.post('/api/detect', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ erreur: "Veuillez fournir un champ 'text' dans le corps de la requête." });
    }

    const [huggingfaceResult, openaiResult, saplingResult] = await Promise.allSettled([
        detectHuggingFace(text),
        detectOpenAI(text),
        detectSapling(text),
    ]);

    res.json([
        {
            service: 'huggingface',
            success: huggingfaceResult.status === 'fulfilled',
            data: huggingfaceResult.status === 'fulfilled' ? huggingfaceResult.value : null,
            error: huggingfaceResult.status === 'rejected' ? huggingfaceResult.reason.message : null,
        },
        {
            service: 'openai',
            success: openaiResult.status === 'fulfilled',
            data: openaiResult.status === 'fulfilled' ? openaiResult.value : null,
            error: openaiResult.status === 'rejected' ? openaiResult.reason.message : null,
        },
        {
            service: 'sapling',
            success: saplingResult.status === 'fulfilled',
            data: saplingResult.status === 'fulfilled' ? saplingResult.value : null,
            error: saplingResult.status === 'rejected' ? saplingResult.reason.message : null,
        },
    ]);
});

// Gestionnaire d'erreurs global (ex: JSON malformé)
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ erreur: "Corps de la requête invalide : JSON malformé." });
    }
    next(err);
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
    console.log(`👉 Endpoint disponible : POST http://localhost:${PORT}/api/extract`);
});