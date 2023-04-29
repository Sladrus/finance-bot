const { updateGroup, findOrCreateGroup } = require('../http/api-group');

module.exports = async function messageEvent(bot, msg) {
  console.log(msg);
  if (msg.chat.type === 'group') {
    const newChatId = msg?.migrate_to_chat_id;
    if (newChatId === undefined) return;
    await updateGroup(bot, msg.chat.id, { chat_id: newChatId });
    return await bot.sendMessage(newChatId, `Новый чат айди: ${newChatId}`);
  }
  if (msg?.new_chat_member || msg?.left_chat_member) {
    try {
      return await bot.deleteMessage(msg.chat.id, msg.message_id);
    } catch (e) {
      console.log(e);
    }
  }
  const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
  if (!group.status) {
    const res = await updateGroup(bot, msg.chat.id, { status: 1 });
    await bot.sendMessage(msg.chat.id, `Группа вновь активна.`);
  }
};
