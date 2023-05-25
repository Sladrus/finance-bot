const { baseApi, mainApi } = require('./api');

async function findChat(bot, chat_id) {
  try {
    const response = await baseApi.get(`/chat/${chat_id}`);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data);
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

async function findChatWhere(bot, body) {
  try {
    const response = await baseApi.post(`/chat/get`, body);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data);
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

async function createChat(bot, body) {
  try {
    const response = await baseApi.post(`/chat/create`, body);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data);
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat_id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
  }
}

async function findWhereTaken(bot) {
  try {
    const response = await baseApi.post(`/chat/where`);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data);
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat_id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
  }
}

async function getEmptyChat(bot, chat_id) {
  try {
    const response = await baseApi.get(`/chat/empty`);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data);
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
    console.log(error?.response?.data);
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

module.exports = {
  getEmptyChat,
  restoreChat,
  restoreLkChat,
  findChat,
  findWhereTaken,
  createChat,
  findChatWhere,
};
