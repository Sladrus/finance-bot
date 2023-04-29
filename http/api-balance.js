const { baseApi } = require('./api');

async function showBalances(bot, chat_id) {
  try {
    const response = await baseApi.get(`/balance/show/${chat_id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat_id,
        'Учет кассы в этом чате не активирован. Используйте /active «ключ»'
      );
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat_id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
  }
}

async function setBalances(
  bot,
  { chat, message_id, from },
  event,
  symbol,
  balance,
  comment
) {
  try {
    const response = await baseApi.post(
      `/balance/set/${chat.id}`,
      {
        event,
        comment,
        message_id,
        first_name: from.username || from.first_name,
      },
      {
        params: {
          symbol,
          balance,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat.id,
        'Учет кассы в этом чате не активирован. Используйте /active «ключ»'
      );
    }
    if (error?.response?.status === 400) {
      await bot.sendMessage(chat.id, `${error?.response?.data?.message}`, {
        parse_mode: 'HTML',
      });
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat.id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
  }
}

async function delBalances(bot, { chat, message_id, from }, symbol, event) {
  try {
    const response = await baseApi.post(
      `/balance/del/${chat.id}`,
      {
        event,
        comment: 'BDel',
        message_id,
        first_name: from.username || from.first_name,
      },
      {
        params: {
          symbol,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat.id,
        'Учет кассы в этом чате не активирован. Используйте /active «ключ»'
      );
    }
    if (error?.response?.status === 400) {
      await bot.sendMessage(chat.id, `${error.response?.data?.message}`, {
        parse_mode: 'HTML',
      });
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat.id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
  }
}

module.exports = {
  showBalances,
  setBalances,
  delBalances,
};
