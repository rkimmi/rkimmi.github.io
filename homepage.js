document.addEventListener("DOMContentLoaded", () => {
  setBgColor();
  setupHorizontalScroll();
  setupDrawing();

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
  ["light", "#eff0f3"],
  ["dark", "#2e3c63"],
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

const HOLD_MS = 400;
const HOLD_MOVE_TOLERANCE = 10;

function setupDrawing() {
  const canvas = document.querySelector(".draw-canvas");
  const toggle = document.querySelector(".draw-toggle");
  const ctx = canvas.getContext("2d");

  let drawMode = false;
  let drawing = false;
  let justDrew = false;
  let holdTimer = null;
  let startX = 0;
  let startY = 0;

  const resizeCanvas = () => {
    const snapshot = document.createElement("canvas");
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    if (canvas.width && canvas.height) {
      snapshot.getContext("2d").drawImage(canvas, 0, 0);
    }

    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (snapshot.width && snapshot.height) {
      ctx.drawImage(snapshot, 0, 0);
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 45;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const startStroke = (x, y) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const cancelHold = () => {
    clearTimeout(holdTimer);
    holdTimer = null;
  };

  toggle.addEventListener("click", () => {
    drawMode = !drawMode;
    toggle.classList.toggle("active", drawMode);
    toggle.setAttribute("aria-pressed", drawMode);
    document.body.classList.toggle("drawing", drawMode);
  });

  document.addEventListener("pointerdown", (e) => {
    if (!drawMode || toggle.contains(e.target)) return;

    startX = e.clientX;
    startY = e.clientY;
    holdTimer = setTimeout(() => {
      holdTimer = null;
      startStroke(startX, startY);
    }, HOLD_MS);
  });

  document.addEventListener("pointermove", (e) => {
    if (holdTimer) {
      const moved = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (moved > HOLD_MOVE_TOLERANCE) cancelHold();
      return;
    }
    if (!drawing) return;

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
  });

  const endStroke = () => {
    cancelHold();
    if (!drawing) return;
    drawing = false;
    justDrew = true;
    setTimeout(() => {
      justDrew = false;
    }, 300);
  };

  document.addEventListener("pointerup", endStroke);
  document.addEventListener("pointercancel", endStroke);

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!drawing) return;
      e.preventDefault();
      e.stopPropagation();
    },
    { capture: true, passive: false },
  );

  document.addEventListener(
    "click",
    (e) => {
      if (!justDrew || toggle.contains(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
    },
    true,
  );

  document.addEventListener("contextmenu", (e) => {
    if (drawMode) e.preventDefault();
  });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
}
