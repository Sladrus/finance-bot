const { getEmojiByCurrencyCode } = require('country-currency-emoji-flags');
const { convertCurrency } = require('../http/api-convert');
const { findOrCreateGroup, findGroup } = require('../http/api-group');
const { randomIntFromInterval, splitOnHalf } = require('../utils');
const { evaluate } = require('mathjs');

function isCommand(exchange) {
  const commands = ['active', 'chatid', 'primer', 'create'];
  return commands.includes(exchange) ? exchange : null;
}

module.exports = async function currencyCommand(bot, msg, match) {
  const exchange = match[0].split(' ')[0].replace('/', '');
  const amount = match[0].split(' ')[1];

  if (isCommand(exchange)) return;
  if (msg.chat.type !== 'private') {
    const group = await findGroup(bot, msg.chat.id);
    if (!group) return;
  }

  const currencies = splitOnHalf(exchange);

  const fakeAmount = randomIntFromInterval(1000, 100000);
  const message = await bot.sendMessage(msg.chat.id, `💱 Получаем данные...`, {
    parse_mode: 'HTML',
  });
  console.log(message);
  const data = await convertCurrency(currencies, fakeAmount);
  if (!data)
    return await bot.editMessageText(
      `Произошла ошибка! Проверьте правильность ввода команды.`,
      {
        chat_id: msg.chat.id,
        message_id: message.message_id,
        parse_mode: 'HTML',
      }
    );
  const course = Number(data.course.split(' ')[0]);
  const realAmount = amount
    ? (course / fakeAmount) * evaluate(amount)
    : course / fakeAmount;

  const fullCourse = `${
    amount ? evaluate(amount) : 1
  } ${currencies[0].toUpperCase()} = ${realAmount.toFixed(
    4
  )} ${currencies[1].toUpperCase()}\n`;
  const minCourse = `${
    getEmojiByCurrencyCode(currencies[0].toUpperCase()) || ''
  } ${1} ${currencies[0].toUpperCase()} = ${
    getEmojiByCurrencyCode(currencies[1].toUpperCase()) || ''
  } ${(course / fakeAmount).toFixed(4)} ${currencies[1].toUpperCase()}`;

  const finalCourse = amount ? fullCourse + minCourse : minCourse;

  await bot.editMessageText(
    `${finalCourse}\n<pre>${'--------------------'}\nupdated ${
      data.updated
    }</pre>\n<a href="https://www.xe.com/currencyconverter/convert/?Amount=${
      amount ? evaluate(amount) : 1
    }&From=${currencies[0].toUpperCase()}&To=${currencies[1].toUpperCase()}">xe.com</a>`,
    {
      chat_id: msg.chat.id,
      message_id: message.message_id,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }
  );
};
