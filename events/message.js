const { updateGroup } = require("../http/api-group");

module.exports = async function messageEvent(bot, msg) {
  console.log(msg);
  if (msg.chat.type === 'group') {
    const newChatId = msg?.migrate_to_chat_id;
    if (newChatId === undefined) return;
    await updateGroup(bot, msg.chat.id, { chat_id: newChatId });
    await bot.sendMessage(newChatId, `Новый чат айди: ${newChatId}`);
  }
};
