import * as cheerio from 'cheerio';

export async function extractTextFromHtml(url) {
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
