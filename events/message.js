const { updateActivity } = require('../http/api-activity');
const { updateGroup, findOrCreateGroup } = require('../http/api-group');
const { createLogs } = require('../http/api-logs');

module.exports = async function messageEvent(bot, msg) {
  if (msg.chat.type === 'private') return;
  if (msg?.migrate_from_chat_id) return;
  if (msg?.group_chat_created) return;
  if (msg?.new_chat_member) return;

  // console.log(msg);
  console.log('Create Group from message');
  await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
  if (msg?.migrate_to_chat_id !== undefined) {
    await updateGroup(bot, msg.chat.id, { chat_id: msg?.migrate_to_chat_id });
    await updateActivity(bot, msg.chat.id, {
      chat_id: msg?.migrate_to_chat_id,
    });
    await bot.sendMessage(
      msg?.migrate_to_chat_id,
      'Новый чат айди: `' + msg?.migrate_to_chat_id + '`',
      {
        parse_mode: 'Markdown',
      }
    );
  }
  console.log(msg);

  const memberCount = await bot.getChatMemberCount(
    msg?.migrate_to_chat_id !== undefined
      ? msg?.migrate_to_chat_id
      : msg.chat.id
  );
  const res = await updateGroup(
    bot,
    msg?.migrate_to_chat_id !== undefined
      ? msg?.migrate_to_chat_id
      : msg.chat.id,
    {
      title: msg.chat.title,
      members_count: memberCount,
    }
  );
  if (msg?.text) {
    const log = await createLogs(bot, msg);
    // console.log(log);
  }
};
