import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Gift, Heart, MessageCircle, Mic, Radio, Send, Settings, Sparkles, Users, Video, Zap } from "lucide-react";

const names = [
  "Артём", "Маша", "Даня", "Кирилл", "Лера", "Никита", "Соня", "Илья", "Вика", "Рома",
  "Макс", "Алина", "Егор", "Катя", "Дима", "Настя", "Саша", "Тим", "Полина", "Лёша"
];

const avatars = ["😎", "🔥", "💜", "🚀", "🎧", "👑", "🐻", "⚡", "🌙", "⭐", "💎", "🫶", "🏆", "🎮"];

const scenarios = {
  walking: {
    label: "Иду на улице",
    keywords: ["улица", "идёшь", "прогулка", "город", "дорога", "камера"],
    comments: [
      "Камера как будто реально с улицы, вайб топ 🔥",
      "О, город красиво смотрится на фоне",
      "Иди аккуратно, чат с тобой 😄",
      "Вот это живой стрим, не постановка",
      "Свет сейчас прям кинематографичный"
    ],
    actions: ["Показать вид", "Поздороваться", "Ускорить шаг", "Остановиться"]
  },
  car: {
    label: "Еду в машине",
    keywords: ["машина", "еду", "дорога", "тачка", "салон", "руль"],
    comments: [
      "Дорога выглядит спокойно, только не отвлекайся 🙏",
      "Стрим из машины — это мощно",
      "Салон красиво подсвечивается",
      "Чат, пристегнулись? 😄",
      "Едешь аккуратно, красавчик"
    ],
    actions: ["Повернуть камеру", "Сказать куда еду", "Показать дорогу", "Включить музыку"]
  },
  food: {
    label: "Еда / кафе",
    keywords: ["еда", "кафе", "обед", "ужин", "напиток", "меню"],
    comments: [
      "Вот это выглядит вкусно, теперь все голодные 😭",
      "Чат требует обзор еды",
      "Сколько по цене вышло?",
      "Кафе уютное, норм место",
      "Сделай честную оценку от 1 до 10"
    ],
    actions: ["Показать еду", "Оценить вкус", "Показать меню", "Сделать заказ"]
  },
  gaming: {
    label: "Играю / телефон",
    keywords: ["игра", "телефон", "матч", "катка", "гейм", "победа"],
    comments: [
      "Жёсткий момент, не моргай 😳",
      "Чат верит в победу",
      "Красиво сыграл!",
      "Сейчас будет хайлайт",
      "Вот это реакция, машина"
    ],
    actions: ["Сделать хайлайт", "Ответить чату", "Начать катку", "Праздновать"]
  },
  chill: {
    label: "Просто общаюсь",
    keywords: ["чат", "разговор", "вопрос", "общение", "стрим", "лайв"],
    comments: [
      "Нравится такой спокойный формат",
      "Отвечай на вопросы, тут много новых",
      "Атмосфера как у большого стримера",
      "Чат сегодня активный",
      "Продолжай, интересно слушать"
    ],
    actions: ["Ответить на вопрос", "Попросить лайк", "Рассказать историю", "Сделать мини-Q&A"]
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatViewers(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 1 : 2).replace(".", ",")}K`;
  return String(value);
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function makeMessage(scenarioKey, action = "") {
  const scenario = scenarios[scenarioKey];
  const base = randomFrom(scenario.comments);
  const actionComments = action
    ? [
        `Вот это момент: ${action.toLowerCase()} 👀`,
        `Нормально зашло, когда ты решил: ${action.toLowerCase()}`,
        `Чат заметил действие: ${action.toLowerCase()} 🔥`,
        `Продолжай в таком стиле, ${action.toLowerCase()} — хороший ход`
      ]
    : [];

  return {
    id: crypto.randomUUID(),
    name: randomFrom(names),
    avatar: randomFrom(avatars),
    text: Math.random() > 0.45 && actionComments.length ? randomFrom(actionComments) : base,
    type: "chat"
  };
}

function makeDonation() {
  const item = randomFrom(donations);
  return {
    id: crypto.randomUUID(),
    name: item.name,
    avatar: "💸",
    text: `${item.amount.toLocaleString("ru-RU")} ₽ — ${item.text}`,
    amount: item.amount,
    type: "donation"
  };
}

export default function App() {
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [scenario, setScenario] = useState("chill");
  const [viewers, setViewers] = useState(10420);
  const [targetViewers, setTargetViewers] = useState(18700);
  const [likes, setLikes] = useState(1280);
  const [messages, setMessages] = useState(() => [
    { id: crypto.randomUUID(), name: "LiveBot", avatar: "🤖", text: "Эфир запущен. Чат реагирует на ситуацию и действия.", type: "system" },
    makeMessage("chill"),
    makeMessage("chill")
  ]);
  const [input, setInput] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [totalDonations, setTotalDonations] = useState(0);

  const scenarioData = scenarios[scenario];

  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1080 }, height: { ideal: 1920 } },
          audio: false
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        setCameraError("Камера недоступна. Разреши доступ к камере или открой сайт через HTTPS.");
      }
    }
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    const smoothCounter = setInterval(() => {
      setViewers((current) => {
        const diff = targetViewers - current;
        if (Math.abs(diff) < 12) return targetViewers;
        return Math.round(current + diff * 0.035);
      });
    }, 300);
    return () => clearInterval(smoothCounter);
  }, [targetViewers]);

  useEffect(() => {
    const targetTimer = setInterval(() => {
      setTargetViewers((current) => {
        const drift = Math.round((Math.random() - 0.34) * 9000);
        return clamp(current + drift, 10000, 100000);
      });
    }, 6500);
    return () => clearInterval(targetTimer);
  }, []);

  useEffect(() => {
    const chatTimer = setInterval(() => {
      setMessages((items) => [...items.slice(-34), makeMessage(scenario)]);
      if (Math.random() > 0.68) setLikes((value) => value + Math.floor(Math.random() * 9) + 1);
    }, 2100);
    return () => clearInterval(chatTimer);
  }, [scenario]);

  useEffect(() => {
    const donationTimer = setInterval(() => {
      if (Math.random() > 0.48) {
        const donation = makeDonation();
        setMessages((items) => [...items.slice(-34), donation]);
        setTotalDonations((value) => value + donation.amount);
      }
    }, 8500);
    return () => clearInterval(donationTimer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const liveDuration = useMemo(() => {
    const minutes = Math.floor((Date.now() / 60000) % 60).toString().padStart(2, "0");
    return `00:${minutes}`;
  }, [messages.length]);

  function triggerAction(action) {
    setMessages((items) => [...items.slice(-34), makeMessage(scenario, action), makeMessage(scenario, action)]);
    setLikes((value) => value + Math.floor(Math.random() * 30) + 8);
    setTargetViewers((value) => clamp(value + Math.floor(Math.random() * 2600) + 400, 10000, 100000));
  }

  function sendOwnMessage() {
    const text = input.trim();
    if (!text) return;
    setMessages((items) => [
      ...items.slice(-34),
      { id: crypto.randomUUID(), name: "Ты", avatar: "🎥", text, type: "me" },
      makeMessage(scenario, text)
    ]);
    setInput("");
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover" />

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 px-8 text-center">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <Camera className="mx-auto mb-3 h-10 w-10" />
            <h1 className="text-xl font-bold">Камера не включилась</h1>
            <p className="mt-2 text-sm text-white/70">{cameraError}</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/80" />

      <header className="absolute left-0 right-0 top-0 z-10 flex items-start justify-between p-4 pt-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wide shadow-lg">
              <Radio className="h-3 w-3" /> LIVE
            </span>
            <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur-md">{liveDuration}</span>
          </div>
          <div className="rounded-2xl bg-black/35 px-3 py-2 backdrop-blur-md">
            <p className="text-xs text-white/70">Сейчас</p>
            <p className="text-sm font-semibold">{scenarioData.label}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-sm font-bold shadow-lg backdrop-blur-md">
            <Users className="h-4 w-4" /> {formatViewers(viewers)}
          </div>
          <button onClick={() => setShowPanel((value) => !value)} className="rounded-full bg-white/15 p-3 backdrop-blur-md active:scale-95">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <section className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-4">
        <button onClick={() => setLikes((value) => value + 1)} className="flex flex-col items-center gap-1 active:scale-95">
          <span className="rounded-full bg-black/40 p-3 backdrop-blur-md"><Heart className="h-6 w-6 fill-white" /></span>
          <span className="text-xs font-bold">{formatViewers(likes)}</span>
        </button>
        <button onClick={() => triggerAction("ответить чату")} className="flex flex-col items-center gap-1 active:scale-95">
          <span className="rounded-full bg-black/40 p-3 backdrop-blur-md"><MessageCircle className="h-6 w-6" /></span>
          <span className="text-xs font-bold">чат</span>
        </button>
        <button onClick={() => triggerAction("получить донат")} className="flex flex-col items-center gap-1 active:scale-95">
          <span className="rounded-full bg-black/40 p-3 backdrop-blur-md"><Gift className="h-6 w-6" /></span>
          <span className="text-xs font-bold">{totalDonations.toLocaleString("ru-RU")}₽</span>
        </button>
      </section>

      <AnimatePresence>
        {showPanel && (
          <motion.aside
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-4 right-4 top-28 z-20 rounded-3xl border border-white/10 bg-zinc-950/80 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center gap-2 font-bold"><Sparkles className="h-5 w-5" /> Режим ИИ-чата</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(scenarios).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => {
                    setScenario(key);
                    setMessages((items) => [...items.slice(-34), { id: crypto.randomUUID(), name: "LiveBot", avatar: "🤖", text: `Контекст изменён: ${item.label}. Комментарии будут по теме.`, type: "system" }]);
                  }}
                  className={`rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${scenario === key ? "bg-white text-black" : "bg-white/10 text-white"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <section className="absolute bottom-24 left-3 right-16 z-10 max-h-[38vh] overflow-hidden">
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {messages.slice(-9).map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0 }}
                className={`max-w-[96%] rounded-2xl px-3 py-2 shadow-lg backdrop-blur-md ${
                  message.type === "donation"
                    ? "border border-yellow-300/50 bg-yellow-500/25"
                    : message.type === "system"
                    ? "border border-cyan-300/30 bg-cyan-500/20"
                    : message.type === "me"
                    ? "bg-white/25"
                    : "bg-black/35"
                }`}
              >
                <p className="text-sm leading-snug">
                  <span className="mr-1">{message.avatar}</span>
                  <span className="font-bold">{message.name}</span>{" "}
                  <span className="text-white/90">{message.text}</span>
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>
      </section>

      <footer className="absolute bottom-0 left-0 right-0 z-20 space-y-3 p-3 pb-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {scenarioData.actions.map((action) => (
            <button
              key={action}
              onClick={() => triggerAction(action)}
              className="shrink-0 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-md active:scale-95"
            >
              <Zap className="mr-1 inline h-4 w-4" /> {action}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-full bg-black/45 p-2 backdrop-blur-xl">
          <button className="rounded-full bg-white/10 p-3"><Mic className="h-5 w-5" /></button>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && sendOwnMessage()}
            placeholder="Написать в чат или действие..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/55"
          />
          <button onClick={sendOwnMessage} className="rounded-full bg-white px-4 py-3 text-black active:scale-95">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </footer>

      <div className="pointer-events-none absolute left-4 top-[42%] z-10 rounded-full border border-white/15 bg-black/30 px-3 py-2 text-xs font-semibold backdrop-blur-md">
        <Video className="mr-1 inline h-4 w-4" /> Fullscreen camera stream
      </div>
    </main>
  );
}
