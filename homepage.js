document.addEventListener("DOMContentLoaded", () => {
  setBgColor();
  styleAndPositionNavItems();

  document.querySelectorAll("a.nav-item").forEach((a) => {
    const handleClick = (e) => {
      e.preventDefault();
      delayNavigate(a);
    };

    a.addEventListener("click", handleClick);
    a.addEventListener("touchstart", handleClick, { passive: false });
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

function styleAndPositionNavItems() {
  const navItems = document.getElementsByClassName("nav-item");
  const scaleFactor = 1.2;
  const containerWidth = window.outerWidth - 100;
  // Make sure taller nav items are fully in view
  const containerHeight = window.outerHeight - 200;

  const placedItems = [];

  for (let item of navItems) {
    setMaxDimensions(item, scaleFactor);

    let attempts = 0;
    // Randomly position the element
    let isColliding = false;
    do {
      const { posX, posY } = generateRandomPosition(
        item,
        containerWidth,
        containerHeight
      );

      item.style.left = `${posX}px`;
      item.style.top = `${posY}px`;

      isColliding = placedItems.some((placedItem) => {
        const overlap = isOverlapping(item, placedItem);
        attempts++;
        return overlap;
      });
    } while (isColliding && attempts < 1000); // if colliding, repeat the loop

    placedItems.push(item);
  }
}

function setMaxDimensions(item, scaleFactor) {
  const baseWidth = item.offsetWidth;
  const baseHeight = item.offsetHeight;
  const maxWidth = baseWidth * scaleFactor;
  const maxHeight = baseHeight * scaleFactor;

  item.dataset.maxWidth = maxWidth;
  item.dataset.maxHeight = maxHeight;
}

function isOverlapping(item1, item2) {
  const [x1, y1, w1, h1] = getDimensions(item1);
  const [x2, y2, w2, h2] = getDimensions(item2);

  return !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1);
}

function getDimensions(item) {
  const buffer = 2;
  const x = parseFloat(item.style.left);
  const y = parseFloat(item.style.top);
  const w = item.offsetWidth + buffer;
  const h = item.offsetHeight + buffer;
  return [x, y, w, h];
}

function generateRandomPosition(item, containerWidth, containerHeight) {
  const maxWidth = parseFloat(item.dataset.maxWidth) || item.offsetWidth;
  const maxHeight = parseFloat(item.dataset.maxHeight) || item.offsetHeight;

  const posX = Math.random() * (containerWidth - maxWidth);
  const posY = Math.random() * (containerHeight - maxHeight);

  return { posX, posY };
}
