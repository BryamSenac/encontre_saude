import{R as h,a as E,A as x}from"./authService-FkTjPsGX.js";import{c as S}from"./sidebar-BkaUTNX8.js";import{c as I}from"./footer-DRCRWYCK.js";import{G as C}from"./index-BpRkNtKl.js";import{c as A}from"./chatService-CkPI_RTl.js";function _(){const i=document.querySelector("main");if(!i)return;const t=document.createElement("div");t.className="textCenter";const n=document.createElement("h1");n.textContent="Sua saúde em primeiro lugar",t.appendChild(n);const r=document.createElement("div");r.className="cards",[{title:"Farmácias",icon:"fa-solid fa-prescription-bottle-medical iconSaude",text:"Veja Onde se Cuidar: Farmácias e Informações de Saúde",route:h.farmacia},{title:"Primeiros Socorros",icon:"fa-solid fa-briefcase-medical iconSaude",text:"O que fazer enquanto o resgate não chega",route:h.primeirosSocorros},{title:"Ações Preventivas",icon:"fa-solid fa-shield-heart iconSaude",text:"Dicas e informações para manter-se sempre bem",route:h.prevensao}].forEach(({title:c,icon:m,text:v,route:p})=>{const l=document.createElement("div");l.className="card";const g=document.createElement("h2");g.textContent=c;const e=document.createElement("i");e.className=m;const o=document.createElement("p");o.textContent=v;const a=document.createElement("button");a.className="button",a.textContent="Ver Mais",a.addEventListener("click",()=>{window.location.href=p}),l.appendChild(g),l.appendChild(e),l.appendChild(o),l.appendChild(a),r.appendChild(l)}),i.appendChild(t),i.appendChild(r)}const b="chatHistorico";async function k(i){const{session:t}=await E.getUserSession();if(!t||!i||i.length===0)return;const n=JSON.parse(localStorage.getItem(b)||"[]"),r={id:Date.now(),data:new Date().toLocaleString("pt-BR"),mensagens:i};n.unshift(r),n.length>20&&n.pop(),localStorage.setItem(b,JSON.stringify(n))}function F(){return JSON.parse(localStorage.getItem(b)||"[]")}function U(){const i=new C(x),t={1:{cor:"#5EA7FF",texto:"Não Urgente"},2:{cor:"#ABFB4F",texto:"Pouco Urgente"},3:{cor:"#FFEA00",texto:"Urgente"},4:{cor:"#FF771C",texto:"Muito Urgente"},5:{cor:"#D51717",texto:"Emergência"}},n=`
Você é um assistente de IA especializado em triagem de sintomas de saúde. Sua tarefa é analisar o relato do usuário e fornecer uma orientação estruturada.

**Instruções de Resposta:**
Você DEVE retornar sua resposta APENAS no formato JSON, sem crase ou markdown (ex: \`\`\`json). O JSON deve conter os seguintes campos:

{
  "nivel": (número de 1 a 5),
  "resumo": "...",
  "recomendacao": "...",
  "primeiros_socorros": "...",
  "unidade_recomendada": "...",
  "sintomas": {
    "febre": boolean,
    "dor_de_cabeca": boolean,
    "tosse": boolean,
    "falta_de_ar": boolean,
    "dor_no_peito": boolean,
    "nausea_vomito": boolean,
    "diarreia": boolean,
    "dor_abdominal": boolean,
    "dor_nas_costas": boolean,
    "tontura": boolean,
    "fraqueza": boolean,
    "coriza": boolean
  }
}

**Escala de Classificação:**
1 - Não Urgente (Autocuidado)
2 - Pouco Urgente (Observação/Farmácia)
3 - Urgente (UBS/Posto de Saúde)
4 - Muito Urgente (UPA)
5 - Emergência (Hospital/SAMU 192)

**Texto do Usuário:**
[AQUI_VOCE_INSERE_O_TEXTO_DO_USUARIO]
`;let r=[];async function d(e){try{const o=i.getGenerativeModel({model:"gemini-2.5-flash"}),a=n.replace("[AQUI_VOCE_INSERE_O_TEXTO_DO_USUARIO]",e),y=(await(await o.generateContent(a)).response).text().trim().replace(/```json|```/g,"").trim();return JSON.parse(y)}catch(o){return console.error("Erro ao chamar a API Gemini:",o),null}}function c(e,o){const a=document.getElementById("chat-messages");if(!a)return;const s=document.createElement("div");s.className=`message ${o}`,typeof e=="string"?s.innerHTML=`<p>${e}</p>`:s.appendChild(e),a.appendChild(s),a.scrollTop=a.scrollHeight}function m(){const e=document.getElementById("chat-messages");if(!e)return null;const o=document.createElement("div");return o.className="typing-indicator",o.id="typing-indicator",o.innerHTML='<i class="fa-solid fa-ellipsis fa-bounce"></i> Analisando sintomas...',e.appendChild(o),e.scrollTop=e.scrollHeight,o}function v(){const e=document.getElementById("typing-indicator");e&&e.remove()}function p(e){const o=document.createElement("div");if(!e||!e.nivel)return o.innerHTML='<p style="color:red">Não consegui analisar seus sintomas. Tente descrever com mais detalhes.</p>',o;const a=e.nivel,s=t[a]?t[a].cor:"#ccc",u=t[a]?t[a].texto:"Avaliado";return o.innerHTML=`
            <div style="border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom:0.5rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
                <div style="width:12px; height:12px; border-radius:50%; background:${s}; box-shadow: 0 0 5px ${s};"></div>
                <strong style="font-size:1.1rem;">${u} (Nível ${a})</strong>
            </div>
            <p>${e.resumo}</p>
            
            <div style="background:rgba(255,255,255,0.1); padding:0.8rem; border-radius:8px; margin-top:0.8rem;">
                <strong>🩺 Recomendação:</strong>
                <p style="margin-top:0.2rem; font-size:0.95rem;">${e.recomendacao}</p>
            </div>

            ${e.primeiros_socorros?`
            <div style="margin-top:0.8rem;">
                <strong>🩹 Dica:</strong>
                <p style="margin-top:0.2rem; font-size:0.95rem;">${e.primeiros_socorros}</p>
            </div>`:""}

            ${e.unidade_recomendada?`
            <div style="margin-top:1rem; font-weight:bold; color:#fff; background:${s}; color:#000; padding:0.5rem 1rem; border-radius:50px; display:inline-block; font-size:0.9rem;">
                🏥 Ir para: ${e.unidade_recomendada}
            </div>`:""}
        `,o}async function l(){const e=document.getElementById("user-input"),o=document.getElementById("send-btn"),a=e.value.trim();if(!a)return;e.value="",e.disabled=!0,o.disabled=!0,c(a,"user"),r.push({tipo:"user",texto:a}),m();const s=await d(a);if(v(),e.disabled=!1,o.disabled=!1,e.focus(),s){const u=p(s);c(u,"ai");const f=`[Nível ${s.nivel}] ${s.resumo}`;r.push({tipo:"ai",texto:f}),await A.saveInteraction(a,f,s.sintomas)}if(k(r),s){const u={textoUsuario:a,resultadoIA:s,timestamp:Date.now()};localStorage.setItem("ultimaTriagemIA",JSON.stringify(u))}}function g(){const e=document.getElementById("send-btn"),o=document.getElementById("user-input");e&&e.addEventListener("click",l),o&&o.addEventListener("keydown",a=>{a.key==="Enter"&&l()})}g()}function L(){const i=document.getElementById("feedbacks");if(!i)return;i.innerHTML="",i.classList.add("feedbacks"),[{title:"Não Urgente",text:"Caso para atendimento na unidade de saúde mais próxima da residência.",color:"#5EA7FF"},{title:"Pouco Urgente",text:"Caso para atendimento preferencial nas unidades de atenção básica.",color:"#ABFB4F"},{title:"Urgente",text:"Caso de gravidade moderada, necessidade de atendimento médico, sem risco imediato.",color:"#FFEA00"},{title:"Muito Urgente",text:"Caso grave e risco significativo de evoluir para morte. Atendimento urgente.",color:"#FF771C"},{title:"Emergência",text:"Caso gravíssimo, com necessidade de atendimento imediato e risco de morte.",color:"#D51717"}].forEach(({title:n,text:r,color:d})=>{const c=document.createElement("div");c.classList.add("feedback");const m=document.createElement("div");m.classList.add("bola"),m.style.backgroundColor=d,c.appendChild(m),i.appendChild(c),c.addEventListener("click",()=>{M({title:n,text:r,color:d})})})}function M(i){let t=document.getElementById("feedbackModal");t||(t=document.createElement("div"),t.id="feedbackModal",t.className="modal",t.innerHTML=`
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="modal-header">
          <div class="modal-bola"></div>
          <h2 class="modal-title"></h2>
        </div>
        <p class="modal-text"></p>
      </div>
    `,document.body.appendChild(t),t.querySelector(".close").addEventListener("click",()=>{t.style.display="none"}),t.addEventListener("click",c=>{c.target===t&&(t.style.display="none")}));const n=t.querySelector(".modal-bola"),r=t.querySelector(".modal-title"),d=t.querySelector(".modal-text");n.style.backgroundColor=i.color,r.textContent=i.title,d.textContent=i.text,t.style.display="flex"}async function N(){const{session:i}=await E.getUserSession(),t=!!i,n=document.getElementById("header"),r=document.querySelector("main");if(!n||!r)return;const d=document.createElement("section");if(d.id="sintomas",d.style.position="relative",d.innerHTML=`
        <div class="sintomas-title-row">
            <h2>Triagem de Sintomas com IA</h2>
            ${t?`
            <button id="btn-historico-chat" class="btn-historico" title="Ver histórico de conversas">
                <i class="fas fa-clock-rotate-left"></i>
                <span>Histórico</span>
            </button>`:""}
        </div>

        <div class="sintomas-container">
            <!-- Left Panel (Legend) -->
            <div class="sintomas-left">
                <div class="aviso-box">
                    <h3><i class="fa-solid fa-triangle-exclamation"></i> Aviso Importante</h3>
                    <p>
                        Esta ferramenta utiliza inteligência artificial para triagem preliminar e <strong>não substitui uma consulta médica</strong>.
                        Em casos de emergência, ligue para 192 ou procure o hospital mais próximo.
                    </p>
                </div>

                <div class="legend-container">
                    <span class="legend-title" style="font-weight:bold; display:block; margin-bottom:1rem;">Níveis de Urgência</span>
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

            <!-- Right Panel (Chat Interface) -->
            <div class="sintomas-right">
                <div id="chat-container">
                    <div id="chat-messages">
                        <!-- Initial AI Message -->
                        <div class="message ai">
                            <p>Olá! Sou seu assistente de saúde virtual. Por favor, descreva o que você está sentindo com o máximo de detalhes (onde dói, há quanto tempo, intensidade).</p>
                        </div>
                    </div>
                    
                    <div id="input-area">
                        <input type="text" id="user-input" placeholder="Digite seus sintomas aqui..." autocomplete="off">
                        <button id="send-btn">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="feedbacks"></div>

        <!-- Painel de Histórico (só renderizado se logado) -->
        ${t?`
        <div id="painel-historico" class="painel-historico painel-historico--fechado">
            <div class="painel-historico__header">
                <h3><i class="fas fa-clock-rotate-left"></i> Histórico de Conversas</h3>
                <button id="btn-fechar-historico" class="btn-fechar-historico" title="Fechar histórico">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="historico-lista" class="historico-lista">
                <!-- Preenchido via JS -->
            </div>
        </div>`:""}
    `,n.insertAdjacentElement("afterend",d),U(),L(),t){const c=document.getElementById("btn-historico-chat"),m=document.getElementById("painel-historico"),v=document.getElementById("btn-fechar-historico"),p=document.getElementById("historico-lista");async function l(){const g=await F();if(p.innerHTML="",g.length===0){p.innerHTML=`
                    <div class="historico-vazio">
                        <i class="fas fa-comment-medical"></i>
                        <p>Nenhuma conversa salva ainda.</p>
                        <small>Suas consultas com a IA aparecerão aqui.</small>
                    </div>
                `;return}g.forEach(e=>{const o=document.createElement("div");o.className="historico-item";const a=e.mensagens.find(u=>u.tipo==="user"),s=e.mensagens.find(u=>u.tipo==="ai");o.innerHTML=`
                    <div class="historico-item__data">
                        <i class="fas fa-calendar-alt"></i> ${e.data}
                    </div>
                    ${a?`
                    <div class="historico-item__user">
                        <span class="historico-badge historico-badge--user">Você</span>
                        <p>${a.texto}</p>
                    </div>`:""}
                    ${s?`
                    <div class="historico-item__ai">
                        <span class="historico-badge historico-badge--ai">IA</span>
                        <p>${s.texto}</p>
                    </div>`:""}
                `,p.appendChild(o)})}c.addEventListener("click",()=>{l(),m.classList.toggle("painel-historico--fechado")}),v.addEventListener("click",()=>{m.classList.add("painel-historico--fechado")})}}document.addEventListener("DOMContentLoaded",async()=>{await S();try{await N()}catch(i){console.error("Error creating sintomas section:",i)}_(),I()});
