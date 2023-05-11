const { evaluate, expression } = require('mathjs');
const { findOrCreateGroup, findGroup } = require('../http/api-group');
const {
  setBalances,
  delBalances,
  showBalances,
} = require('../http/api-balance');
const { formatter, formatDate } = require('../utils');

const findCommentIndex = (args) => {
  function isComment(element, index, array) {
    return /[^\d+-/*%\/./(/)]/gm.test(element);
  }
  const index = args.findIndex(isComment);
  return index;
};

function validateSymbol(arg0, arg1) {
  const currencies = [
    'USD',
    'AED',
    'USDT',
    'RUB',
    'EUR',
    'CNY',
    'GBP',
    'UAH',
    'TRY',
    'CAD',
    'THB',
    'GRX',
  ];
  const events = ['SP', 'IN', 'OUT', 'DEL'];
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
    // const expression = args[symbolIndex];
    // const comment = args.slice(symbolIndex + 1, args.length).join(' ') || null;
    // console.log(event, symbol, expression, comment);

    const index = findCommentIndex(args.slice(symbolIndex, args.length));
    const expression =
      index == -1
        ? args.length == 2
          ? args[1]
          : args.slice(symbolIndex).join(' ')
        : args.slice(symbolIndex, index + symbolIndex).join(' ');
    const comment =
      index != -1 ? args.slice(index + symbolIndex).join(' ') : null;
    console.log(event, symbol, evaluate(expression), comment);
    return [event, symbol, evaluate(expression), comment];
    // return [event, symbol, evaluate(expression), comment];
  } catch (e) {
    console.log(e);
    return [null, null, null, null];
  }
}

const showBalance = async (bot, chatId) => {
  const response = await showBalances(bot, chatId);
  if (!response) {
    return;
  }
  const { balances, lastRecord } = response;
  if (balances === undefined) return;
  let message = '';
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
    { parse_mode: 'HTML' }
  );
};

const setBalance = async (bot, msg, args) => {
  const [event, symbol, value, comment] = validateArgs(args);
  if (symbol === null || value === undefined)
    return await bot.sendMessage(
      msg.chat.id,
      `Произошла ошибка! Проверьте правильность ввода комманды/валюты.`,
      { parse_mode: 'HTML' }
    );
  const balance = await setBalances(bot, msg, event, symbol, value, comment);
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
    { parse_mode: 'HTML' }
  );
};

const delBalance = async (bot, msg, args) => {
  const [event, symbol] = validateSymbol(args[0], args[1]);
  if (symbol === null)
    return await bot.sendMessage(
      msg.chat.id,
      `Произошла ошибка! Такая валюта не принимается/!`,
      { parse_mode: 'HTML' }
    );
  const balance = await delBalances(bot, msg, symbol, event);
  if (balance === undefined) return;
  await bot.sendMessage(
    msg.chat.id,
    `Баланс <b>${balance.bal.symbol.toUpperCase()}</b> очищен`,
    { parse_mode: 'HTML' }
  );
};
//b sp rub 100
module.exports = async function bCommand(bot, msg, args) {
  if (args['=ERRORS'].length) return;
  if (msg.chat.type === 'private') return;
  const group = await findGroup(bot, msg.chat.id, msg.chat.title);
  console.log(group);
  if (!group) return;
  if (args.length === 0) return await showBalance(bot, msg.chat.id);
  if (args.length >= 2)
    return args[0].toUpperCase() === 'DEL'
      ? await delBalance(bot, msg, args)
      : await setBalance(bot, msg, args);
  return await bot.sendMessage(
    msg.chat.id,
    `Произошла ошибка! Проверьте правильность ввода комманды/валюты.`,
    { parse_mode: 'HTML' }
  );
};
