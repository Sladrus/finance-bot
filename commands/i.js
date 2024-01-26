module.exports = async function getChatIdSleepGroup(bot, msg, args) {
  // console.log(args[0]);
  if (msg.chat.type === 'private') return;
  if (msg.chat.id !== -1001658175217) return;
  try {
    const link = await bot.exportChatInviteLink(-944002384);
    await bot.sendMessage(-1001658175217, link);
    console.log(link);
  } catch (e) {
    console.log(e);
  }
};
