addEventListener("DOMContentLoaded", (event) => {
    const body = document.getElementsByTagName('body')[0];
    const [backgroundColor, fontColor] = getColorsForHour();

    body.style.backgroundColor = backgroundColor;

    styleAndPositionNavItems(fontColor);
});

function styleAndPositionNavItems(fontColor) {
    const navItems = document.getElementsByClassName('nav-item');
    const scaleFactor = 1.2; 
    const containerWidth = window.innerWidth - 100; 
    // Make sure taller nav items are fully in view
    const containerHeight = window.innerHeight - 200; 

    const placedItems = [];
    for (let item of navItems) {
        item.style.color = fontColor;

        setMaxDimensions(item, scaleFactor);

        // Randomly position the element
        let isColliding = false;
        do {
            const { posX, posY } = generateRandomPosition(item, containerWidth, containerHeight)

            item.style.left = `${posX}px`;
            item.style.top = `${posY}px`;

            isColliding = placedItems.some(placedItem => isOverlapping(item, placedItem));
        } while (isColliding); // if colliding, repeat the loop
           
        placedItems.push(item);
    };
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
    // x + w is x-coordinate of the top-right corner
    // y + h is y-coordinate of the bottom (both edges)
    if (w1 === 0 || w2 === 0) return false;

    const horizontalOverlap = (x1 + w1 > x2 && x2 + w2 > x1);
    const verticalOverlap = (y1 + h1 > y2 && y2 + h2 > y1);

    return horizontalOverlap && verticalOverlap;
}

function getDimensions(item) {
    const buffer = 5;
    const x = parseFloat(item.style.left);
    const y = parseFloat(item.style.top);
    const w = parseFloat((item.dataset.maxWidth) || item.offsetWidth) + buffer;
    const h = parseFloat((item.dataset.maxHeight) || item.offsetHeight) + buffer;
    return [ x, y, w, h ]
}

  function generateRandomPosition(item, containerWidth, containerHeight) {
    const maxWidth = parseFloat(item.dataset.maxWidth) || item.offsetWidth;  
    const maxHeight = parseFloat(item.dataset.maxHeight) || item.offsetHeight; 

    const posX = Math.random() * (containerWidth - maxWidth); 
    const posY = Math.random() * (containerHeight - maxHeight);

    return { posX, posY };
}

const hoursToColourMap = new Map([
    [0, ['#fd2323', 'white']], // red bg, white font
    [12, ['#ff5', 'brown']], // yellow bg, brown font
    [16, ['#7fff7f', 'black']], // green bg, black font
    [20, ['#3838f4', 'white']] // blue bg, white font
])

function getColorsForHour() {
    let selectedBackgroundColor = '';
    let selectFontColor = '';
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours();

    for (let [key, [backgroundColor, fontColor]] of hoursToColourMap) {
        if (hours >= key) { 
            selectedBackgroundColor = backgroundColor;
            selectFontColor = fontColor
        } 
        else {
            break;
        }
    }

    return [selectedBackgroundColor, selectFontColor];
}

