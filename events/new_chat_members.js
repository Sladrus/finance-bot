const { getAdmins } = require('../http/api-admins');
const { getOrder } = require('../http/api-cabinet');
const { findOrCreateGroup, updateGroup } = require('../http/api-group');
const { formatDate } = require('../utils');

function checkObjectPresence(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    for (let j = 0; j < arr2.length; j++) {
      const obj2 = arr2[j];
      if (obj1.id === obj2.tlg_user_id) {
        return true;
      }
    }
  }
  return false;
}

module.exports = async function newChatMemberEvent(bot, msg) {
  console.log(msg);
  const me = await bot.getMe();
  const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);
  if (me.id === msg.new_chat_member.id)
    return await updateGroup(bot, msg.chat.id, { status: 1 });

  const admins = await getAdmins();
  const isAdmin = checkObjectPresence(msg.new_chat_members, admins);
  if (isAdmin) return;
  if (!group?.in_chat) {
    await updateGroup(bot, msg.chat.id, {
      status: 1,
      in_chat: formatDate(new Date()),
    });
  }

  await bot.sendMessage(
    msg.chat.id,
    `Добро пожаловать!\n\nВы зашли в личный кабинет, здесь мы ведем учет бухгалтерии, принимаем и обрабатываем заявки, считаем курс\n\nИспользуйте команду /help чтобы получить ответы на часто задаваемые вопросы\n\nДля расчета курса опишите пожалуйста вашу задачу: куда и откуда отправляем перевод, какая сумма? После этого @moneyport_admin сориентирует вас по условиям перевода.`
  );
  const order = await getOrder(bot, -100139981704);
  if (order?.error) return;
  let how_to_send;
  if (order['how_to_send'] == 'physical') {
    how_to_send = 'Перевод физическому лицу';
  }
  if (order['how_to_send'] == 'invoice') {
    how_to_send = 'Оплата инвойса юридическому лицу';
  }
  if (order['how_to_send'] == 'cash') {
    how_to_send = 'Выдача наличных';
  }
  return await bot.sendMessage(
    msg.chat.id,
    `На сайте вы указали информацию:\n1. Хотите совершить перевод: ${how_to_send}\n2. Валюта получения: ${order['symbol']}\n3. Сумма к получению: ${order['summ']}\n\nЧерез пару минут подключится менеджер и задаст уточняющие вопросы`
  );
};
