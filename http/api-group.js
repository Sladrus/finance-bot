const { baseApi } = require('./api');

async function findGroup(bot, chat_id, title) {
  try {
    const response = await baseApi.get(`/group/${chat_id}`);
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

async function findOrCreateGroup(bot, chat_id, title) {
  try {
    const response = await baseApi.post(`/group/create/${chat_id}`, null, {
      params: {
        title,
      },
    });
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

async function updateGroup(bot, chat_id, body) {
  try {
    const response = await baseApi.put(`/group/update/${chat_id}`, body);
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

async function activeGroup(bot, chat_id) {
  try {
    const response = await baseApi.post(`/group/active/${chat_id}`);
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

async function restoreGroup(bot, chat_id) {
  try {
    const response = await baseApi.post(`/group/restore/${chat_id}`);
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
  findOrCreateGroup,
  updateGroup,
  activeGroup,
  findGroup,
  restoreGroup,
};
