/**
 * Planner — планировщик задач агента.
 * Разбивает задачу пользователя на шаги
 * и определяет, какие инструменты нужны.
 *
 * В будущем будет использовать Ollama для
 * динамического построения планов.
 */
class Planner {
  /**
   * Создать план выполнения задачи
   * @param {string} userTask — текст задачи
   * @returns {object} — план с шагами
   */
  createPlan(userTask) {
    const lower = userTask.toLowerCase();

    if (lower.includes('калькули') || lower.includes('вычисл') || lower.includes('+') || lower.includes('-')) {
      return {
        description: 'Вычисление выражения',
        steps: [
          { tool: 'calculator', args: { expression: userTask } }
        ]
      };
    }

    if (lower.includes('время') || lower.includes('час') || lower.includes('date')) {
      return {
        description: 'Получение текущего времени',
        steps: [
          { tool: 'current_time', args: {} }
        ]
      };
    }

    // По умолчанию — эхо-ответ
    return {
      description: 'Ответ на вопрос',
      steps: [
        { tool: 'echo', args: { message: `Задача принята: "${userTask}". Обработка через Ollama будет добавлена в следующем этапе.` } }
      ]
    };
  }
}

module.exports = Planner;
