const { createActivity } = require('../http/api-activity');
const {
  findOrCreateGroup,
  updateGroup,
  findGroup,
} = require('../http/api-group');
const { formatDate } = require('../utils');

module.exports = async function leftChatMemberEvent(bot, msg) {
  const me = await bot.getMe();
  const memberCount = await bot.getChatMemberCount(msg.chat.id);
  console.log('left', memberCount);
  const first = msg.left_chat_member?.first_name || '';
  const last = msg.left_chat_member?.last_name || '';
  const name = first + ' ' + last;
  const activity = await createActivity(bot, msg.chat.id, {
    chat_id: msg.chat.id,
    username: msg.left_chat_member?.username,
    first_name: name,
    event: 'LEFT',
    created_at: formatDate(new Date()),
  });
  console.log(activity);
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
