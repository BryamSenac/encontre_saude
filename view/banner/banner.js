export function createBanner() {
  const banner = document.getElementById("banner");
  if (!banner) return;

  // URLs das imagens (5a é repetida da 1a para loop infinito)
  const images = [
    "./assets/saude.jpg",
    "./assets/saude2.jpg",
    "./assets/saude3.png",
    "./assets/saude4.jpg",
    "./assets/saude.jpg",
  ];

  const slidesCount = images.length;

  const slidesContainer = document.createElement("div");
  slidesContainer.className = "slides";

  images.forEach((imgUrl) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.backgroundImage = `url(${imgUrl})`;
    slidesContainer.appendChild(slide);
  });

  banner.appendChild(slidesContainer);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "buttons";

  // Criar botões só para as imagens "reais", ou seja, sem a última repetida
  for(let i = 0; i < slidesCount -1; i++) {
    const btn = document.createElement("button");
    if (i === 0) btn.classList.add("active");

    btn.addEventListener("click", () => {
      goToSlide(i);
      resetInterval();
    });

    buttonsContainer.appendChild(btn);
  }

  banner.appendChild(buttonsContainer);

  let currentIndex = 0;
  let intervalId;

  // Função para ir para o slide
  function goToSlide(index) {
    if (index < 0) index = slidesCount - 2; // Ajuste para o último "real"
    if (index > slidesCount - 1) index = 0;

    currentIndex = index;

    // Animação para último slide (índice 4), que é o clone da 1ª imagem
    slidesContainer.style.transition = "transform 0.5s ease-in-out";
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;

    // Atualiza botões para os "reais" só (0..3)
    let btnIndex = index;
    if(index === slidesCount - 1) btnIndex = 0;

    Array.from(buttonsContainer.children).forEach((btn, i) => {
      btn.classList.toggle("active", i === btnIndex);
    });
  }

  // Após animar para o clone do primeiro slide, reset sem animação
  slidesContainer.addEventListener("transitionend", () => {
    if (currentIndex === slidesCount - 1) {
      // Remove transição para "pular" sem animação
      slidesContainer.style.transition = "none";
      slidesContainer.style.transform = `translateX(0)`;
      currentIndex = 0;

      // Atualiza botão ativo
      Array.from(buttonsContainer.children).forEach((btn, i) => {
        btn.classList.toggle("active", i === 0);
      });
    }
  });

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 5000);
  }

  intervalId = setInterval(nextSlide, 5000);
}
