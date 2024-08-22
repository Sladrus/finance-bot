const { baseApi } = require("./api");

async function showBalances(bot, chat_id) {
  try {
    const response = await baseApi.get(`/balance/show/${chat_id}`);
    return response.data;
  } catch (error) {
    console.log(error?.response?.data);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat_id,
        "Учет кассы в этом чате не активирован. Используйте /active"
      );
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat_id, `Неправильный API токен.`, {
        parse_mode: "HTML",
      });
    }
  }
}

async function setActives(
  bot,
  { chat, message_id, from },
  symbol,
  balance,
  comment
) {
  try {
    const first = from.first_name || "";
    const last = from.last_name || "";
    const name = first + " " + last;
    const response = await baseApi.post(
      `/balance/actives/${chat.id}`,
      {
        comment,
        message_id,
        first_name: name,
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
    console.log(error?.response?.data);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat.id,
        "Учет кассы в этом чате не активирован. Используйте /active"
      );
    }
    if (error?.response?.status === 400) {
      await bot.sendMessage(chat.id, `${error?.response?.data?.message}`, {
        parse_mode: "HTML",
      });
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat.id, `Неправильный API токен.`, {
        parse_mode: "HTML",
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
  comment,
  expression
) {
  try {
    const first = from.first_name || "";
    const last = from.last_name || "";
    const name = first + " " + last;
    const response = await baseApi.post(
      `/balance/set/${chat.id}`,
      {
        event,
        comment,
        message_id,
        first_name: name,
        expression,
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
    console.log(error?.response?.data);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat.id,
        "Учет кассы в этом чате не активирован. Используйте /active"
      );
    }
    if (error?.response?.status === 400) {
      await bot.sendMessage(chat.id, `${error?.response?.data?.message}`, {
        parse_mode: "HTML",
      });
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat.id, `Неправильный API токен.`, {
        parse_mode: "HTML",
      });
    }
  }
}

async function delBalances(bot, { chat, message_id, from }, symbol, event) {
  try {
    const first = from.first_name || "";
    const last = from.last_name || "";
    const name = first + " " + last;
    const response = await baseApi.post(
      `/balance/del/${chat.id}`,
      {
        event,
        comment: "BDel",
        message_id,
        first_name: name,
      },
      {
        params: {
          symbol,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error?.response?.data);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat.id,
        "Учет кассы в этом чате не активирован. Используйте /active"
      );
    }
    if (error?.response?.status === 400) {
      await bot.sendMessage(chat.id, `${error.response?.data?.message}`, {
        parse_mode: "HTML",
      });
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat.id, `Неправильный API токен.`, {
        parse_mode: "HTML",
      });
    }
  }
}

module.exports = {
  showBalances,
  setBalances,
  delBalances,
  setActives,
};
