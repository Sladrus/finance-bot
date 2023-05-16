const {
  findOrCreateGroup,
  updateGroup,
  findGroup,
} = require('../http/api-group');

module.exports = async function leftChatMemberEvent(bot, msg) {
  const me = await bot.getMe();
  const memberCount = await bot.getChatMemberCount(msg.chat.id);
  console.log('left', memberCount);
  if (me.id === msg.left_chat_member.id) {
    const group = await findGroup(bot, msg.chat.id, msg.chat.title);
    const res = await updateGroup(bot, msg.chat.id, {
      status: 0,
      members_count: memberCount,
    });
    return;
  } else {
    const res = await updateGroup(bot, msg.chat.id, {
      members_count: memberCount,
    });
  }
  // const admins = await getAdmins();
  // const isAdmin = checkObjectPresenceMembers([msg.left_chat_member], admins);
  // const chatAdmins = await bot.getChatAdministrators(msg.chat.id);
  // const isValidAdmins = checkObjectPresence(chatAdmins, admins);
  // if (!isValidAdmins && isAdmin) {
  //   await bot.sendMessage(msg.chat.id, `Группа в режиме ожидания. Напишите любое сообщение, чтобы вновь активировать группу.`);
  //   return await updateGroup(bot, msg.chat.id, { status: 0, active: 0 });
  // }
};
