const { findOrCreateGroup, updateGroup } = require('../http/api-group');
const { v4: uuidv4 } = require('uuid');
const { formatDate } = require('../utils');

module.exports = async function hCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;

  const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
  if (!group) return;
  if (group.active === 0) {
    return await bot.sendMessage(
      msg.chat.id,
      'Учет кассы в этом чате не активирован. Используйте /active'
    );
  }
  const hash = uuidv4();
  const res = await updateGroup(bot, msg.chat.id, {
    history_hash: hash,
    history_update: formatDate(new Date()),
  });
  await bot.sendMessage(
    msg.chat.id,
    `📃 Operations history: https://office.moneyport.world/h/${hash}\n\n⚠️ Link available 30 minutes`,
    { parse_mode: 'HTML' }
  );
};
