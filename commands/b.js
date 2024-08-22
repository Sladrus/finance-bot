const { evaluate, expression } = require("mathjs");
const { findOrCreateGroup, findGroup } = require("../http/api-group");
const {
  setBalances,
  delBalances,
  showBalances,
} = require("../http/api-balance");
const { formatter, formatDate } = require("../utils");

const findCommentIndex = (args) => {
  function isComment(element, index, array) {
    return /[^\d+-/*%\/./(/)]/gm.test(element);
  }
  const index = args.findIndex(isComment);
  return index;
};

function validateSymbol(arg0, arg1) {
  const currencies = [
    "USD",
    "AED",
    "USDT",
    "RUB",
    "EUR",
    "CNY",
    "GBP",
    "TRY",
    "CAD",
    "THB",
    "GRX",
    "JPY",
    "KRW",
    "BTC",
    "ETH",
    "CHF",
  ];
  const events = ["SP", "IN", "OUT", "DEL", "ADV"];
  const event = events.includes(arg0.toUpperCase()) ? arg0.toLowerCase() : null;
  if (event) {
    const symbol = arg1.toUpperCase();
    return currencies.includes(symbol) ? [event, symbol] : [null, null];
  }
  const symbol = arg0.toUpperCase();
  return currencies.includes(symbol) ? [null, symbol] : [null, null];
}

function validateArgs(args) {
  try {
    const [event, symbol] = validateSymbol(args[0], args[1]);
    const symbolIndex = event ? 2 : 1;
    const expression = args[symbolIndex];
    const comment = args.slice(symbolIndex + 1, args.length).join(" ") || null;
    console.log(event, symbol, expression, comment);
    const regex = /^[+\-/*]/; // регулярное выражение для поиска одного из символов: +, -, /, *

    if (regex.test(comment)) {
      console.log("Строка начинается с символа +, -, / или *");
      return [null, null, null, null];
    } else {
      console.log("Строка не начинается с символа +, -, / или *");
    }
    return [event, symbol, evaluate(expression), comment, expression];
  } catch (e) {
    console.log(e);
    return [null, null, null, null, null];
  }
}

const showBalance = async (bot, msg, chatId) => {
  const response = await showBalances(bot, chatId);
  if (!response) {
    return;
  }
  const { balances, lastRecord } = response;
  if (balances === undefined) return;
  let message = "";
  balances.forEach((balance) => {
    message += `<b>${balance.symbol.toUpperCase()}:</b> ${formatter(
      balance.symbol,
      balance.balance
    )}\n`;
  });
  console.log(lastRecord);
  await bot.sendMessage(
    chatId,
    balances.length > 0
      ? `Баланс:\n${message}`
      : `Балансы пустые. Используйте /b «валюта» «сумма» «комментарий»`,
    { parse_mode: "HTML", message_thread_id: msg?.message_thread_id || null }
  );
};

const setBalance = async (bot, msg, args) => {
  const [event, symbol, value, comment, expression] = validateArgs(args);
  console.log(event, symbol, Number(value), comment, "TYT");
  if (isNaN(Number(value))) {
    return await bot.sendMessage(
      msg.chat.id,
      `Произошла ошибка! Проверьте правильность ввода комманды/валюты.`,
      { parse_mode: "HTML", message_thread_id: msg?.message_thread_id || null }
    );
  }
  if (symbol === null || value === undefined)
    return await bot.sendMessage(
      msg.chat.id,
      `Произошла ошибка! Проверьте правильность ввода комманды/валюты.`,
      { parse_mode: "HTML", message_thread_id: msg?.message_thread_id || null }
    );
  const balance = await setBalances(
    bot,
    msg,
    event,
    symbol,
    value,
    comment,
    expression
  );
  if (balance === undefined) return;
  console.log(balance);
  await bot.sendMessage(
    msg.chat.id,
    `<b>Запомнил ${formatter(
      balance.lastRecord.symbol,
      balance.lastRecord.val
    )}</b>\nБаланс <b>${balance.oldBal.symbol.toUpperCase()}:</b> ${formatter(
      balance.oldBal.symbol,
      balance.oldBal.balance
    )}`,
    { parse_mode: "HTML", message_thread_id: msg?.message_thread_id || null }
  );
};

const delBalance = async (bot, msg, args) => {
  const [event, symbol] = validateSymbol(args[0], args[1]);
  if (symbol === null)
    return await bot.sendMessage(
      msg.chat.id,
      `Произошла ошибка! Такая валюта не принимается/!`,
      { parse_mode: "HTML", message_thread_id: msg?.message_thread_id || null }
    );
  const balance = await delBalances(bot, msg, symbol, event);
  if (balance === undefined) return;
  await bot.sendMessage(
    msg.chat.id,
    `Баланс <b>${balance.bal.symbol.toUpperCase()}</b> очищен`,
    { parse_mode: "HTML", message_thread_id: msg?.message_thread_id || null }
  );
};
//b sp rub 100
module.exports = async function bCommand(bot, msg, args) {
  if (args["=ERRORS"].length) return;
  if (msg.chat.type === "private") return;
  const group = await findGroup(bot, msg.chat.id, msg.chat.title);
  console.log(group);
  if (!group) return;
  if (args.length === 0) return await showBalance(bot, msg, msg.chat.id);
  if (args.length >= 2)
    return args[0].toUpperCase() === "DEL"
      ? await delBalance(bot, msg, args)
      : await setBalance(bot, msg, args);
  return await bot.sendMessage(
    msg.chat.id,
    `Произошла ошибка! Проверьте правильность ввода комманды/валюты.`,
    { parse_mode: "HTML", message_thread_id: msg?.message_thread_id || null }
  );
};
