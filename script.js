const btn = document.getElementById("enterBtn");
const welcome = document.getElementById("welcome");
const music = document.getElementById("music");

btn.addEventListener("click", () => {
  welcome.style.display = "none";

  music.volume = 1.0;
  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      alert("Tap sekali lagi untuk menyalakan musik 🔊");
    });
  }
});
