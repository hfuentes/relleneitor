const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getChatGPTResponse = async (inputText) => {
    const apiKey = process.env.GPT_APIKEY;
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };
    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: inputText
            }],
        temperature: 0.7
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        const generatedText = jsonResponse.choices[0].message.content;
        return generatedText;
    } catch (error) {
        console.error('Error al solicitar la respuesta de ChatGPT:', error);
        return null;
    }
};

const start = () => {
    document.addEventListener('keyup', async () => {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea')) {
            const inputValue = activeElement.value.trim();
            const regex = /\/ai\s(.*?)\s\/ai/;
            const match = inputValue.match(regex)
            if (match) {
                const extractedText = match[1];
                console.log('Texto extraído:', extractedText);
                activeElement.value = "pensando...";
                const response = await getChatGPTResponse(extractedText);
                activeElement.value = response || 'No se pudo obtener una respuesta';
                activeElement.focus();
            }
        }
    });
};

start();