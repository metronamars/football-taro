// script.js

// DOM-елементи
const btn3 = document.getElementById("btn3");
const btn5 = document.getElementById("btn5");
const spreadContainer = document.getElementById("spreadContainer");
const spreadTitle = document.getElementById("spreadTitle");
const summaryTextEl = document.getElementById("summaryText");
const styleSelect = document.getElementById("styleSelect");

// Тумблер активної кнопки режиму
function setActiveMode(mode) {
  if (mode === 3) {
    btn3.classList.add("active");
    btn5.classList.remove("active");
  } else if (mode === 5) {
    btn5.classList.add("active");
    btn3.classList.remove("active");
  }
}

// Ролі для розкладів
const ROLES_3 = [
  { key: "situation", label: "Ситуація", class: "role-situation" },
  { key: "challenge", label: "Виклик", class: "role-challenge" },
  { key: "result", label: "Результат / тенденція", class: "role-result" }
];

const ROLES_5 = [
  { key: "situation", label: "Ситуація", class: "role-situation" },
  { key: "situation", label: "Корінь / причина", class: "role-situation" },
  { key: "challenge", label: "Виклик / опір", class: "role-challenge" },
  { key: "situation", label: "Підтримка / ресурс", class: "role-situation" },
  { key: "result", label: "Результат / вектор руху", class: "role-result" }
];

// Мапа для поради на основі масті
const SUIT_ADVICE = {
  "М’ячі": "Більше атакуй і пробуй варіанти — без удару по воротах голу не буде.",
  "Бутси": "Став на підготовку: тренування, рутина, дисципліна й робота ногами.",
  "Голи": "Сконцентруйся на рішенні: менше сумнівів, більше чіткості й конкретики.",
  "Атмосфера": "Подумай про людей і енергію навколо: хто здуває, а хто заряджає."
};

/**
 * Повертає випадкові різні карти.
 */
function getRandomCards(count) {
  const picked = [];
  const usedIndices = new Set();

  while (picked.length < count && picked.length < cards.length) {
    const idx = Math.floor(Math.random() * cards.length);
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      picked.push(cards[idx]);
    }
  }
  return picked;
}

/**
 * Рендер розкладу.
 * mode: "3" або "5"
 */
