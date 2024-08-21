module.exports = async function chatidCommand(bot, msg, args) {
  console.log(msg);
  if (msg.chat.type === "private") return;

  await bot.sendMessage(msg.chat.id, "Chat ID: `" + msg.chat.id + "`", {
    parse_mode: "Markdown",
    message_thread_id: msg?.message_thread_id,
  });
};
