
import { createApi } from "./api.js";
import { createFeedbacks } from "./create_feedback.js";

export function createSintomasSection() {
    const header = document.getElementById("header");
    const main = document.querySelector("main");

    if (!header || !main) return;

    const sintomasContainer = document.createElement("section");
    sintomasContainer.id = "sintomas-section";
    sintomasContainer.style.width = "100%";
    sintomasContainer.style.minHeight = "60vh";
    sintomasContainer.style.position = "relative";

    sintomasContainer.innerHTML = `
        <div class="sintomas-container">
            <!-- Left Panel -->
            <div class="sintomas-left">
                <div class="aviso-box">
                    <h3><i class="fa-solid fa-triangle-exclamation"></i> Aviso Importante</h3>
                    <p>
                        Esta ferramenta utiliza inteligência artificial para triagem preliminar e <strong>não substitui uma consulta médica</strong>.
                        Em casos de emergência, ligue para 192 ou procure o hospital mais próximo.
                    </p>
                </div>

                <div class="legend-container">
                    <span class="legend-title">Níveis de Urgência</span>
                    <div class="legend-items">
                        <div class="legend-item">
                            <div class="legend-dot" style="background:#5EA7FF"></div>
                            <div class="legend-text">
                                <strong>Não Urgente</strong>
                                <span>Sintomas leves, sem risco imediato.</span>
                            </div>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot" style="background:#ABFB4F"></div>
                            <div class="legend-text">
                                <strong>Pouco Urgente</strong>
                                <span>Desconforto moderado, observe a evolução.</span>
                            </div>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot" style="background:#FFEA00"></div>
                            <div class="legend-text">
                                <strong>Urgente</strong>
                                <span>Sintomas significativos, busque ajuda se persistir.</span>
                            </div>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot" style="background:#FF771C"></div>
                            <div class="legend-text">
                                <strong>Muito Urgente</strong>
                                <span>Sintomas intensos, requer atenção rápida.</span>
                            </div>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot" style="background:#D51717"></div>
                            <div class="legend-text">
                                <strong>Emergência</strong>
                                <span>Risco à vida, procure atendimento imediato (192).</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Panel -->
            <div class="sintomas-right">
                <div class="right-content">
                    <h2>Como você se sente?</h2>
                    <p class="subtitle">Descreva seus sintomas com detalhes (onde dói, há quanto tempo, intensidade).</p>
                    
                    <div class="input-area">
                        <textarea id="text_chat" placeholder="Ex: Estou com dor de cabeça forte há 2 dias e febre leve..."></textarea>
                    </div>

                    <button id="btn-avaliar">
                        <i class="fa-solid fa-stethoscope"></i> Analisar Sintomas
                    </button>

                    <div id="result-container">
                        <div class="result-header">
                            <div id="indicador-nivel"></div>
                            <strong>Avaliação da IA:</strong>
                        </div>
                        <div id="resultado"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="feedbacks"></div>
    `;

    header.insertAdjacentElement("afterend", sintomasContainer);

    createApi();
    createFeedbacks();
}
