const { evaluate } = require('mathjs');
const { findGroup } = require('../http/api-group');
const { setActives } = require('../http/api-balance');
const { formatter } = require('../utils');

function validateSymbol(arg0) {
  const currencies = [
    'USD',
    'AED',
    'USDT',
    'RUB',
    'EUR',
    'CNY',
    'GBP',
    'TRY',
    'CAD',
    'THB',
    'GRX',
  ];
  //   const events = ['SP', 'IN', 'OUT', 'DEL'];
  //   const event = events.includes(arg0.toUpperCase()) ? arg0.toLowerCase() : null;
  //   if (event) {
  //     const symbol = arg1.toUpperCase();
  //     return currencies.includes(symbol) ? [event, symbol] : [null, null];
  //   }
  const symbol = arg0.toUpperCase();
  return currencies.includes(symbol) ? symbol : null;
}

function validateArgs(args) {
  try {
    const symbol = validateSymbol(args[0]);
    console.log(symbol);
    const symbolIndex = 1;
    const expression = args[symbolIndex];
    const comment = args.slice(symbolIndex + 1, args.length).join(' ') || null;
    console.log(symbol, expression, comment);
    const regex = /^[+\-/*]/; // регулярное выражение для поиска одного из символов: +, -, /, *

    if (regex.test(comment)) {
      console.log('Строка начинается с символа +, -, / или *');
      return [null, null, null];
    } else {
      console.log('Строка не начинается с символа +, -, / или *');
    }
    return [symbol, evaluate(expression), comment];
  } catch (e) {
    console.log(e);
    return [null, null, null];
  }
}

const setActivesCommand = async (bot, msg, args) => {
  const [symbol, value, comment] = validateArgs(args);
  console.log(symbol, value, comment);
  if (symbol === null || value === undefined)
    return await bot.sendMessage(
      msg.chat.id,
      `Произошла ошибка! Проверьте правильность ввода комманды/валюты.`,
      { parse_mode: 'HTML' }
    );
  const balance = await setActives(bot, msg, symbol, value, comment);
  if (balance === undefined) return;
  console.log(balance);
  await bot.sendMessage(
    msg.chat.id,
    `Новая запись добавлена\n<b>${balance.lastRecord.symbol.toUpperCase()}:</b> ${formatter(
      balance.lastRecord.symbol,
      balance.lastRecord.val
    )}\n<b>Комментарий:</b> ${balance.lastRecord.comment}`,
    { parse_mode: 'HTML' }
  );
};

module.exports = async function accActiveCommand(bot, msg, args) {
  if (args['=ERRORS'].length) return;
  if (msg.chat.type === 'private') return;
  const group = await findGroup(bot, msg.chat.id, msg.chat.title);
  if (!group) return;
  await setActivesCommand(bot, msg, args);
};
