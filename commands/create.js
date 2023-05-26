const { getAdmins } = require('../http/api-admins');
const { createChat, findChat } = require('../http/api-chat');
const { updateGroup } = require('../http/api-group');

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

module.exports = async function createCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  const chat = await findChat(bot, msg.chat.id);
  if (chat) return await bot.sendMessage(msg.chat.id, `Чат уже есть в базе.`);
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
  const chat_url = await bot.exportChatInviteLink(msg.chat.id);
  const newChat = await createChat(bot, {
    chat_id: msg.chat.id,
    chat_url: chat_url,
    active: 0,
  });
  console.log(newChat);
  const res = await updateGroup(bot, msg.chat.id, {
    title: `[${newChat.id}] Персональный чат-касса MoneyPort`,
  });
  try {
    await bot.setChatTitle(
      msg.chat.id,
      `[${newChat.id}] Персональный чат-касса MoneyPort`
    );
    await bot.setChatDescription(
      msg.chat.id,
      `Для вас создан персональный чат с менеджерами. Для расчета курса по вашему переводу, вступайте в чат и опишите вашу задачу.`
    );
  } catch (e) {
    console.log(e?.response?.body?.error_code, e?.response?.body?.description);
  }
  await bot.sendMessage(
    msg.chat.id,
    `Чат добавлен а базу созданных чатов.\n\nID: ${newChat.chat_id}\nСсылка на чат: ${newChat.chat_url}`
  );
};