function renderSpread(spreadCards, mode) {
  spreadContainer.innerHTML = "";

  if (mode === "3") {
    spreadTitle.textContent =
      "Розклад на 3 карти: матч із трьома ключовими моментами";
  } else {
    spreadTitle.textContent =
      "Розклад на 5 карт: розгорнутий матч із причинами та ресурсами";
  }

  const roles = mode === "3" ? ROLES_3 : ROLES_5;

  spreadCards.forEach((card, index) => {
    const role = roles[index];
    const roleKey = role.key;
    const roleLabel = role.label;
    const roleClass = role.class;

    // Обгортка картки з перспективою
    const wrapper = document.createElement("article");
    wrapper.className = "card";

    // Внутрішній блок, який крутиться
    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";

    // Дві сторони
    const cardFront = document.createElement("div");
    cardFront.className = "card-face card-front";

    const cardBack = document.createElement("div");
    cardBack.className = "card-face card-back";

    // ===== FRONT (зображення + позиція) =====

    const header = document.createElement("div");
    header.className = "card-header";

    const nameEl = document.createElement("div");
    nameEl.className = "card-name";
    nameEl.textContent = card.name;

    const roleBadge = document.createElement("span");
    roleBadge.className = `card-role ${roleClass}`;
    roleBadge.textContent = roleLabel;

   header.appendChild(nameEl);
header.appendChild(roleBadge);

    const metaRow = document.createElement("div");
    metaRow.className = "card-meta";

    const typePill = document.createElement("span");
    typePill.className = "meta-pill";
    typePill.textContent =
      card.arcanaType === "major" ? "Старший аркан" : "Малий аркан";
    metaRow.appendChild(typePill);

    if (card.suit) {
      const suitPill = document.createElement("span");
      suitPill.className = "meta-pill";
      suitPill.textContent = card.suit;
      metaRow.appendChild(suitPill);
    }

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const imageWrap = document.createElement("div");
    imageWrap.className = "card-image-wrapper";

    if (card.imageUrl && card.imageUrl.trim() !== "") {
      const img = document.createElement("img");
      img.src = card.imageUrl;
      img.alt = card.name;
      imageWrap.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "card-image-placeholder";
      placeholder.textContent = "Тут буде зображення карти.";
      imageWrap.appendChild(placeholder);
    }

    const textBlock = document.createElement("div");
    textBlock.className = "card-text-block";

    const positionEl = document.createElement("div");
    positionEl.className = "card-position-text";

    const positionText =
      card.positions && card.positions[roleKey]
        ? card.positions[roleKey]
        : card.message;

    positionEl.textContent = positionText;

    textBlock.appendChild(positionEl);

    cardBody.appendChild(imageWrap);
    cardBody.appendChild(textBlock);

    cardFront.appendChild(header);
    cardFront.appendChild(metaRow);
    cardFront.appendChild(cardBody);

// Іконка підказки для фліпу
const flipHint = document.createElement("img");
flipHint.className = "card-flip-hint";
flipHint.src = "images/flip.png"; // СЮДИ КЛАДЕШ МАЛЕНЬКУ PNG-ІКОНКУ
flipHint.alt = "Перевернути карту";
cardFront.appendChild(flipHint);


    // ===== BACK (структурований шаблон) =====

    let archetypeHtml = "";
    if (card.extra && card.extra.archetype) {
      archetypeHtml = `<div class="card-archetype">Архетип: ${card.extra.archetype}</div>`;
    }

    let sloganHtml = "";
    if (card.extra && card.extra.slogan) {
      sloganHtml = `<div class="card-slogan">«${card.extra.slogan}»</div>`;
    }

    let whenHtml = "";
    if (
      card.extra &&
      Array.isArray(card.extra.whenAppears) &&
      card.extra.whenAppears.length > 0
    ) {
      const items = card.extra.whenAppears
        .map((w) => `<li>${w}</li>`)
        .join("");
      whenHtml = `
        <div class="card-back-section">
          <div class="card-back-section-label">Коли випадає:</div>
          <ul class="card-back-list">
            ${items}
          </ul>
        </div>
      `;
    }

    let questionsHtml = "";
    let questionsSource = null;

    if (
      card.extra &&
      Array.isArray(card.extra.questions) &&
      card.extra.questions.length > 0
    ) {
      questionsSource = card.extra.questions;
    } else if (
      card.extra &&
      Array.isArray(card.extra.hints) &&
      card.extra.hints.length > 0
    ) {
      questionsSource = card.extra.hints;
    }

    if (questionsSource) {
      const qItems = questionsSource.map((q) => `<li>${q}</li>`).join("");
      questionsHtml = `
        <div class="card-back-section">
          <div class="card-back-section-label">Запитай себе:</div>
          <ul class="card-back-list">
            ${qItems}
          </ul>
        </div>
      `;
    }

    cardBack.innerHTML = `
      <div class="card-header">
        <div class="card-name">${card.name}</div>
        <span class="meta-pill">${
          card.arcanaType === "major" ? "Старший аркан" : "Малий аркан"
        }</span>
      </div>

      <div class="card-back-meta">
        ${archetypeHtml}
        ${sloganHtml}
      </div>

      <div class="card-back-meaning">
        <p class="card-core-meaning">${card.coreMeaning}</p>
        <p class="card-football-meaning">${card.footballMeaning}</p>
      </div>

      ${whenHtml}
      ${questionsHtml}
    `;

    // ===== Зібрати все разом =====

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    wrapper.appendChild(cardInner);
    spreadContainer.appendChild(wrapper);

    // Клік по карті — фліп
    wrapper.addEventListener("click", () => {
      wrapper.classList.toggle("flipped");
    });
  });
}

