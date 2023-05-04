const { findOrCreateGroup } = require('../http/api-group');
const { createLogs } = require('../http/api-logs');

module.exports = async function logCommandsEvent(bot, msg, match) {
  if (msg.chat.type === 'private') return;

  // const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
  // if (!group) return;
  // const log = await createLogs(bot, msg);
  // console.log(log);
};
