export function carregarBairros() {
  const bairros = [
    "Todos os Bairros",
    "Aeroporto",
    "Água Branca",
    "Alvorada",
    "Antônio de Paiva Cantelmo",
    "Cango",
    "Centro",
    "Cristo Rei",
    "Guanabara",
    "Industrial",
    "Jardim Floresta",
    "Jardim Itália",
    "Jardim Virgínia",
    "Júpiter",
    "Luther King",
    "Marrecas",
    "Miniguaçu",
    "Nossa Senhora Aparecida",
    "Nova Petrópolis",
    "Novo Mundo",
    "Padre Ulrico",
    "Pinheirão",
    "Pinheirinho",
    "Presidente Kennedy",
    "Sadia",
    "São Cristóvão",
    "São Francisco",
    "São Miguel",
    "Seminário",
    "Vila Nova"
  ];

  const select = document.getElementById("bairro");
  if (!select) return;

  // limpa opções existentes
  select.innerHTML = "";

  // adiciona a opção inicial
  const opcaoTodos = document.createElement("option");
  opcaoTodos.value = "";
  opcaoTodos.textContent = "Todos os Bairros";
  select.appendChild(opcaoTodos);

  // adiciona os bairros em ordem alfabética
  bairros.sort().forEach(bairro => {
    const option = document.createElement("option");
    option.value = bairro;
    option.textContent = bairro;
    select.appendChild(option);
  });
}

// Chame a função quando a página carregar
document.addEventListener("DOMContentLoaded", carregarBairros);
