const { baseApi } = require('./api');

async function getEmptyChat(bot, chat_id) {
  try {
    const response = await baseApi.get(`/chat/empty`);
    return response.data;
  } catch (error) {
    console.error(error);
    // if (error?.response?.status === 403) {
    //   await bot.sendMessage(
    //     chat_id,
    //     'Учет кассы в этом чате не активирован. Используйте /active'
    //   );
    // }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat_id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
  }
}

module.exports = { getEmptyChat };
