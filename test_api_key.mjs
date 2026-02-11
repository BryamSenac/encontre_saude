
import { API_KEY } from './config/env.js';

const modelName = "gemini-2.5-flash";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

console.log(`Testing model: ${modelName}`);

try {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: "Hello, reply with 'OK'" }]
            }]
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log("SUCCESS: Model worked!");
        console.log("Response:", data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
        console.log("FAILURE: Status", response.status);
        console.log(await response.text());
    }
} catch (error) {
    console.error("Error:", error);
}
