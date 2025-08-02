export function createLogo() {
    const container = document.getElementById("logo");
    const div = document.createElement("div");
    div.classList.add("logoType");

    const img = document.createElement("img");
    img.classList.add("logo");
    img.src = "/assets/logo.png";
    img.alt = "logo";

    div.appendChild(img);

    container.appendChild(div);
}