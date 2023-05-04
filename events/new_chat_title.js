const { updateGroup } = require('../http/api-group');

module.exports = async function newTitleEvent(bot, msg) {
  //   console.log(msg);
  if (msg?.new_chat_title) {
    const res = await updateGroup(bot, msg.chat.id, {
      title: msg.new_chat_title,
    });
  }
};
