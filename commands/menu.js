module.exports = async function menuCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;

  await bot.sendMessage(
    msg.chat.id,
    `<b>Рассказываем о главном:</b>\n\n/trust — Какие гарантии?\n/timetaken — Какие сроки платежа?\n/fees — Какой курс и комиссии?\n/example — Какие возможности платежей у вас есть?\n/howcreatetask — Как сформулировать задачу?\n/tech — Как работает ЛК и бот?\n\nПросто кликайте на команду, чтобы получить ответы на часто задаваемые вопросы.`,
    { parse_mode: 'HTML' }
  );
};
