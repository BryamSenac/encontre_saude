export function initPrimeirosSocorros() {

  const data = [
    {
      title: 'Engasgo',
      content: `
      <p>1. Estimule a vítima a tossir. Se não conseguir, dê até cinco tapas nas costas, entre as escápulas.</p>
      <p>2. Se não resolver, aplique a <strong>manobra de Heimlich</strong> (compressões abdominais rápidas e firmes).</p>
      <p>3. Se a vítima perder a consciência, inicie a <em>ressuscitação cardiopulmonar</em> e peça ajuda especializada.</p>
      <p><small>Informações baseadas no método da Biblioteca Virtual de Saúde e Agência Brasília.</p>`
    },
    {
      title: 'Massagem Cardíaca',
      content: `
      <p>1. Cheque os sinais vitais (sem movimentos e sem respirar).</p>
      <p>2. Ajoelhe-se ao lado da vítima; posicione uma mão sobre a outra no centro do peito (entre os mamilos).</p>
      <p>3. Com os braços esticados, comprima o tórax cerca de 5 cm, 100 vezes por minuto, com ritmo constante.</p>
      <p><small>Diretrizes do SAMU 192 orientam esse protocolo.</p>`
    },
    {
      title: 'Desmaio',
      content: `
      <p>1. Afaste a vítima de locais perigosos.</p>
      <p>2. Deite-a de costas e eleve as pernas acima do nível do coração.</p>
      <p>3. Afrouxe roupas apertadas e vire a cabeça para o lado.</p>
      <p>4. Não ofereça água imediatamente. Se não acordar em 1 a 2 min, acione o socorro.</p>
      <p><small>Procedimentos descritos em cartilha sobre desmaios no Hospital da Luz e outros.</p>`
    },
    {
      title: 'Convulsão',
      content: `
      <p>1. Deixe a pessoa no chão, deitada e de lado (posição lateral de segurança).</p>
      <p>2. Afaste objetos e proteja a cabeça com algo macio.</p>
      <p>3. Não segure braços ou coloque objetos na boca.</p>
      <p>4. Se passar de 5 minutos, ou for a 1ª crise, acione ambulância.</p>
      <p><small>Baseado nos protocolos do Hospital Israelita Albert Einstein.</p>`
    },
    {
      title: 'Intoxicação',
      content: `
      <p>1. Acione imediatamente o <strong>Disque‑Intoxicação (0800‑722‑6001)</strong> ou SAMU 192.</p>
      <p>2. Não provoque vômito, nem ofereça alimentos ou líquidos.</p>
      <p>3. Lave olhos ou pele exposta com água corrente e sabão.</p>
      <p>4. Coloque a vítima de lado até o socorro chegar.</p>
      <p><small>Conforme orientações da ANVISA e Tua Saúde.</p>`
    },
    {
      title: 'Afogamento',
      content: `
      <p>1. Procure ajuda imediatamente (bombeiro 193 ou SAMU 192).</p>
      <p>2. Forneça à vítima material flutuante (galho, boia, corda). Não entre na água se não souber nadar.</p>
      <p>3. Fora da água, verifique respiração (método “VOS”). Se não respirar, inicie RCP.</p>
      <p><small>Baseado no protocolo de afogamento da Vida Saudável e Tua Saúde.</p>`
    },
    {
      title: 'Queimadura',
      content: `
      <p>1. Resfrie a área afetada com água corrente em temperatura ambiente por 10‑15 min.</p>
      <p>2. Afrouxe roupas e joias da região queimada.</p>
      <p>3. Cubra com pano limpo umedecido; não aplique manteiga, pasta ou óleo.</p>
      <p>4. Queimaduras extensas, químicas, elétricas ou nas mãos/genitais exigem atendimento imediato.</p>
      <p><small>Seguindo recomendações da Tua Saúde e Biblioteca Virtual do Ministério da Saúde.</p>`
    },
    {
      title: 'Transporte de vítimas',
      content: `
      <p>1. Só movimente se houver mais risco em deixar a pessoa no local.</p>
      <p>2. Apoie a vítima com um braço por baixo dos joelhos e outro pelas costas (estilo “cadeirinha”).</p>
      <p>3. Evite movimentos bruscos, e mantenha a cabeça e coluna alinhados.</p>
      <p><small>Diretrizes gerais de transporte em manuel de primeiros socorros.</p>`
    },
    {
      title: 'Ferimentos',
      content: `
      <p>1. Lave com água e sabão apenas se não houver hemorragia grave.</p>
      <p>2. Pressione com gaze ou tecido limpo para estancar sangramento.</p>
      <p>3. Caso a hemorragia persista ou haja corpo estranho, vá ao hospital.</p>
      <p><small>Baseado em manuais padrão de primeiros socorros (Nível básico).</p>`
    }
  ];

  const btnsMae = document.getElementById('btns_mae');
  const infoTitle = document.getElementById('info-title');
  const infoContent = document.getElementById('info-content');
  const searchInput = document.getElementById('search-input');

  function renderButtons(list) {
    btnsMae.innerHTML = '';
    list.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'btns';
      btn.textContent = item.title;
      btn.onclick = () => {
        document.querySelectorAll('.btns').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showInfo(item);
      };
      btn.setAttribute('role', 'listitem');
      btnsMae.appendChild(btn);
    });
  }

  function showInfo(item) {
    infoTitle.textContent = item.title;
    infoContent.innerHTML = item.content;
  }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = q
      ? data.filter(d => d.title.toLowerCase().includes(q))
      : data;
    renderButtons(filtered);
    // Limpa o quadro se for filtrado para zero resultados
    if (!filtered.length) {
      infoTitle.textContent = 'Nenhum tema encontrado';
      infoContent.innerHTML = '';
    }
  });

  renderButtons(data);
}
