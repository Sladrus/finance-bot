const { baseApi, mainApi } = require('./api');

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

async function restoreLkChat(bot, chat_id) {
  try {
    const response = await mainApi.get(`/ChatRestore?chat_id=${chat_id}`);
    return response.data;
  } catch (error) {
    await bot.sendMessage(chat_id, `Произошла неизвестная ошибка.`, {
      parse_mode: 'HTML',
    });
    return null;
  }
}

async function restoreChat(bot, chat_id, link) {
  try {
    const response = await baseApi.post(
      `/chat/restore?chat_id=${chat_id}&link=${link}`
    );
    return response.data;
  } catch (error) {
    // console.error(error);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat_id,
        'Данный чат отсутсвует в базе созданных чатов.'
      );
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat_id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
    if (error?.response?.status === 400) {
      await bot.sendMessage(chat_id, `Произошла неизвестная ошибка.`, {
        parse_mode: 'HTML',
      });
    }
    return null;
  }
}

module.exports = { getEmptyChat, restoreChat, restoreLkChat };
