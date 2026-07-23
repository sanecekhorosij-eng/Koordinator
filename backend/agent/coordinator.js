const Memory = require('./memory');
const Tools = require('./tools');
const Planner = require('./planner');

/**
 * Coordinator — главный модуль AI-агента.
 * Принимает задачи пользователя, планирует их выполнение,
 * запускает инструменты и управляет памятью.
 */
class Coordinator {
  constructor() {
    this.memory = new Memory();
    this.tools = new Tools();
    this.planner = new Planner();
    this.isRunning = false;
  }

  /**
   * Запуск обработки задачи пользователя
   * @param {string} userTask — текст задачи от пользователя
   * @returns {Promise<string>} — ответ агента
   */
  async processTask(userTask) {
    this.isRunning = true;

    // 1. Поиск похожих задач в памяти
    const similar = this.memory.findSimilar(userTask);
    if (similar) {
      console.log(`[Coordinator] Найдено в памяти: "${similar.task}" -> "${similar.result}"`);
    }

    // 2. Планирование
    const plan = this.planner.createPlan(userTask);
    console.log(`[Coordinator] План: ${plan.description}`);

    // 3. Выполнение шагов плана
    let result = '';
    for (const step of plan.steps) {
      result = await this.executeStep(step);
    }

    // 4. Сохранение результата в память
    this.memory.save(userTask, result);

    this.isRunning = false;
    return result;
  }

  /**
   * Выполнение одного шага плана
   * @param {object} step — шаг с инструментом и аргументами
   * @returns {Promise<string>}
   */
  async executeStep(step) {
    console.log(`[Coordinator] Шаг: ${step.tool}(${JSON.stringify(step.args)})`);
    return this.tools.run(step.tool, step.args);
  }

  /**
   * Подготовка к подключению Ollama
   * @param {string} model — название модели (по умолчанию 'llama3')
   */
  async connectOllama(model = 'llama3') {
    this.ollamaModel = model;
    this.ollamaUrl = 'http://localhost:11434/api/generate';
    console.log(`[Coordinator] Ollama подготовлен: модель ${model}`);
  }
}

module.exports = Coordinator;
