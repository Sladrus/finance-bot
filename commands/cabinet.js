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
  console.log(message);
  const result = await createCabinet(bot, msg.chat.id, group.id);
  console.log(result);
  if (!result?.result)
    return await bot.editMessageText(`Ошибка, попробуйте позже.`, {
      chat_id: msg.chat.id,
      message_id: message.message_id,
      parse_mode: 'HTML',
    });
  if (result?.status === 'created')
    return await bot.editMessageText(
      `<b>Личный кабинет создан:\n\n</b>Активировать: https://moneyport.ru/a/${result?.token}`,
      {
        chat_id: msg.chat.id,
        message_id: message.message_id,
        parse_mode: 'HTML',
      }
    );

  if (result?.status === 'activated')
    return await bot.editMessageText(
      `Личный кабинет создан и активирован\nEmail для входа: ${result?.email}`,
      {
        chat_id: msg.chat.id,
        message_id: message.message_id,
        parse_mode: 'HTML',
      }
    );
};
