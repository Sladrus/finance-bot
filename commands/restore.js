const { getAdmins } = require('../http/api-admins');
const { restoreChat, restoreLkChat } = require('../http/api-chat');
const { restoreGroup, findGroup } = require('../http/api-group');

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

module.exports = async function restoreCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  const message = await bot.sendMessage(
    msg.chat.id,
    `⌛️ Подождите. Возврат чата в исходное состояние...`,
    {
      parse_mode: 'HTML',
    }
  );
  const group = await findGroup(bot, msg.chat.id);
  if (!group)
    return await bot.editMessageText('Произошла непредвиденная ошибка', {
      chat_id: msg.chat.id,
      message_id: message.message_id,
      parse_mode: 'HTML',
    });
  if (group.active)
    return await bot.editMessageText('Ошибка. В чате активирована касса.', {
      chat_id: msg.chat.id,
      message_id: message.message_id,
      parse_mode: 'HTML',
    });
  const me = await bot.getMe();
  console.log(me);
  const chatAdmins = await bot.getChatAdministrators(msg.chat.id);
  console.log(chatAdmins);
  const isBotAdmin = checkObjectPresenceAdmin([me], chatAdmins);
  console.log(isBotAdmin);
  if (!isBotAdmin)
    return await bot.editMessageText(
      `Ошибка. Бот не является администратором чата.`,
      {
        chat_id: msg.chat.id,
        message_id: message.message_id,
        parse_mode: 'HTML',
      }
    );
  const admins = await getAdmins();
  const isValidAdmins = checkObjectPresence([msg.from], admins);
  if (!isValidAdmins)
    return await bot.editMessageText(
      'Ошибка. Вы не можете использовать эту команду.',
      {
        chat_id: msg.chat.id,
        message_id: message.message_id,
        parse_mode: 'HTML',
      }
    );
  const data = await restoreLkChat(bot, msg.chat.id);
  if (!data)
    return await bot.editMessageText('Произошла непредвиденная ошибка', {
      chat_id: msg.chat.id,
      message_id: message.message_id,
      parse_mode: 'HTML',
    });
  console.log(data);
  const link = await bot.exportChatInviteLink(msg.chat.id);
  console.log(link);

  const chat = await restoreChat(bot, msg.chat.id, link.replace('+', '%2B'));
  if (!chat) return await bot.deleteMessage(msg.chat.id, message.message_id);
  const newGroup = await restoreGroup(bot, msg.chat.id);
  if (!newGroup)
    return await bot.editMessageText(
      'Ошибка. Произошла ошибка пересоздания чата.',
      {
        chat_id: msg.chat.id,
        message_id: message.message_id,
        parse_mode: 'HTML',
      }
    );
  console.log(newGroup);

  //отвязать от лк тут
  try {
    await bot.setChatTitle(
      msg.chat.id,
      `[${chat.id}] Персональный чат-касса MoneyPort`
    );
    await bot.setChatDescription(
      msg.chat.id,
      `Для вас создан персональный чат с командой @moneyport: для организации перевода переходите в чат.`
    );
  } catch (e) {
    console.log(e?.response?.body?.error_code, e?.response?.body?.description);
  }

  await bot.editMessageText(
    `Чат обновлен в исходное состояние.\n\nСсылка на чат: ${link}`,
    {
      chat_id: msg.chat.id,
      message_id: message.message_id,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }
  );
};
