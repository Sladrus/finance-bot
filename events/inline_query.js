const { evaluate } = require('mathjs');

module.exports = async function inlineQueryEvent(bot, msg) {
  console.log(msg);
  try {
    const query = msg.query;
    let answer;
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
    if (query) {
      const result = evaluate(query); // this will evaluate the expression entered by user
      answer = {
        id: msg.id,
        type: 'article',
        title: `Результат: ${formatter.format(result).replaceAll(',', "'")}`,
        input_message_content: {
          message_text: `${query} = ${formatter
            .format(result)
            .replaceAll(',', "'")}`,
        },
        description: `${query} = ${formatter
          .format(result)
          .replaceAll(',', "'")}`,
      };
      const InlineQueryResultsButton = {
        text: 'Обменник',
        web_app: { url: 'https://sladrus.github.io/finance-webapp/' },
      };

      // answerInlineQuery(inline_query_id, results, { button: JSON.parse(InlineQueryResultsButton) })
      return bot.answerInlineQuery(msg.id, [answer], {
        button: JSON.stringify(InlineQueryResultsButton),
      });
    }
    bot.answerInlineQuery(msg.id, []);

    // } else {
    //   answer = {
    //     id: msg.id,
    //     type: 'article',
    //     title: `Введите корректное выражение`,
    //     input_message_content: {
    //       message_text: `Введите корректное выражение`,
    //     },
    //   };
    // }
  } catch (e) {
    console.log(e);
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
