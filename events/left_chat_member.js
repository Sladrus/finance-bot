const { createActivity } = require('../http/api-activity');
const { getAdmins } = require('../http/api-admins');
const {
  findOrCreateGroup,
  updateGroup,
  findGroup,
} = require('../http/api-group');
const { formatDate } = require('../utils');

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

module.exports = async function leftChatMemberEvent(bot, msg) {
  const me = await bot.getMe();
  try {
    const memberCount = await bot.getChatMemberCount(msg.chat.id);
    console.log('left', memberCount);
    if (memberCount === 1) {
      //ТУТ УДАЛИТЬ ССЫЛКУ НА ЧАТ ИЗ ЛК
      const data = await restoreLkChat(bot, msg.chat.id);
      console.log('У чате больше нет участников, удаляю группу');
      await updateGroup(bot, msg.chat.id, {
        group_status: 'CLOSED',
        members_count: 0,
      });
      return await bot.leaveChat(msg.chat.id);
    }
    const admins = await getAdmins();
    const isAdmin = checkObjectPresence([msg.left_chat_member], admins);
    if (isAdmin) return;
    const first = msg.left_chat_member?.first_name || '';
    const last = msg.left_chat_member?.last_name || '';
    const name = first + ' ' + last;
    const activity = await createActivity(bot, msg.chat.id, {
      chat_id: msg.chat.id,
      username: msg.left_chat_member?.username,
      user_id: msg.left_chat_member?.id,
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
  } catch (e) {
    console.log(e?.response?.body?.error_code, e?.response?.body?.description);
  }
};
