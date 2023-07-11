module.exports = async function getChatIdSleepGroup(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  try {
    const link = await bot.exportChatInviteLink(-1001897613970);
    await bot.sendMessage(-1001658175217, link);
    console.log(link);
  } catch (e) {
    console.log(e);
  }
};
