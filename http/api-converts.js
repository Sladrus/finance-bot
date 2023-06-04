const { baseApi } = require('./api');

async function findOrder(bot, id) {
  try {
    const response = await baseApi.get(`/order/${id}`);
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat_id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
    console.error(error);
  }
}

module.exports = {
    findOrder,
};
