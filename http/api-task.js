const { baseApi } = require('./api');

async function createTasks(bot, chat_id, body) {
  try {
    const response = await baseApi.post(`/task/create/${chat_id}`, body);
    return response.data;
  } catch (error) {
    console.error(error);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat_id,
        'Учет кассы в этом чате не активирован. Используйте /active'
      );
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat_id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
  }
}

module.exports = { createTasks };
