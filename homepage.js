document.addEventListener("DOMContentLoaded", () => {
  setBgColor();
  setupHorizontalScroll();

  document.querySelectorAll("a.nav-item").forEach((a) => {
    const handleClick = (e) => {
      e.preventDefault();
      delayNavigate(a);
    };

    a.addEventListener("click", handleClick);
  });
});

function delayNavigate(a) {
  a.classList.add("clicked");

  setTimeout(() => {
    window.location.href = a.href;
  }, 1200);
}

function setBgColor() {
  const body = document.getElementsByTagName("body")[0];
  const backgroundColor = getBgColor();

  body.style.backgroundColor = backgroundColor;
}

const bgColor = new Map([
  ["light", "#c9ceda"],
  ["dark", "#363d51"],
]);

function getBgColor() {
  let theme = localStorage.getItem("theme");
  if (!theme) theme = "light";

  return bgColor.get(theme);
}

function toggleTheme() {
  let prevMode = window.localStorage.getItem("theme");
  let mode = "light";
  if (prevMode == "light") {
    mode = "dark";
  }

  window.localStorage.setItem("theme", mode);

  setBgColor(mode);
}

function setupHorizontalScroll() {
  const container = document.querySelector("main");
  const shell = container.querySelector(".flip");

  container.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    },
    { passive: false },
  );

  let lastTouchX = 0;
  let lastTouchY = 0;

  container.addEventListener(
    "touchstart",
    (e) => {
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    },
    { passive: true },
  );

  container.addEventListener(
    "touchmove",
    (e) => {
      const { clientX, clientY } = e.touches[0];
      const dx = lastTouchX - clientX;
      const dy = lastTouchY - clientY;
      lastTouchX = clientX;
      lastTouchY = clientY;

      if (Math.abs(dy) <= Math.abs(dx)) return;
      e.preventDefault();
      container.scrollLeft += dy;
    },
    { passive: false },
  );

  const updateShellFlip = () => {
    shell.classList.toggle("flipped", container.scrollLeft > 0);
  };

  container.addEventListener("scroll", updateShellFlip);
  updateShellFlip();
}
