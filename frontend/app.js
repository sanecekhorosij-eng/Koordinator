document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('messages');
  const taskInput = document.getElementById('taskInput');
  const sendBtn = document.getElementById('sendBtn');

  /**
   * Добавление сообщения в чат
   * @param {string} text — текст сообщения
   * @param {'user'|'agent'} sender — отправитель
   */
  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = sender === 'user' ? 'U' : 'A';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);

    // Автоскролл вниз
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /**
   * Отправка задачи на сервер
   */
  async function sendTask() {
    const task = taskInput.value.trim();
    if (!task) return;

    // Отключаем кнопку и инпут на время запроса
    sendBtn.disabled = true;
    taskInput.disabled = true;

    addMessage(task, 'user');
    taskInput.value = '';

    // Показываем индикатор загрузки
    addMessage('...', 'agent');

    try {
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });

      const data = await res.json();

      // Удаляем индикатор загрузки
      messagesEl.removeChild(messagesEl.lastChild);

      if (res.ok) {
        addMessage(data.result, 'agent');
      } else {
        addMessage(`Ошибка: ${data.error}`, 'agent');
      }
    } catch (err) {
      messagesEl.removeChild(messagesEl.lastChild);
      addMessage(`Ошибка соединения: ${err.message}`, 'agent');
    }

    sendBtn.disabled = false;
    taskInput.disabled = false;
    taskInput.focus();
  }

  // Обработчики событий
  sendBtn.addEventListener('click', sendTask);
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendTask();
  });
});
