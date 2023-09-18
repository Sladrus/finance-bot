const { getAdmins } = require('../http/api-admins');
const { findOrCreateGroup, activeGroup } = require('../http/api-group');
const {
  InlineKeyboardMarkup,
  InlineKeyboardButton,
} = require('node-telegram-bot-api');

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

module.exports = async function activeCommand(bot, msg, args) {
  if (args['=ERRORS'].length) return;
  if (msg.chat.type === 'private') return;
  const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
  if (!group) return;
  if (group.active === 1) {
    return await bot.sendMessage(
      msg.chat.id,
      'Учет кассы в этом чате уже активирован'
    );
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
  // const { result } = await activeGroup(bot, msg.chat.id);
  // if (!result)
  //   return await bot.sendMessage(msg.chat.id, 'Код активации неверный');
  // return await bot.sendMessage(msg.chat.id, 'Учет кассы активирован');
};
