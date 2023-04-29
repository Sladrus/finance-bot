const { getAdmins } = require('../http/api-admins');
const { findOrCreateGroup, updateGroup } = require('../http/api-group');

function checkObjectPresence(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    for (let j = 0; j < arr2.length; j++) {
      const obj2 = arr2[j];
      if (obj1.user.id === obj2.tlg_user_id) {
        return true;
      }
    }
  }
  return false;
}

function checkObjectPresenceMembers(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    for (let j = 0; j < arr2.length; j++) {
      const obj2 = arr2[j];
      if (obj1?.id === obj2?.tlg_user_id) {
        return true;
      }
    }
  }
  return false;
}

module.exports = async function leftChatMemberEvent(bot, msg) {
  const me = await bot.getMe();
  if (me.id === msg.left_chat_member.id) {
    const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
    const res = await updateGroup(bot, msg.chat.id, { status: 0 });
    return;
  }
  const admins = await getAdmins();
  const isAdmin = checkObjectPresenceMembers([msg.left_chat_member], admins);
  const chatAdmins = await bot.getChatAdministrators(msg.chat.id);
  const isValidAdmins = checkObjectPresence(chatAdmins, admins);
  if (!isValidAdmins && isAdmin) {
    await bot.sendMessage(msg.chat.id, `Группа в режиме ожидания. Напишите любое сообщение, чтобы вновь активировать группу.`);
    return await updateGroup(bot, msg.chat.id, { status: 0, active: 0 });
  }
};
