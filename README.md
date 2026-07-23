# TECTOV — AI Agent Coordinator

Локальный AI-агент координатор, который работает на ПК, подключается к локальной модели Ollama и в будущем может стать мобильным приложением через браузер (PWA).

## Структура проекта

```
TECTOV/
├── backend/
│   ├── agent/
│   │   ├── coordinator.js    # Главный модуль
│   │   ├── memory.js          # Память (brain/memory.json)
│   │   ├── tools.js           # Инструменты
│   │   └── planner.js         # Планировщик
│   └── server.js              # HTTP-сервер
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── brain/
│   └── memory.json            # Файл памяти
├── tools/
│   └── README.md
├── package.json
├── README.md
└── .gitignore
```

## Запуск

```bash
npm start
```

Сервер запустится на http://localhost:3000

## API

- `POST /api/task` — отправить задачу агенту (`{ "task": "..." }`)
- `GET /api/memory` — получить историю задач

## Этапы

1. **Базовая архитектура** (текущий) — простые инструменты, память, планировщик
2. **Подключение Ollama** — интеграция с локальной LLM
3. **PWA** — офлайн-режим, мобильная адаптация
