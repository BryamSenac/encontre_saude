import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

export function createApi() {
    const API_KEY = "AIzaSyBFuf8rcqo8_YchNIpYYxWHtfHM1Q2-duI";
    const genAI = new GoogleGenerativeAI(API_KEY);


    const niveis = {
        1: {
            cor: '#5EA7FF',
            texto: 'Não Urgente',
            recomendacao: `Seus sintomas não apresentam sinais de urgência no momento. Continue observando com atenção. 
Mantenha uma rotina saudável, hidratação adequada e descanso. Caso perceba qualquer mudança como dor persistente, febre alta ou aumento da intensidade dos sintomas, procure orientação médica.

📞 Em caso de dúvidas ou piora, entre em contato com uma unidade básica de saúde ou ligue para o Disque Saúde: 136 (gratuito).`
        },

        2: {
            cor: '#ABFB4F',
            texto: 'Pouco Urgente',
            recomendacao: `Seus sintomas indicam um leve desconforto, que pode ser monitorado em casa. 
Mantenha repouso, boa alimentação, ingestão de líquidos e evite esforços físicos. Fique atento(a) à evolução dos sintomas.

📞 Se houver piora, como febre alta, dores intensas ou dificuldade para realizar tarefas simples, procure a unidade de saúde mais próxima ou ligue para o Disque Saúde 136.`
        },

        3: {
            cor: '#FFEA00',
            texto: 'Urgente',
            recomendacao: `Seus sintomas são significativos e indicam que você deve buscar avaliação médica em breve. 
Dirija-se a um posto de saúde, UPA ou pronto atendimento, especialmente se os sintomas persistirem ou piorarem.

⚠️ Evite postergar a busca por ajuda.

📞 Ligue para o Disque Saúde (136) para orientação ou procure uma unidade de saúde. Se sentir dificuldade para se locomover, peça ajuda a alguém de confiança.`
        },

        4: {
            cor: '#FF771C',
            texto: 'Muito Urgente',
            recomendacao: `Seus sintomas são intensos e requerem atenção médica imediata. 
Pode haver indícios de agravamento que não devem ser ignorados. Vá para um hospital ou unidade de atendimento 24 horas o quanto antes.

⚠️ Não espere os sintomas melhorarem por conta própria.

📞 Ligue 192 para o SAMU em caso de emergência ou procure ajuda com um familiar para se deslocar.`
        },

        5: {
            cor: '#D51717',
            texto: 'Emergência',
            recomendacao: `⚠️ Atenção seus sintomas indicam uma situação potencialmente grave. 
Pode haver risco à sua saúde e você deve procurar atendimento emergencial imediatamente.

❗ Sinais como dor no peito, falta de ar, desmaio, confusão ou febre alta persistente não devem ser ignorados.

📞 Ligue 192 para o SAMU imediatamente ou vá ao hospital mais próximo com auxílio de alguém. Caso esteja sozinho(a), peça ajuda a um vizinho, familiar ou utilize aplicativos de emergência.`
        }
    };



    const promptMestre = `
Você é um assistente de IA especializado em triagem de sintomas. Sua tarefa é analisar o texto fornecido por um usuário descrevendo seus sintomas e classificá-lo em uma escala de 1 a 5, com base nos seguintes fatores e suas respectivas pontuações.

Instruções de Classificação:
Analise o texto e atribua uma pontuação de 1 a 5. Sua resposta final deve ser APENAS O NÚMERO da classificação, nada mais.

Fatores para a Avaliação:
1. Presença de Sintomas de Alerta (Sinais Vermelhos)
2. Intensidade da Dor ou Desconforto
3. Duração e Evolução dos Sintomas
4. Impacto nas Atividades Diárias

Escala de Classificação Final:
1 - Nâo Urgente
2 - Pouco Urgente
3 - Urgente
4 - Muito Urgente
5 - Urgente

Tarefa:
Analise o texto do usuário abaixo e retorne APENAS o número de 1 a 5 correspondente à sua avaliação.

Texto do Usuário:
[AQUI_VOCE_INSERE_O_TEXTO_DO_USUARIO]
`;

    /**
     chama a API
      @param {string} textoUsuario
      @returns {Promise<number>} - Número da avaliação
     */

    async function avaliarSintomasDireto(textoUsuario) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const promptFinal = promptMestre.replace("[AQUI_VOCE_INSERE_O_TEXTO_DO_USUARIO]", textoUsuario);

            const result = await model.generateContent(promptFinal);
            const response = await result.response;
            const avaliacaoTexto = response.text().trim();

            const nivel = parseInt(avaliacaoTexto, 10);
            // Validar se número está dentro do esperado
            if (nivel >= 1 && nivel <= 5) {
                return nivel;
            } else {
                console.warn("Resposta da IA fora do esperado:", avaliacaoTexto);
                return 0;
            }
        } catch (error) {
            console.error("Erro ao chamar a API Gemini:", error);
            return 0;
        }
    }

    // Configura o botão para capturar texto
    document.getElementById('btn-avaliar').addEventListener('click', async () => {
        const texto = document.getElementById('text_chat').value;
        const input = document.getElementById('flip');
        if (!texto.trim()) {
            input.checked = true
            alert('Por favor, descreva seus sintomas.');
        } else {
            input.checked = false
            const nivel = await avaliarSintomasDireto(texto);
            const resultadoDiv = document.getElementById('resultado');
            const indicadorNivel = document.getElementById('indicador-nivel');
            alert(nivel)

            if (nivel > 0 && niveis[nivel]) {
                resultadoDiv.textContent = `- ${niveis[nivel].texto}\nRecomendação: ${niveis[nivel].recomendacao}`;
                resultadoDiv.style.color = "black";
                indicadorNivel.style.backgroundColor = niveis[nivel].cor;
            } else {
                resultadoDiv.textContent = "Não foi possível avaliar seus sintomas. Tente novamente.";
                resultadoDiv.style.color = "black";
                indicadorNivel.style.backgroundColor = "transparent";
            }
        }
    });









    //Substituir por uma função que é chamada no botão e analisa a resposta para devolver pro usuario
    /*
    document.getElementById('btn-avaliar').addEventListener('click', async () => {
        const texto = document.getElementById('texto-sintomas').value;
        if (!texto.trim()) {
            alert('Por favor, descreva seus sintomas.');
            return;
        }
    
        const numeroAvaliacao = await avaliarSintomasDireto(texto);
        const resultadoDiv = document.getElementById('resultado');
        if (numeroAvaliacao > 0) {
            resultadoDiv.textContent = `Nível de Atenção Avaliado: ${numeroAvaliacao}`;
        }
    }); /*
    
    
    /*
    Você é um assistente de IA especializado em triagem de sintomas. Sua tarefa é analisar o texto fornecido por um usuário descrevendo seus sintomas e classificá-lo em uma escala de 1 a 5, com base nos seguintes fatores e suas respectivas pontuações.
    
    **Instruções de Classificação:**
    Analise o texto e atribua uma pontuação de 1 a 5. Sua resposta final deve ser **APENAS O NÚMERO** da classificação, nada mais.
    
    **Fatores para a Avaliação (Exemplos):**
    
    * **Fator 1: Presença de Sintomas de Alerta (Sinais Vermelhos)**
        * Sintomas como: dificuldade para respirar, dor no peito, desmaio, confusão mental súbita, fala arrastada, febre muito alta e persistente (+39°C).
        * Se algum destes estiver presente, a classificação tende a ser 4 ou 5.
    
    * **Fator 2: Intensidade da Dor ou Desconforto**
        * O usuário descreve a dor como "leve", "suportável"? (Tende a 1-2)
        * O usuário descreve a dor como "forte", "intensa", "insuportável"? (Tende a 3-5)
    
    * **Fator 3: Duração e Evolução dos Sintomas**
        * Sintomas que começaram "hoje" ou "agora há pouco" e são leves. (Tende a 1-2)
        * Sintomas que persistem por "vários dias" ou estão "piorando". (Tende a 3-4)
    
    * **Fator 4: Impacto nas Atividades Diárias**
        * O usuário consegue realizar suas atividades normalmente? (Tende a 1-2)
        * O usuário está "de cama", "não consegue trabalhar", "não consegue comer"? (Tende a 4-5)
    
    **Escala de Classificação Final:**
    
    * **1 - Leve:** Sintomas muito brandos, sem impacto na rotina. (Ex: leve dor de cabeça, um espirro)
    * **2 - Moderado:** Desconforto presente, mas gerenciável. Leve impacto na rotina. (Ex: resfriado comum, dor de garganta leve)
    * **3 - Significativo:** Os sintomas são fortes e claramente impactam o bem-estar e as atividades. (Ex: gripe forte, dor de estômago persistente)
    * **4 - Grave:** Sintomas intensos, possivelmente com um sinal de alerta. Grande dificuldade em realizar atividades. (Ex: febre alta que não cede, dor intensa)
    * **5 - Urgente:** Presença clara de um ou mais sinais de alerta. Sintomas incapacitantes. (Ex: dor no peito, falta de ar)
    
    **Tarefa:**
    Analise o texto do usuário abaixo e retorne APENAS o número de 1 a 5 correspondente à sua avaliação.
    
    **Texto do Usuário:**
    [AQUI_VOCE_INSERE_O_TEXTO_DO_USUARIO]*/



    /* Código de TESTE da API
    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAeJFC98RQ4ra2bWGoKMgw4VasvTRqniM4" -H "Content-Type: application/json" -X POST -d "{\"contents\":[{\"parts\":[{\"text\":\"Explique por que os meses não têm 28 dias e o ano não tem 13 meses\"}]}]}"
    */
}