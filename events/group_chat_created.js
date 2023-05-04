const { updateGroup, findOrCreateGroup } = require('../http/api-group');

module.exports = async function chatCreatedEvent(bot, msg) {
  console.log('Chat created');
  return await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
};
