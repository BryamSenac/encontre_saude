import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 🚨 SUA CHAVE DE API FICA EXPOSTA AQUI! NÃO FAÇA ISSO EM PRODUÇÃO!
const API_KEY = "AIzaSyBFuf8rcqo8_YchNIpYYxWHtfHM1Q2-duI";
const genAI = new GoogleGenerativeAI(API_KEY);

const promptMestre = `
        Você é um assistente de IA especializado em triagem de sintomas...
        [COLE AQUI O MESMO PROMPT MESTRE DETALHADO DA RESPOSTA ANTERIOR]
        ...
        Texto do Usuário:
        [AQUI_VOCE_INSERE_O_TEXTO_DO_USUARIO]
        `;

/**
 * Chama a API do Gemini diretamente do navegador.
 * @param {string} textoUsuario
 * @returns {Promise<number>}
 */
export async function avaliarSintomasDireto(textoUsuario) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const promptFinal = promptMestre.replace("[AQUI_VOCE_INSERE_O_TEXTO_DO_USUARIO]", textoUsuario);

        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        const avaliacaoTexto = response.text().trim();

        return parseInt(avaliacaoTexto, 10);

    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        return 0;
    }
}