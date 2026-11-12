// ==============================
// DOM
// ==============================
const tabsContainer = document.querySelector('#tabs');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const topLeft = document.querySelector('#top-left');
const topRight = document.querySelector('#top-right');
const bottomRight = document.querySelector('#bottom-right');
const bottomLeft = document.querySelector('#bottom-left');

const topLeftValue = document.querySelector('#top-left-value');
const topRightValue = document.querySelector('#top-right-value');
const bottomRightValue = document.querySelector('#bottom-right-value');
const bottomLeftValue = document.querySelector('#bottom-left-value');

// Властивості індивідуального варіанта №5: width та display
const widthRange = document.querySelector('#width');
const widthValue = document.querySelector('#width-value');
const displaySelect = document.querySelector('#display-type');
const displayValue = document.querySelector('#display-value');

const preview = document.querySelector('#preview');
const previewButton = document.querySelector('#preview-button');
const coordinates = document.querySelector('#coordinates');

const cssCode = document.querySelector('#css-code');
const copyButton = document.querySelector('#copy-button');
const copyMessage = document.querySelector('#copy-message');

const presetForm = document.querySelector('#preset-form');
const presetName = document.querySelector('#preset-name');
const presetError = document.querySelector('#preset-error');

const scrollTopButton = document.querySelector('#scroll-top');

// Початкові значення (використовуються при натисканні Escape)
const DEFAULT_WIDTH = 300;
const DEFAULT_DISPLAY = 'flex';

// ==============================
// TABS
// ==============================
function hideTabs() {
  tabs.forEach(function (tab) {
    tab.classList.remove('active');
  });

  tabContents.forEach(function (content) {
    content.classList.remove('active');
  });
}

function showTab(tabName) {
  const tab = document.querySelector(`[data-tab="${tabName}"]`);
  const content = document.querySelector(`[data-content="${tabName}"]`);

  if (tab) {
    tab.classList.add('active');
  }
  if (content) {
    content.classList.add('active');
  }
}

// ==============================
// BORDER RADIUS
// ==============================
function generateBorderRadius() {
  const topLeftRadius = topLeft.value;
  const topRightRadius = topRight.value;
  const bottomRightRadius = bottomRight.value;
  const bottomLeftRadius = bottomLeft.value;

  const radius =
    `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`;

  preview.style.borderRadius = radius;

  topLeftValue.textContent = `${topLeftRadius} px`;
  topRightValue.textContent = `${topRightRadius} px`;
  bottomRightValue.textContent = `${bottomRightRadius} px`;
  bottomLeftValue.textContent = `${bottomLeftRadius} px`;

  updateCssCode();
}

// ==============================
// ДОДАТКОВІ ВЛАСТИВОСТІ (варіант 5)
// ==============================
function applyWidth() {
  preview.style.width = `${widthRange.value}px`;
  widthValue.textContent = `${widthRange.value} px`;

  updateCssCode();
}

function applyDisplay() {
  preview.style.display = displaySelect.value;
  displayValue.textContent = displaySelect.value;

  updateCssCode();
}

// ==============================
// CSS-КОД
// ==============================
function updateCssCode() {
  const radius =
    `${topLeft.value}px ${topRight.value}px ${bottomRight.value}px ${bottomLeft.value}px`;

  cssCode.value =
    `border-radius: ${radius};\n` +
    `width: ${widthRange.value}px;\n` +
    `display: ${displaySelect.value};`;
}

// ==============================
// COPY
// ==============================
function showCopyMessage() {
  copyMessage.textContent = 'CSS-код скопійовано';
}

function copyCSS() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cssCode.value).then(showCopyMessage).catch(function () {
      copyCSSFallback();
    });
  } else {
    copyCSSFallback();
  }
}

// Запасний варіант, якщо Clipboard API недоступний (наприклад, при відкритті через file://)
function copyCSSFallback() {
  cssCode.select();
  try {
    if (document.execCommand('copy')) {
      showCopyMessage();
    } else {
      copyMessage.textContent = 'Не вдалося скопіювати';
    }
  } catch (error) {
    copyMessage.textContent = 'Не вдалося скопіювати';
  }
  cssCode.setSelectionRange(0, 0);
}

// ==============================
// FORM
// ==============================
function validatePresetName() {
  if (presetName.value.trim() === '') {
    presetName.classList.add('error');
    presetError.textContent = 'Введіть назву пресета';
    return false;
  }

  presetName.classList.remove('error');
  presetError.textContent = '';
  return true;
}

function handlePresetSubmit(event) {
  event.preventDefault();

  if (!validatePresetName()) {
    return;
  }

  console.log(`Пресет: ${presetName.value.trim()}`);
  console.log(cssCode.value);
}

// ==============================
// KEYBOARD
// ==============================
function handleKeyDown(event) {
  if (event.key !== 'Escape') {
    return;
  }

  // усі range -> початкові значення (радіуси = 0)
  topLeft.value = 0;
  topRight.value = 0;
  bottomRight.value = 0;
  bottomLeft.value = 0;
  widthRange.value = DEFAULT_WIDTH;
  displaySelect.value = DEFAULT_DISPLAY;

  generateBorderRadius();
  applyWidth();
  applyDisplay();
}

// ==============================
// SCROLL
// ==============================
function handleScroll() {
  if (window.scrollY > 300) {
    scrollTopButton.classList.add('visible');
  } else {
    scrollTopButton.classList.remove('visible');
  }
}

// ==============================
// ПІДКЛЮЧЕННЯ ПОДІЙ
// ==============================

// Вкладки: делегування подій (один обробник на контейнері)
tabsContainer.addEventListener('click', function (event) {
  // Аналіз об'єкта event
  console.log(event.type);
  console.log(event.target);
  console.log(event.currentTarget);

  if (!event.target.classList.contains('tab')) {
    return;
  }

  const tabName = event.target.dataset.tab;

  hideTabs();
  showTab(tabName);
});

// Border radius: подія input
topLeft.addEventListener('input', generateBorderRadius);
topRight.addEventListener('input', generateBorderRadius);
bottomRight.addEventListener('input', generateBorderRadius);
bottomLeft.addEventListener('input', generateBorderRadius);

// Width: input, Display: change
widthRange.addEventListener('input', applyWidth);
displaySelect.addEventListener('change', applyDisplay);

// Копіювання
copyButton.addEventListener('click', copyCSS);

// Поле назви пресета: focus / blur
presetName.addEventListener('focus', function () {
  presetName.classList.add('focused');
});

presetName.addEventListener('blur', function () {
  presetName.classList.remove('focused');
  validatePresetName();
});

// Форма
presetForm.addEventListener('submit', handlePresetSubmit);

// Клавіатура
document.addEventListener('keydown', handleKeyDown);

// Поширення подій
preview.addEventListener('click', function () {
  console.log('Preview click');
});

previewButton.addEventListener('click', function (event) {
  event.stopPropagation(); // подія не дійде до preview
  console.log('Button click');
});

// Події миші
preview.addEventListener('mouseover', function () {
  preview.classList.add('hovered');
});

preview.addEventListener('mouseout', function () {
  preview.classList.remove('hovered');
});

preview.addEventListener('mousemove', function (event) {
  coordinates.textContent = `X: ${event.clientX}; Y: ${event.clientY}`;
  console.log(`pageX: ${event.pageX}; pageY: ${event.pageY}`);
});

// Scroll
window.addEventListener('scroll', handleScroll);

scrollTopButton.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Початкове формування CSS-коду та стану Preview
generateBorderRadius();
applyWidth();
applyDisplay();
