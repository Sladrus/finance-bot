const { baseApi } = require('./api');

async function createLogs(bot, { chat, message_id, from, text }) {
  try {
    const first = from.first_name || '';
    const last = from.last_name || '';
    const name = first + ' ' + last;
    const response = await baseApi.post(`/log/create/${chat.id}`, {
      user_id: from.id,
      text,
      message_id,
      username: from.username || null,
      author: name
    });
    return response.data;
  } catch (error) {
    console.error(error);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat.id,
        'Учет кассы в этом чате не активирован. Используйте /active'
      );
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat.id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
  }
}

module.exports = { createLogs };
