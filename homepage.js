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
  const container = document.querySelector("main");
  const bounding = container.getBoundingClientRect();
  const containerWidth = bounding.width || window.outerWidth;
  const containerHeight = bounding.height || window.outerHeight;

  const placedItems = [];

  for (let item of navItems) {
	const { maxWidth, maxHeight } = getMaxScale(item);
	  item.dataset.maxWidth = maxWidth;
	  item.dataset.maxHeight = maxHeight;

    const { posX, posY } = generateRandomPosition(
        item,
        containerWidth,
        containerHeight, 
		placedItems
      );

    item.style.left = `${posX}px`;
    item.style.top = `${posY}px`;

    placedItems.push(item);
  }
}

function getMaxScale(item) {
	const scaleFactor = 1;
	const maxWidth = item.offsetWidth * scaleFactor;
	const maxHeight = item.offsetHeight * scaleFactor;
	return { maxWidth, maxHeight };
}

function isOverlapping(item, x, y, other) {
  const w = parseFloat(item.dataset.maxWidth) || item.offsetWidth;
  const h = parseFloat(item.dataset.maxHeight) || item.offsetHeight;

  const [x2, y2, w2, h2] = getDimensions(other);

  const isOverlap = !(
    x + w <= x2 ||
    x2 + w2 <= x ||
    y + h <= y2 ||
    y2 + h2 <= y
  );

	return isOverlap;
}

function getDimensions(item) {
  const buffer = 2;
  const x = parseFloat(item.style.left);
  const y = parseFloat(item.style.top);
  const w = parseFloat(item.dataset.maxWidth) || item.offsetWidth + buffer;
  const h = parseFloat(item.dataset.maxHeight) || item.offsetHeight + buffer;
  return [x, y, w, h];
}

function generateRandomPosition(item, containerWidth, containerHeight, placedItems) {
  for (let attempt = 0; attempt < 2000; attempt++) {
	const h = parseFloat(item.dataset.maxHeight) || item.offsetHeight;
	const w = parseFloat(item.dataset.maxWidth) || item.offsetWidts;

    const posX = Math.random() * (containerWidth - w);
    const posY = Math.random() * (containerHeight - h);

    const overlaps = placedItems.some(other => {
      return isOverlapping(item, posX, posY, other);
    });

    if (!overlaps) {
      return { posX, posY };
    }
  }

  return null;
}

