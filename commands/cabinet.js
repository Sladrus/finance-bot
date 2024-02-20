const { createCabinet } = require('../http/api-cabinet');
const { findOrCreateGroup, findGroup } = require('../http/api-group');

module.exports = async function cabinetCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  const group = await findGroup(bot, msg.chat.id);
  if (!group) return;
  if (!group.active)
    return await bot.sendMessage(
      msg.chat.id,
      'Учет кассы в этом чате не активирован. Используйте /active'
    );
  const message = await bot.sendMessage(
    msg.chat.id,
    '⌛️ Создание/проверка личного кабинета...'
  );
  const data = await createCabinet(bot, msg.chat.id);
  console.log(data);
  if (!data)
    return await bot.editMessageText(`Чат уже привязан к личному кабинету`, {
      chat_id: msg.chat.id,
      message_id: message.message_id,
      parse_mode: 'HTML',
    });
  await bot.editMessageText(
    `Личный кабинет создан и активирован\n\nEmail для входа: ${data?.name}\nПароль: ${data?.password}`,
    {
      chat_id: msg.chat.id,
      message_id: message.message_id,
      parse_mode: 'HTML',
    }
  );
};
