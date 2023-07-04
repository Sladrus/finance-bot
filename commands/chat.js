const { getEmptyChat } = require('../http/api-chat');
const { findGroup } = require('../http/api-group');

module.exports = async function getChatCommand(bot, msg, args) {
  //МОЖЕТ ВЫЗЫВАТЬСЯ ТОЛЬКО В ОПРЕДЕЛЕННОЙ ГРУППЕ
  if (msg.chat.type === 'private') return;
  if (msg.chat.id != -800378415) return;
  const group = await findGroup(bot, msg.chat.id);
  if (!group) return;
  const chat = await getEmptyChat(bot, msg.chat.id, msg.from?.username);
  console.log(chat);
  if (!chat) {
    await bot.sendMessage(msg.chat.id, `Свободные чаты закончились.`, {
      parse_mode: 'HTML',
    });
  } else {
    await bot.sendMessage(
      msg.chat.id,
      `Your client ID: <b>${chat.id}</b>\n👉 Working chat: <b>${chat.chat_url}</b>`,
      { parse_mode: 'HTML', disable_web_page_preview: true }
    );
  }
};
