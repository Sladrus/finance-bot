const { findOrCreateGroup } = require('../http/api-group');

module.exports = async function chatCreatedEvent(bot, msg) {
  console.log('Create Group from chat creation');
  return await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);

};
