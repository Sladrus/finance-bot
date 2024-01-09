const { addTgLogin } = require('../http/api');
const { createActivity } = require('../http/api-activity');
const { getAdmins } = require('../http/api-admins');
const { getOrder } = require('../http/api-cabinet');
const {
  findOrCreateGroup,
  updateGroup,
  findGroup,
} = require('../http/api-group');
const { formatDate } = require('../utils');
const moment = require('moment');

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

module.exports = async function newChatMemberEvent(bot, msg) {
  try {
    const me = await bot.getMe();
    const memberCount = await bot.getChatMemberCount(msg.chat.id);
    await updateGroup(bot, msg.chat.id, {
      members_count: memberCount,
    });
    if (me.id === msg.new_chat_member.id) {
      console.log('Create Group from invites');
      d;
      return await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
    }
    const admins = await getAdmins();
    const isAdmin = checkObjectPresence(msg.new_chat_members, admins);
    if (isAdmin) return;
    const group = await findGroup(bot, msg.chat.id);
    if (!group?.in_chat) {
      await updateGroup(bot, msg.chat.id, {
        group_status: 'WORK',
        status: 1,
        in_chat: formatDate(new Date()),
      });
    }
    // console.log(msg);
    const now = moment();
    const formattedDateTime = now.format('DD.MM HH:mm');
    const weekday = now.locale('ru').format('dddd');

    const isWeekday = now.isoWeekday() >= 1 && now.isoWeekday() <= 5;
    const isWorkingTime = now.isBetween(
      moment().set({ hour: 9, minute: 0 }),
      moment().set({ hour: 22, minute: 0 })
    );

    const options = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Открыть меню',
              callback_data: 'menu',
            },
          ],
        ],
      },
    };
    await bot.sendMessage(
      msg.chat.id,
      `<b>Отлично!</b>\n\nТеперь вы пользователь MoneyPort, а этот чат — основной инструмент для решения ваших финансовых задач.\n\nМенеджеры MoneyPort активно отвечают на сообщения в будние дни с 09:00 до 22:00, а в выходные и праздники по возможности.\n\nСейчас у нас: ${weekday}, ${formattedDateTime}, мы ${
        isWorkingTime ? 'работаем' : 'не работаем'
      }.\n\nУзнайте больше о MP и получите ответы на все популярные вопросы, переходите в /menu`,
      options
    );
    const order = await getOrder(bot, msg.chat.id);
    console.log('ORDER', order);
    const first = msg.new_chat_member?.first_name || '';
    const last = msg.new_chat_member?.last_name || '';
    const name = first + ' ' + last;
    const activity = await createActivity(bot, msg.chat.id, {
      chat_id: msg.chat.id,
      username: msg.new_chat_member?.username,
      user_id: msg.new_chat_member?.id,
      first_name: name,
      event: 'JOIN',
      created_at: formatDate(new Date()),
    });
    if (msg.new_chat_member?.username) {
      const resp = await addTgLogin(
        bot,
        msg.chat.id,
        msg.new_chat_member?.username
      );
    }
    if (!order || !order['how_to_send']) return;
    let how_to_send;
    if (order['how_to_send'] == 'physical') {
      how_to_send = 'Перевод физ. лицу';
    }
    if (order['how_to_send'] == 'company') {
      how_to_send = 'Перевод юр. лицу';
    }
    if (order['how_to_send'] == 'cash') {
      how_to_send = 'Выдача наличных';
    }
    if (order['how_to_send'] == 'from_abroad') {
      how_to_send = 'Прием из-за рубежа';
    }
    if (order['how_to_send'] == 'exchange') {
      how_to_send = 'Обмен криптовалют';
    }
    return await bot.sendMessage(
      msg.chat.id,
      `На сайте вы указали информацию:\n1. Хотите совершить перевод: ${how_to_send}\n2. Валюта получения: ${order['symbol']}\n3. Сумма к получению: ${order['summ']}\n\nЧерез пару минут подключится менеджер и задаст уточняющие вопросы`
    );
  } catch (e) {
    console.log(e?.response?.body);
  }
};
