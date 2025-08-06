import { ROUTES } from "./config/routes/routes.js";

export function createMain() {
  const main = document.querySelector("main");
  if (!main) return;

  // 🔹 Título principal
  const textCenter1 = document.createElement("div");
  textCenter1.className = "textCenter";

  const h1 = document.createElement("h1");
  h1.textContent = "Sua saúde em primeiro lugar";
  textCenter1.appendChild(h1);

  // 🔹 Cards principais
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "cards";

  const cardsData = [
    {
      title: "Sintomas",
      icon: "fa-solid fa-circle-plus iconSintomas",
      text: "Saiba onde ir de acordo com seus sintomas",
      route: ROUTES.sintomas
    },
    {
      title: "Farmácias",
      icon: "fa-solid fa-prescription-bottle-medical iconFarmacia",
      text: "Informações de Saúde relevantes",
      route: ROUTES.farmacia
    },
    {
      title: "Primeiros Socorros",
      icon: "fa-solid fa-briefcase-medical iconSocorros",
      text: "O que fazer enquanto o resgate não chega",
      route: ROUTES.primeirosSocorros
    },
  ];

  cardsData.forEach(({ title, icon, text, route }) => {
    const card = document.createElement("div");
    card.className = "card";

    // Título
    const h2 = document.createElement("h2");
    h2.textContent = title;

    // Ícone
    const cardIcon = document.createElement("i");
    cardIcon.className = icon;

    // Texto
    const p = document.createElement("p");
    p.textContent = text;

    // Botão
    const button = document.createElement("button");
    button.className = "button";
    button.textContent = "Ver Mais";
    button.addEventListener("click", () => {
      window.location.href = route;
    });

    card.appendChild(h2);
    card.appendChild(cardIcon);
    card.appendChild(p);
    card.appendChild(button);
    cardsContainer.appendChild(card);
  });

  // 🔹 Texto sobre saúde
  const textCenter2 = document.createElement("div");
  textCenter2.className = "textCenter";

  const h3 = document.createElement("h3");
  h3.textContent = "Sobre a Saúde";

  const p = document.createElement("p");
  p.textContent =
    "Cuidar da saúde é essencial para uma vida equilibrada. Aqui você encontra dicas e informações para manter-se sempre bem e prevenir problemas futuros.";

  textCenter2.appendChild(h3);
  textCenter2.appendChild(p);

  // 🔹 Card único grande
  const singleCardsContainer = document.createElement("div");
  singleCardsContainer.className = "cards single";

  const largeCard = document.createElement("div");
  largeCard.className = "card large";

  const h2Large = document.createElement("h2");
  h2Large.textContent = "Ações Preventivas";

  const largeCardImg = document.createElement("div");
  largeCardImg.className = "card-img";
  largeCardImg.style.backgroundImage = "url('./assets/prevencao.jpg')";

  const buttonLarge = document.createElement("button");
  buttonLarge.className = "button";
  buttonLarge.textContent = "Saiba Mais";
  buttonLarge.addEventListener("click", () => {
    window.location.href = ROUTES.prevensao;
  });

  largeCard.appendChild(h2Large);
  largeCard.appendChild(largeCardImg);
  largeCard.appendChild(buttonLarge);
  singleCardsContainer.appendChild(largeCard);

  // 🔹 Monta no <main>
  main.appendChild(textCenter1);
  main.appendChild(cardsContainer);
  main.appendChild(textCenter2);
  main.appendChild(singleCardsContainer);
}
