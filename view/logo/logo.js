export function createLogo() {
    const container = document.getElementById("logo");
    const div = document.createElement("div");
    div.classList.add("logoType");

    const video = document.createElement("video");
    video.src = "/assets/videosLogo.mp4"; 
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true; // iOS

    const img = document.createElement("img");
    img.classList.add("logo");
    img.src = "/assets/logoTipo.png";
    img.alt = "logo";

    div.appendChild(video);
    div.appendChild(img);
    container.appendChild(div);
}
