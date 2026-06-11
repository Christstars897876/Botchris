const tempInput = document.getElementById('temperature');
const tempVal = document.getElementById('temp-val');
const tokensInput = document.getElementById('max-tokens');
const tokensVal = document.getElementById('tokens-val');
const sendBtn = document.getElementById('send-btn');
const promptInput = document.getElementById('prompt');
const outputDiv = document.getElementById('output');

// Mettre à jour l'affichage des sliders
tempInput.addEventListener('input', () => tempVal.textContent = tempInput.value);
tokensInput.addEventListener('input', () => tokensVal.textContent = tokensInput.value);

sendBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert("Veuillez entrer un prompt !");
        return;
    }

    outputDiv.textContent = "Génération en cours...";
    sendBtn.disabled = true;

    try {
        // Appelle notre API Serverless sur Vercel
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                temperature: parseFloat(tempInput.value),
                max_tokens: parseInt(tokensInput.value)
            })
        });

        const data = await response.json();

        if (response.ok) {
            outputDiv.textContent = data.result;
        } else {
            outputDiv.textContent = `Erreur : ${data.error}`;
        }
    } catch (err) {
        outputDiv.textContent = "Erreur de connexion avec l'API.";
    } finally {
        sendBtn.disabled = false;
    }
});

