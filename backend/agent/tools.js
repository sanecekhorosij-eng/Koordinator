/**
 * Tools — менеджер инструментов агента.
 * Позволяет регистрировать новые инструменты
 * и вызывать их по имени.
 *
 * Место для будущих подключений:
 * - GitHub API
 * - Браузер (Puppeteer/Playwright)
 * - Файловая система
 * - Другие внешние API
 */
class Tools {
  constructor() {
    this.registry = new Map();
    this._registerBuiltin();
  }

  /**
   * Регистрация встроенных инструментов
   */
  _registerBuiltin() {
    this.register('echo', async (args) => {
      return args.message || '';
    });

    this.register('calculator', async (args) => {
      const { expression } = args;
      try {
        const result = eval(expression);
        return String(result);
      } catch {
        return `Ошибка в выражении: ${expression}`;
      }
    });

    this.register('current_time', async () => {
      return new Date().toLocaleString('ru-RU');
    });
  }

  /**
   * Регистрация нового инструмента
   * @param {string} name — имя инструмента
   * @param {Function} handler — асинхронная функция (args) => string
   */
  register(name, handler) {
    this.registry.set(name, handler);
    console.log(`[Tools] Зарегистрирован инструмент: ${name}`);
  }

  /**
   * Вызов инструмента по имени
   * @param {string} name — имя инструмента
   * @param {object} args — аргументы
   * @returns {Promise<string>}
   */
  async run(name, args = {}) {
    const tool = this.registry.get(name);
    if (!tool) {
      return `Инструмент "${name}" не найден. Доступны: ${[...this.registry.keys()].join(', ')}`;
    }
    return tool(args);
  }

  /**
   * Список зарегистрированных инструментов
   * @returns {string[]}
   */
  list() {
    return [...this.registry.keys()];
  }
}

module.exports = Tools;
