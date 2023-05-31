const { getAdmins } = require('../http/api-admins');
const { findChat, createChat } = require('../http/api-chat');
const { updateGroup, findGroup } = require('../http/api-group');
const { formatDate } = require('../utils');

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

module.exports = async function sleepCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  const me = await bot.getMe();
  const chatAdmins = await bot.getChatAdministrators(msg.chat.id);
  const isBotAdmin = checkObjectPresenceAdmin([me], chatAdmins);
  if (!isBotAdmin)
    return await bot.sendMessage(
      msg.chat.id,
      `Ошибка. Бот не является администратором чата.`
    );
  const admins = await getAdmins();
  const isValidAdmins = checkObjectPresence([msg.from], admins);
  if (!isValidAdmins)
    return await bot.sendMessage(
      msg.chat.id,
      `Вы не можете использовать эту комманду.`
    );
  let chat = await findChat(bot, msg.chat.id);
  if (!chat) {
    const chat_url = await bot.exportChatInviteLink(msg.chat.id);

    chat = await createChat(bot, {
      chat_id: msg.chat.id,
      chat_url: chat_url,
      issued_by: 'chat',
      date_of_issue: formatDate(new Date()),
      active: 1,
    });
    console.log(chat);
    // return await bot.sendMessage(
    //   msg.chat.id,
    //   'Данный чат отсутсвует в базе созданных чатов.'
    // );
  }
  const group = await findGroup(bot, msg.chat.id);
  if (group.active)
    return await bot.sendMessage(
      msg.chat.id,
      `Невозможно использовать эту комманду в чате с активированной кассой.`,
      {
        parse_mode: 'HTML',
      }
    );
  if (group.group_status === 'WAIT') return;
  await updateGroup(bot, msg.chat.id, { group_status: 'WAIT' });
  for (const admin of admins) {
    try {
      await bot.banChatMember(msg.chat.id, admin.tlg_user_id);
      console.log(`Пользователь ${admin.name} удален из чата.`);
      await bot.unbanChatMember(msg.chat.id, admin.tlg_user_id);
    } catch (e) {
      console.log(
        e?.response?.body?.error_code,
        e?.response?.body?.description,
        admin.name
      );
    }
  }
  await bot.sendMessage(
    msg.chat.id,
    `Здравствуйте.\nВ любой момент, когда потребуется перевод, просто нажмите на кнопку «Позвать менеджера» или напишите в ЛС @factorov и мы сразу вернёмся, ответим на все вопросы и поможем с переводом 🤝🏻\n\n🦾 А сейчас мы переведем чат в спящий режим, менеджеры выйдут, а бот останется дежурить за главного.\n\nНеобходимость переводить чаты в «спящий режим» вызвана ограничениями Telegram на 1000 групп для пользователя.\n\nЖдем ваших заявок!\n→ moneyport.ru\n→ @moneyport`,
    { parse_mode: 'HTML' }
  );
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Позвать менеджера',
            callback_data: 'wakeup',
          },
        ],
      ],
    },
  };
  await bot.sendMessage(
    msg.chat.id,
    `Чат в спящем режиме.\n\nНажмите на кнопку ниже, чтобы позвать менеджера`,
    options
  );
};
