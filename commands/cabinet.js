const { createCabinet } = require('../http/api-cabinet');
const { findOrCreateGroup } = require('../http/api-group');

module.exports = async function cabinetCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
  if (!group) return;
  if (!group.active)
    return await bot.sendMessage(
      msg.chat.id,
      'Учет кассы в этом чате не активирован. Используйте /active «ключ»'
    );

  const result = await createCabinet(bot, msg.chat.id, group.id);
  console.log(result);
  if (!result?.result)
    return await bot.sendMessage(msg.chat.id, `Ошибка, попробуйте позже`, {
      parse_mode: 'HTML',
    });
  if (result?.status === 'created')
    return await bot.sendMessage(
      msg.chat.id,
      `<b>Личный кабинет создан:\n\n</b>Активировать: https://pay.moneyport.world/a/${result?.token}`,
      {
        parse_mode: 'HTML',
      }
    );
  if (result?.status === 'activated')
    return await bot.sendMessage(
      msg.chat.id,
      `Личный создан и активирован\nEmail для входа: ${result?.email}`,
      {
        parse_mode: 'HTML',
      }
    );
};
