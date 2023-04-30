const { getEmptyChat } = require('../http/api-chat');
const { findOrCreateGroup } = require('../http/api-group');

module.exports = async function getChatCommand(bot, msg, args) {
  //МОЖЕТ ВЫЗЫВАТЬСЯ ТОЛЬКО В ОПРЕДЕЛЕННОЙ ГРУППЕ
  if (msg.chat.type === 'private') return;
  if (msg.chat.id != -800378415) return;
  const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
  if (!group) return;
  const chat = await getEmptyChat(bot, msg.chat.id);
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

// const { bot } = require('../index');

// const Command = require('telegram-command-handler');

// const chat = new Command(bot, 'chat');

// chat.on('receive', async function (msg, args) {
//   const clientId = 'ID';
//   const chatLink = 'ChatLink';
//   const group = await GroupService.findOne(msg.chat.id);
//   if (group.active === 0) {
//     return await bot.sendMessage(
//       msg.chat.id,
//       'Учет кассы в этом чате не активирован. Используйте /active'
//     );
//   }
//   const chat = await chatService.getEmptyChat(group.id);
//   if (!chat) {
//     await bot.sendMessage(msg.chat.id, `Свободные чаты закончились.`, {
//       parse_mode: 'HTML',
//     });
//   } else {
//     await bot.sendMessage(
//       msg.chat.id,
//       `You client ID: <b>${chat.id}</b>\n👉 Working chat: <b>${chat.chat_url}</b>`,
//       { parse_mode: 'HTML' }
//     );
//   }
// });