/**
 * Обирає масть, яка домінує в розкладі (ігнорує старші аркани).
 */
function getDominantSuit(spreadCards) {
  const counts = {};
  for (const c of spreadCards) {
    if (!c.suit) continue;
    counts[c.suit] = (counts[c.suit] || 0) + 1;
  }
  let bestSuit = null;
  let bestCount = 0;
  for (const suit in counts) {
    if (counts[suit] > bestCount) {
      bestCount = counts[suit];
      bestSuit = suit;
    }
  }
  return bestSuit;
}

/**
 * Загальний висновок для 3 карт.
 * Коротко: ситуація, виклик, тенденція + порада.
 */
function generateSummaryFor3(spreadCards) {
  const [c1, c2, c3] = spreadCards;

  const comboTitles = `${c1.name} → ${c2.name} → ${c3.name}`;

  const msg1 = c1.message || "";
  const msg2 = c2.message || "";
  const msg3 = c3.message || "";

  const dominantSuit = getDominantSuit(spreadCards);
  const advice =
    (dominantSuit && SUIT_ADVICE[dominantSuit]) ||
    "Зіграй уважно цей епізод: не поспішай з рішеннями й дивись на поле ширше.";

  const intro = `Комбінація карт: ${comboTitles}.`;

  const story = `Цей розклад каже: ${msg1} ${msg2} ${msg3}`.trim();

  const outro = `Порада від розкладу: ${advice}`;

  return `${intro}\n\n${story}\n\n${outro}`;
}

/**
 * Загальний висновок для 5 карт.
 * Так само працює через card.message, але розкладає їх на:
 * фон/корінь — вузол — ресурс — вектор + порада за мастю.
 */
function generateSummaryFor5(spreadCards) {
  const [c1, c2, c3, c4, c5] = spreadCards;

  const comboTitles = `${c1.name} → ${c2.name} → ${c3.name} → ${c4.name} → ${c5.name}`;

  const msg1 = c1.message || "";
  const msg2 = c2.message || "";
  const msg3 = c3.message || "";
  const msg4 = c4.message || "";
  const msg5 = c5.message || "";

  const dominantSuit = getDominantSuit(spreadCards);
  const advice =
    (dominantSuit && SUIT_ADVICE[dominantSuit]) ||
    "Тримай баланс між атакою, обороною й власним ресурсом — матч довгий.";

  const part1 = `Комбінація карт: ${comboTitles}.`;

  const part2 = `Фон і корінь ситуації: ${msg1} ${msg2}`.trim();

  const part3 = `Головний вузол / напруга цього епізоду: ${msg3}`.trim();

  const part4 = `Підтримка та ресурс, на які можна спертися: ${msg4}`.trim();

  const part5 = `Можливий вектор розвитку подій: ${msg5}`.trim();

  const part6 = `Як зіграти цей «матч» мудріше: ${advice}`;

  return `${part1}\n\n${part2}\n\n${part3}\n\n${part4}\n\n${part5}\n\n${part6}`;
}

/**
 * Рендер тексту висновку.
 */
function renderSummary(text) {
  summaryTextEl.textContent = text;
}

// Обробники кнопок

btn3.addEventListener("click", () => {
  setActiveMode(3); // підсвічуємо кнопку "3 карти"
  const spreadCards = getRandomCards(3);
  renderSpread(spreadCards, "3");
  const summary = generateSummaryFor3(spreadCards);
  renderSummary(summary);
});

btn5.addEventListener("click", () => {
  setActiveMode(5); // підсвічуємо кнопку "5 карт"
  const spreadCards = getRandomCards(5);
  renderSpread(spreadCards, "5");
  const summary = generateSummaryFor5(spreadCards);
  renderSummary(summary);
});

// Стиль трактування — поки одна логіка, але структура під майбутні режими
styleSelect.addEventListener("change", () => {
  // Тут потім можна буде міняти стиль трактування
});

// За замовчуванням активний режим — 3 карти
setActiveMode(3);
