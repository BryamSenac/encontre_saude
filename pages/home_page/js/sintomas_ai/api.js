import { GoogleGenerativeAI } from "https://unpkg.com/@google/generative-ai?module";

import { API_KEY } from "../../../../config/env.js";

export function createApi() {
    const genAI = new GoogleGenerativeAI(API_KEY);


    const niveis = {
        1: {
            cor: '#5EA7FF',
            texto: 'Não Urgente'
        },

        2: {
            cor: '#ABFB4F',
            texto: 'Pouco Urgente'
        },

        3: {
            cor: '#FFEA00',
            texto: 'Urgente'
        },

        4: {
            cor: '#FF771C',
            texto: 'Muito Urgente'
        },

        5: {
            cor: '#D51717',
            texto: 'Emergência'
        }
    };



    const promptMestre = `
Você é um assistente de IA especializado em triagem de sintomas de saúde. Sua tarefa é analisar o relato do usuário e fornecer uma orientação estruturada.

**Instruções de Resposta:**
Você DEVE retornar sua resposta APENAS no formato JSON, sem crase ou markdown (ex: \`\`\`json). O JSON deve conter os seguintes campos:

{
  "nivel": (número de 1 a 5, conforme escala abaixo),
  "resumo": "Uma breve explicação do porquê desse nível.",
  "recomendacao": "O que a pessoa deve fazer imediatamente (ex: repouso, ir ao médico).",
  "primeiros_socorros": "Dica prática de primeiro socorro ou alívio de sintoma se aplicável (ou null se não houver).",
  "unidade_recomendada": "Onde buscar ajuda: 'Farmácia', 'Posto de Saúde (UBS)', 'UPA 24h', 'Hospital/Emergência' ou 'Fique em Casa'."
}

**Escala de Classificação:**
1 - Não Urgente (Autocuidado)
2 - Pouco Urgente (Observação/Farmácia)
3 - Urgente (UBS/Posto de Saúde)
4 - Muito Urgente (UPA)
5 - Emergência (Hospital/SAMU 192)

**Texto do Usuário:**
[AQUI_VOCE_INSERE_O_TEXTO_DO_USUARIO]
`;

    /**
     chama a API
      @param {string} textoUsuario
      @returns {Promise<Object>} - Objeto com a avaliação
     */

    async function avaliarSintomasDireto(textoUsuario) {
        try {
            // Usando modelo Flash para evitar rate limits
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const promptFinal = promptMestre.replace("[AQUI_VOCE_INSERE_O_TEXTO_DO_USUARIO]", textoUsuario);

            const result = await model.generateContent(promptFinal);
            const response = await result.response;
            const text = response.text().trim();

            // Limpeza básica caso a IA mande markdown
            const cleanText = text.replace(/```json|```/g, '').trim();

            return JSON.parse(cleanText);

        } catch (error) {
            console.error("Erro ao chamar a API Gemini:", error);
            return null;
        }
    }

    // Variável para armazenar o HTML original do container direito
    let originalRightContent = '';

    // Função para configurar a interação
    function setupInteraction() {
        const btnAvaliar = document.getElementById('btn-avaliar');
        const rightContent = document.querySelector('.right-content');

        // Salva o conteúdo original na primeira execução
        if (rightContent && !originalRightContent) {
            originalRightContent = rightContent.innerHTML;
        }

        if (btnAvaliar) {
            btnAvaliar.addEventListener('click', async () => {
                const textoInput = document.getElementById('text_chat');
                const texto = textoInput ? textoInput.value : '';

                if (!texto.trim()) {
                    alert('Por favor, descreva seus sintomas.');
                    return;
                }

                // 1. Substitui conteúdo por Spinner
                if (rightContent) {
                    rightContent.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 400px;">
                            <i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: var(--green-dark); margin-bottom: 1rem;"></i>
                            <h3 style="color: var(--green-dark);">Analisando seus sintomas...</h3>
                            <p style="color: var(--gray-medium);">Aguarde um momento</p>
                        </div>
                    `;
                }

                // 2. Chama a API
                const resultado = await avaliarSintomasDireto(texto);

                // 3. Renderiza o Resultado
                if (rightContent && resultado && resultado.nivel) {
                    const nivel = resultado.nivel;
                    const cor = niveis[nivel] ? niveis[nivel].cor : '#ccc';
                    const textoNivel = niveis[nivel] ? niveis[nivel].texto : 'Avaliado';

                    rightContent.innerHTML = `
                        <div style="display: flex; flex-direction: column; height: 100%; animate: fadeIn 0.5s;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;">
                                <div style="width: 15px; height: 15px; border-radius: 50%; background-color: ${cor};"></div>
                                <h2 style="margin: 0; font-size: 1.5rem; color: ${cor};">Nível ${nivel}: ${textoNivel}</h2>
                            </div>

                            <p style="margin-bottom: 0.8rem; line-height: 1.4; color: var(--black-dark);">${resultado.resumo}</p>
                            
                            <div style="background: rgba(0,0,0,0.03); padding: 10px; border-radius: 8px; margin-bottom: 0.8rem;">
                                <strong style="display:block; margin-bottom: 5px; color: var(--green-dark);">🩺 Recomendação:</strong>
                                <p style="margin: 0; font-size: 0.95rem;">${resultado.recomendacao}</p>
                            </div>

                            ${resultado.primeiros_socorros ? `
                            <div style="background: #e3f2fd; padding: 10px; border-radius: 8px; margin-bottom: 0.8rem; color: #0d47a1;">
                                <strong style="display:block; margin-bottom: 5px;">🩹 Dica de Primeiro Socorro:</strong>
                                <p style="margin: 0; font-size: 0.95rem;">${resultado.primeiros_socorros}</p>
                            </div>
                            ` : ''}

                            ${resultado.unidade_recomendada ? `
                            <div style="border: 1px solid ${cor}; padding: 8px; border-radius: 8px; font-weight: bold; text-align: center; color: ${cor}; margin-bottom: 1rem;">
                                🏥 Ir para: ${resultado.unidade_recomendada}
                            </div>
                            ` : ''}

                            <button id="btn-nova-analise" style="
                                margin-top: auto;
                                padding: 0.8rem;
                                background: transparent;
                                border: 2px solid var(--green-dark);
                                color: var(--green-dark);
                                border-radius: 50px;
                                font-weight: bold;
                                cursor: pointer;
                                transition: all 0.3s;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 0.5rem;
                            ">
                                <i class="fa-solid fa-rotate-right"></i> Fazer Nova Análise
                            </button>
                        </div>
                    `;

                    // Adiciona evento ao botão de voltar
                    const btnNovaAnalise = document.getElementById('btn-nova-analise');
                    if (btnNovaAnalise) {
                        btnNovaAnalise.addEventListener('click', () => {
                            rightContent.innerHTML = originalRightContent;
                            setupInteraction(); // Re-bind events
                        });
                    }

                    // Add simple hover effect via JS since it's inline style
                    btnNovaAnalise.onmouseover = () => {
                        btnNovaAnalise.style.background = 'var(--green-dark)';
                        btnNovaAnalise.style.color = 'white';
                    };
                    btnNovaAnalise.onmouseout = () => {
                        btnNovaAnalise.style.background = 'transparent';
                        btnNovaAnalise.style.color = 'var(--green-dark)';
                    };

                } else if (rightContent) {
                    rightContent.innerHTML = `
                        <div style="text-align: center; color: red;">
                            <h3>Erro na Análise</h3>
                            <p>Não foi possível processar sua solicitação.</p>
                            <button id="btn-retry" style="margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer;">Tentar Novamente</button>
                        </div>
                    `;
                    document.getElementById('btn-retry').addEventListener('click', () => {
                        rightContent.innerHTML = originalRightContent;
                        setupInteraction();
                    });
                }
            });
        }
    }

    // Inicializa
    setupInteraction();
}