import { ROUTES } from "./config/routes/routes.js";

export function createMain() {
  const main = document.querySelector("main");
  if (!main) return;

  // 🔹 Título principal
  const textCenter1 = document.createElement("div");
  textCenter1.className = "textCenter";

  const h1 = document.createElement("h1");
  h1.textContent = "Nosso Conteúdo";
  textCenter1.appendChild(h1);

  // 🔹 Cards principais
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "cards";

  const cardsData = [
    { title: "Sintomas", img: "./assets/sintomas.jpg", route: ROUTES.sintomas },
    { title: "Farmácias", img: "./assets/farmacia.jpg", route: ROUTES.farmacia },
    { title: "Primeiros Socorros", img: "./assets/primeiros-socorros.jpg", route: ROUTES.primeirosSocorros },
  ];

  cardsData.forEach(({ title, img, route }) => {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = title;

    const cardImg = document.createElement("div");
    cardImg.className = "card-img";
    cardImg.style.backgroundImage = `url(${img})`;

    const button = document.createElement("button");
    button.className = "button";
    button.textContent = "Ver Mais";
    button.addEventListener("click", () => {
      window.location.href = route;
    });

    card.appendChild(h2);
    card.appendChild(cardImg);
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
