const { getAdmins } = require('../http/api-admins');
const { getEmptyChat } = require('../http/api-chat');
const { findGroup, findOrCreateGroup } = require('../http/api-group');

function checkObjectPresence(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    for (let j = 0; j < arr2.length; j++) {
      const obj2 = arr2[j];
      if (obj1.id === Number(obj2.tlg_user_id)) {
        return true;
      }
    }
  }
  return false;
}

module.exports = async function cityCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
  if (!group) return;
  if (group.active === 0) {
    return await bot.sendMessage(
      msg.chat.id,
      'Учет кассы в этом чате не активирован.'
    );
  }
  if (group?.city) {
    return await bot.sendMessage(msg.chat.id, `Город: ${group.city}`);
  }
  const admins = await getAdmins();
  console.log(admins);
  const isValidAdmins = checkObjectPresence([msg.from], admins);
  console.log(isValidAdmins);
  if (!isValidAdmins)
    return await bot.sendMessage(
      msg.chat.id,
      'Вы не можете использовать эту команду.'
    );

  await bot.sendMessage(msg.chat.id, 'Пожалуйста, укажите город', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Москва', callback_data: 'city_moscow' }],
        [{ text: 'Санкт-Петербург', callback_data: 'city_spb' }],
        [{ text: 'Владивосток', callback_data: 'city_vladivostok' }],
        [{ text: 'Другой', callback_data: 'city_other' }],
      ],
    },
  });
};
