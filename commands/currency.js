const { getEmojiByCurrencyCode } = require("country-currency-emoji-flags");
const {
  convertCurrencyEx,
  convertCurrencyMoex,
} = require("../http/api-convert");
const { findOrCreateGroup, findGroup } = require("../http/api-group");
const { randomIntFromInterval, splitOnHalf } = require("../utils");
const { evaluate } = require("mathjs");

function isCommand(exchange) {
  const commands = [
    "active",
    "chatid",
    "primer",
    "details",
    "detail",
    "cabinet",
    "cabine",
    "restore",
    "restor",
    "task",
    "sleep",
    "create",
    "createanna",
    "smi",
    "h",
    "chat",
    "b",
    "help",
    "moneys",
    "timetaken",
    "timeta",
    "howcreatetask",
    "howcre",
    "example",
    "exampl",
    "review",
  ];
  return commands.includes(exchange) ? exchange : null;
}

module.exports = async function currencyCommand(bot, msg, match) {
  let type;
  const exchange = match[0].split(" ")[0].replace("/", "");
  const amount = match[0].split(" ")[1];

  if (isCommand(exchange)) return;

  if (msg.chat.type !== "private") {
    const group = await findGroup(bot, msg.chat.id);
    if (!group) return;
  }

  const message = await bot.sendMessage(msg.chat.id, `💱 Получаем данные...`, {
    parse_mode: "HTML",
    message_thread_id: msg?.message_thread_id,
  });
  try {
    currency_codes = []; //EURRUB USDRUB
    console.log(currency_codes.includes(exchange));
    if (currency_codes.includes(exchange.toUpperCase())) {
      type = "moex";
    } else type = "ex";
    const currencies = splitOnHalf(exchange);
    if (
      currencies[0].toUpperCase() === "UAH" ||
      currencies[1].toUpperCase() === "UAH"
    ) {
      return await bot.editMessageText(
        `Мы не поддерживаем работу с данной валютой.`,
        {
          chat_id: msg.chat.id,
          message_id: message.message_id,
          parse_mode: "HTML",
        }
      );
    }
    const fakeAmount = randomIntFromInterval(1000, 100000);

    const data =
      type === "ex"
        ? await convertCurrencyEx(currencies, fakeAmount)
        : await convertCurrencyMoex(currencies, fakeAmount);

    if (!data)
      return await bot.editMessageText(
        `Произошла ошибка! Проверьте правильность ввода команды.`,
        {
          chat_id: msg.chat.id,
          message_id: message.message_id,
          parse_mode: "HTML",
        }
      );
    const course = Number(data.course.split(" ")[0]);
    const realAmount = amount
      ? (course / fakeAmount) * evaluate(amount)
      : course / fakeAmount;
    console.log(realAmount);
    const fullCourse = `${
      amount ? amount : 1
    } ${currencies[0].toUpperCase()} = ${realAmount.toFixed(
      4
    )} ${currencies[1].toUpperCase()}\n`;
    const minCourse = `${
      getEmojiByCurrencyCode(currencies[0].toUpperCase()) || ""
    } ${1} ${currencies[0].toUpperCase()} = ${
      getEmojiByCurrencyCode(currencies[1].toUpperCase()) || ""
    } ${(course / fakeAmount).toFixed(4)} ${currencies[1].toUpperCase()}`;

    const finalCourse = amount ? fullCourse + minCourse : minCourse;

    await bot.editMessageText(
      `${finalCourse}\n<pre>${"--------------------"}\nupdated ${
        data.updated
      }</pre>\n${
        type === "ex"
          ? `<a href="https://www.xe.com/currencyconverter/convert/?Amount=${
              amount ? evaluate(amount) : 1
            }&From=${currencies[0].toUpperCase()}&To=${currencies[1].toUpperCase()}">xe.com</a>`
          : `<a href="https://www.moex.com/">moex.com</a>`
      }`,
      {
        chat_id: msg.chat.id,
        message_id: message.message_id,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }
    );
  } catch (e) {
    return await bot.editMessageText(
      `Произошла ошибка! Проверьте правильность ввода команды.`,
      {
        chat_id: msg.chat.id,
        message_id: message.message_id,
        parse_mode: "HTML",
      }
    );
  }
};
