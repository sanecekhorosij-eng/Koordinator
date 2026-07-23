const fs = require('fs');
const path = require('path');

/**
 * Memory — система локальной памяти агента.
 * Хранит данные в brain/memory.json.
 * Позволяет сохранять, получать и искать задачи.
 */
class Memory {
  constructor() {
    this.filePath = path.join(__dirname, '..', '..', 'brain', 'memory.json');
    this.data = this._load();
  }

  /**
   * Загрузка данных из файла
   * @returns {object}
   */
  _load() {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (!Array.isArray(data.tasks)) data.tasks = [];
      if (typeof data.knowledge !== 'object') data.knowledge = {};
      return data;
    } catch {
      return { tasks: [], knowledge: {} };
    }
  }

  /**
   * Сохранение данных в файл
   */
  _save() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  /**
   * Сохранить результат выполнения задачи
   * @param {string} task — задача
   * @param {string} result — результат
   */
  save(task, result) {
    this.data.tasks.push({ task, result, timestamp: new Date().toISOString() });
    this._save();
  }

  /**
   * Получить все сохранённые задачи
   * @returns {Array}
   */
  getAll() {
    return this.data.tasks;
  }

  /**
   * Поиск похожей задачи в памяти (простейшее совпадение по ключевым словам)
   * @param {string} task — новая задача
   * @returns {object|null}
   */
  findSimilar(task) {
    const words = task.toLowerCase().split(' ');
    for (const entry of this.data.tasks) {
      const entryWords = entry.task.toLowerCase().split(' ');
      const matchCount = words.filter(w => entryWords.includes(w)).length;
      if (matchCount > 2) {
        return entry;
      }
    }
    return null;
  }

  /**
   * Сохранить произвольное знание
   * @param {string} key
   * @param {*} value
   */
  setKnowledge(key, value) {
    this.data.knowledge[key] = value;
    this._save();
  }

  /**
   * Получить знание по ключу
   * @param {string} key
   * @returns {*}
   */
  getKnowledge(key) {
    return this.data.knowledge[key];
  }
}

module.exports = Memory;
