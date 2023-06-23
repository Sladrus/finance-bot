module.exports = async function getChatIdSleepGroup(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  try {
    const link = await bot.exportChatInviteLink(-1001923459397);
    await bot.sendMessage(-1001923459397, link);
    console.log(link);
  } catch (e) {
    console.log(e);
  }
};
