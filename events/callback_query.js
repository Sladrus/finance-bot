const { getAdmins } = require('../http/api-admins');
const { findChat } = require('../http/api-chat');
const { findGroup, updateGroup } = require('../http/api-group');

function checkObjectPresence(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    for (let j = 0; j < arr2.length; j++) {
      const obj2 = arr2[j];
      if (obj1.id === Number(obj2.tlg_user_id)) {
        return true;
      }
    }
  }
  return false;
}

function checkObjectPresenceAdmin(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    for (let j = 0; j < arr2.length; j++) {
      const obj2 = arr2[j];
      if (obj1.id === Number(obj2.user.id)) {
        return true;
      }
    }
  }
  return false;
}

module.exports = async function callbackQueryEvent(bot, query) {
  console.log(query);
  const me = await bot.getMe();
  const msg = query.message;
  const chatId = msg.chat.id;
  const title = msg.chat.title;
  const callbackData = query.data;
  const group = await findGroup(bot, chatId, title);
  // обрабатываем нажатие на кнопку callback_query
  if (callbackData === 'wakeup') {
    if (group.group_status === 'WAIT') {
      try {
        const chatAdmins = await bot.getChatAdministrators(msg.chat.id);
        const isBotAdmin = checkObjectPresenceAdmin([me], chatAdmins);
        if (!isBotAdmin)
          return await bot.sendMessage(
            msg.chat.id,
            `Ошибка. Бот не является администратором чата.`
          );
        const admins = await getAdmins();
        const isValidAdmins = checkObjectPresence([msg.from], admins);
        if (isValidAdmins) return;
        const chat = await findChat(bot, msg.chat.id);
        await bot.sendMessage(
          -1001935148888,
          `Чат вышел из режима ожидания!\n\n${msg.chat.title}\nChat ID: ${msg.chat.id}\nСсылка на чат: ${chat.chat_url}`
        );
        await updateGroup(bot, msg.chat.id, {
          group_status: 'WORK',
        });
        await bot.deleteMessage(msg.chat.id, msg.message_id);
        await bot.sendMessage(
          msg.chat.id,
          `Принял. Зову менеджера, скоро подключится.`
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
  if (callbackData === 'menu') {
    await bot.sendMessage(
      msg.chat.id,
      `<b>Рассказываем о главном:</b>\n\n/trust — Какие гарантии?\n/timetaken — Какие сроки платежа?\n/fees — Какой курс и комиссии?\n/example — Какие возможности платежей у вас есть?\n/howcreatetask — Как сформулировать задачу?\n/tech — Как работает ЛК и бот?\n\nПросто кликайте на команду, чтобы получить ответы на часто задаваемые вопросы.`,
      { parse_mode: 'HTML' }
    );
  }
  // отправляем ответ на callback_query
  await bot.answerCallbackQuery(query.id);
};
