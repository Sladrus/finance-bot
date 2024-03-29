module.exports = async function feesCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;

  await bot.sendMessage(
    msg.chat.id,
    `<b>Про комиссии</b>\n\nЕсли коротко, то за наличные рубли в Москве мы берем до 5.5% к бирже за платеж в USD или EUR. В эту стоимость уже включены все расходы на прием, конвертацию и отправку.\n\nНо чтобы назвать конкретную комиссию, мы должны точно знать ответы на 4 базовых вопроса: откуда, куда, сколько и какая регулярность?\n\nДа, от направления платежа, суммы и регулярности цены меняются. Длительные отношения — дешевле.\n\n/howcreatetask — Как сформулировать задачу, чтобы узнать конкретную комиссию?`,
    { parse_mode: 'HTML' }
  );
};
