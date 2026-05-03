const camera = document.querySelector("#camera");
const cameraError = document.querySelector("#camera-error");
const chat = document.querySelector("#chat");
const viewersEl = document.querySelector("#viewers");
const likesEl = document.querySelector("#likes");
const timerEl = document.querySelector("#timer");
const contextLabel = document.querySelector("#context-label");
const settingsBtn = document.querySelector("#settings-btn");
const settingsPanel = document.querySelector("#settings-panel");
const scenarioButtons = document.querySelector("#scenario-buttons");
const actionChips = document.querySelector("#action-chips");
const likeBtn = document.querySelector("#like-btn");
const chatActionBtn = document.querySelector("#chat-action-btn");
const donateActionBtn = document.querySelector("#donate-action-btn");
const donationTotalEl = document.querySelector("#donation-total");
const form = document.querySelector("#message-form");
const input = document.querySelector("#message-input");

const names = [
  "Артём", "Маша", "Даня", "Кирилл", "Лера", "Никита", "Соня", "Илья", "Вика", "Рома",
  "Макс", "Алина", "Егор", "Катя", "Дима", "Настя", "Саша", "Тим", "Полина", "Лёша",
  "Vlad", "NikitaLive", "StreetFan", "Котик", "Топчик"
];

const avatars = ["😎", "🔥", "💜", "🚀", "🎧", "👑", "🐻", "⚡", "🌙", "⭐", "💎", "🫶", "🏆", "🎮"];

const scenarios = {
  chill: {
    label: "Просто общаюсь",
    comments: [
      "Нравится такой спокойный формат",
      "Отвечай на вопросы, тут много новых",
      "Атмосфера как у большого стримера",
      "Чат сегодня очень активный",
      "Продолжай, интересно слушать",
      "Сделай мини Q&A, будет круто"
    ],
    actions: ["Ответить на вопрос", "Попросить лайк", "Рассказать историю", "Сделать Q&A"]
  },
  walking: {
    label: "Иду на улице",
    comments: [
      "Камера как будто реально с улицы, вайб топ 🔥",
      "О, город красиво смотрится на фоне",
      "Иди аккуратно, чат с тобой",
      "Вот это живой стрим, не постановка",
      "Свет сейчас прям кинематографичный"
    ],
    actions: ["Показать вид", "Поздороваться", "Ускорить шаг", "Остановиться"]
  },
  car: {
    label: "Еду в машине",
    comments: [
      "Дорога выглядит спокойно, только не отвлекайся 🙏",
      "Стрим из машины — это мощно",
      "Салон красиво подсвечивается",
      "Чат, пристегнулись?",
      "Едешь аккуратно, красавчик",
      "Не смотри в чат за рулём, безопасность важнее"
    ],
    actions: ["Повернуть камеру", "Сказать куда еду", "Показать дорогу", "Включить музыку"]
  },
  food: {
    label: "Еда / кафе",
    comments: [
      "Вот это выглядит вкусно, теперь все голодные",
      "Чат требует обзор еды",
      "Сколько по цене вышло?",
      "Кафе уютное, норм место",
      "Сделай честную оценку от 1 до 10"
    ],
    actions: ["Показать еду", "Оценить вкус", "Показать меню", "Сделать заказ"]
  },
  gaming: {
    label: "Играю / телефон",
    comments: [
      "Жёсткий момент, не моргай",
      "Чат верит в победу",
      "Красиво сыграл!",
      "Сейчас будет хайлайт",
      "Вот это реакция, машина"
    ],
    actions: ["Сделать хайлайт", "Ответить чату", "Начать катку", "Праздновать"]
  }
};

const donations = [
  { name: "Миша", amount: 50, text: "на удачу!" },
  { name: "Алина", amount: 100, text: "стрим топ 🔥" },
  { name: "Даня", amount: 250, text: "держи донат" },
  { name: "Vlad", amount: 500, text: "красавчик, продолжай" },
  { name: "Котик", amount: 1000, text: "лучший эфир сегодня" },
  { name: "Неизвестный", amount: 1500, text: "за атмосферу" }
];

let currentScenario = "chill";
let viewers = 10420;
let targetViewers = 18600;
let likes = 1280;
let totalDonations = 0;
let startedAt = Date.now();

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value) {
  if (value >= 1000) {
    const num = value / 1000;
    return `${num >= 10 ? num.toFixed(1) : num.toFixed(2)}`.replace(".", ",") + "K";
  }
  return String(value);
}

