const { evaluate } = require('mathjs');

module.exports = async function inlineQueryEvent(bot, msg) {
  try {
    const query = msg.query;
    let answer;
    if (query) {
      const result = evaluate(query); // this will evaluate the expression entered by user
      answer = {
        id: msg.id,
        type: 'article',
        title: `Результат: ${result}`,
        input_message_content: {
          message_text: `${query} = ${result}`,
        },
        description: `${query} = ${result}`,
      };
    } else {
      answer = {
        id: msg.id,
        type: 'article',
        title: `Введите корректное выражение`,
        input_message_content: {
          message_text: `Введите корректное выражение`,
        },
      };
    }
    bot.answerInlineQuery(msg.id, [answer]);
  } catch (e) {
    bot.answerInlineQuery(msg.id, [
      {
        id: msg.id,
        type: 'article',
        title: `Введите корректное выражение`,
        input_message_content: {
          message_text: `Введите корректное выражение`,
        },
      },
    ]);
  }
};
