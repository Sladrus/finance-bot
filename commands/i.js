module.exports = async function getChatIdSleepGroup(bot, msg, args) {
  console.log(args[0]);

  if (msg.chat.type === 'private') return;
  if (msg.chat.id !== -1001935148888) return;
  try {
    const link = await bot.exportChatInviteLink(-1001902015957);
    await bot.sendMessage(-1001935148888, link);
    console.log(link);
  } catch (e) {
    console.log(e);
  }
};