function addMessage({ name, avatar, text, type = "chat" }) {
  const item = document.createElement("div");
  item.className = `message ${type}`;
  item.innerHTML = `<span>${avatar}</span> <strong>${name}</strong><span>${text}</span>`;
  chat.appendChild(item);

  while (chat.children.length > 9) {
    chat.removeChild(chat.firstElementChild);
  }
}

function makeAiComment(action = "") {
  const scenario = scenarios[currentScenario];
  const actionComments = action
    ? [
        `Вот это момент: ${action.toLowerCase()} 👀`,
        `Нормально зашло, когда ты решил: ${action.toLowerCase()}`,
        `Чат заметил действие: ${action.toLowerCase()} 🔥`,
        `Продолжай в таком стиле, ${action.toLowerCase()} — хороший ход`
      ]
    : [];

  const text = action && Math.random() > 0.42 ? randomFrom(actionComments) : randomFrom(scenario.comments);

  addMessage({
    name: randomFrom(names),
    avatar: randomFrom(avatars),
    text
  });
}

function addDonation() {
  const donation = randomFrom(donations);
  totalDonations += donation.amount;
  donationTotalEl.textContent = `${totalDonations.toLocaleString("ru-RU")}₽`;

  addMessage({
    name: donation.name,
    avatar: "💸",
    text: `${donation.amount.toLocaleString("ru-RU")} ₽ — ${donation.text}`,
    type: "donation"
  });
}

function triggerAction(action) {
  makeAiComment(action);
  setTimeout(() => makeAiComment(action), 550);
  likes += Math.floor(Math.random() * 30) + 8;
  targetViewers = clamp(targetViewers + Math.floor(Math.random() * 2600) + 400, 10000, 100000);
  updateStats();
}

function updateStats() {
  viewersEl.textContent = formatNumber(Math.round(viewers));
  likesEl.textContent = formatNumber(likes);
}

function renderScenarioButtons() {
  scenarioButtons.innerHTML = "";
  Object.entries(scenarios).forEach(([key, scenario]) => {
    const button = document.createElement("button");
    button.textContent = scenario.label;
    button.className = key === currentScenario ? "active" : "";
    button.addEventListener("click", () => {
      currentScenario = key;
      contextLabel.textContent = scenario.label;
      settingsPanel.classList.add("hidden");
      renderScenarioButtons();
      renderActionChips();
      addMessage({
        name: "LiveBot",
        avatar: "🤖",
        text: `Контекст изменён: ${scenario.label}. Комментарии будут по теме.`,
        type: "system"
      });
    });
    scenarioButtons.appendChild(button);
  });
}

function renderActionChips() {
  actionChips.innerHTML = "";
  scenarios[currentScenario].actions.forEach((action) => {
    const button = document.createElement("button");
    button.textContent = `⚡ ${action}`;
    button.addEventListener("click", () => triggerAction(action));
    actionChips.appendChild(button);
  });
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1080 },
        height: { ideal: 1920 }
      },
      audio: false
    });

    camera.srcObject = stream;
  } catch (error) {
    cameraError.classList.remove("hidden");
  }
}

settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
});

likeBtn.addEventListener("click", () => {
  likes += 1;
  updateStats();
});

chatActionBtn.addEventListener("click", () => {
  triggerAction("ответить чату");
});

donateActionBtn.addEventListener("click", () => {
  addDonation();
  targetViewers = clamp(targetViewers + 1200, 10000, 100000);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage({
    name: "Ты",
    avatar: "🎥",
    text,
    type: "me"
  });

  input.value = "";
  setTimeout(() => makeAiComment(text), 650);
});

setInterval(() => {
  const diff = targetViewers - viewers;
  if (Math.abs(diff) < 12) {
    viewers = targetViewers;
  } else {
    viewers += diff * 0.035;
  }
  updateStats();
}, 300);

setInterval(() => {
  const drift = Math.round((Math.random() - 0.34) * 9000);
  targetViewers = clamp(targetViewers + drift, 10000, 100000);
}, 6500);

setInterval(() => {
  makeAiComment();
  if (Math.random() > 0.65) {
    likes += Math.floor(Math.random() * 9) + 1;
    updateStats();
  }
}, 2200);

setInterval(() => {
  if (Math.random() > 0.5) addDonation();
}, 8500);

setInterval(() => {
  const seconds = Math.floor((Date.now() - startedAt) / 1000);
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  timerEl.textContent = `${min}:${sec}`;
}, 1000);

renderScenarioButtons();
renderActionChips();
updateStats();
startCamera();

addMessage({
  name: "LiveBot",
  avatar: "🤖",
  text: "Эфир запущен. Чат реагирует на ситуацию и твои действия.",
  type: "system"
});
makeAiComment();
makeAiComment();
