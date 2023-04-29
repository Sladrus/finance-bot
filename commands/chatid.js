module.exports = async function chatidCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;

  await bot.sendMessage(msg.chat.id, `Chat ID: ${msg.chat.id}`, {
    parse_mode: 'HTML',
  });
};
