import { HfInference } from '@huggingface/inference';

// Récupération sécurisée du Token
const hfToken = process.env.HF_TOKEN;
const hf = new HfInference(hfToken);

export default async function handler(req, res) {
  // Gestion du CORS pour autoriser le frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  const { prompt, temperature, max_tokens } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Le champ "prompt" est requis.' });
  }

  if (!hfToken) {
    return res.status(500).json({ error: 'Le token HF_TOKEN est manquant sur le serveur.' });
  }

  try {
    // Appel à l'API Hugging Face avec des options configurables
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: max_tokens ? parseInt(max_tokens) : 200,
        temperature: temperature ? parseFloat(temperature) : 0.7,
        return_full_text: false
      }
    });

    return res.status(200).json({ result: response.generated_text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

