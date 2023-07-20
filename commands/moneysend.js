const { getAdmins } = require('../http/api-admins');
const { findChat } = require('../http/api-chat');
const { findGroup } = require('../http/api-group');
const { createMoneysend } = require('../http/api-task');

function checkObjectPresenceAdmin(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    for (let j = 0; j < arr2.length; j++) {
      const obj2 = arr2[j];
      if (obj1.id === Number(obj2.user.id)) {
        return true;
      }
    }
  }
  return false;
}

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

module.exports = async function moneysendTask(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  try {
    const chatId = msg.chat.id;
    const me = await bot.getMe();
    const chatAdmins = await bot.getChatAdministrators(msg.chat.id);
    const isBotAdmin = checkObjectPresenceAdmin([me], chatAdmins);
    if (!isBotAdmin)
      return await bot.sendMessage(
        msg.chat.id,
        `Ошибка. Бот не является администратором чата.`
      );
    const admins = await getAdmins();
    const isValidAdmins = checkObjectPresence([msg.from], admins);
    if (isValidAdmins) {
      // Отправляем сообщение с запросом точной задачи на перевод
      await bot
        .sendMessage(
          chatId,
          'Пожалуйста, сформулируйте точную задачу на перевод. Укажите, что клиент отдает → получает, какой объем, когда требуется перевод и с какой регулярность?'
        )
        .then(() => {
          // Создаем слушатель для обычных текстовых сообщений
          const textListener = async (msg) => {
            console.log(msg);
            const isSameChat = msg.chat.id === chatId;
            if (!isSameChat) return;
            const admins = await getAdmins();
            const isValidAdmins = checkObjectPresence([msg.from], admins);
            if (isValidAdmins) {
              const group = await findGroup(bot, msg.chat.id);
              const response = await createMoneysend(bot, {
                chat_id: msg.chat.id,
                task: msg.text,
                manager_id: msg.from.id,
                create_date: Date.now(),
              });
              const chat = await findChat(bot, msg.chat.id);
              await bot.sendMessage(
                chatId,
                `Отлично! Задача зарегестрированна под номером <b>${response.id}</b>, уже зову специалиста отдела процессинга. Пожалуйста, ожидайте.`,
                {
                  parse_mode: 'HTML',
                }
              );
              await bot.sendMessage(
                -1001815632960,
                `${group.title} от ${msg.from?.username}\n\n→ ${chat?.chat_url}\n\nЗадача:\n\`${msg.text}\`\n\n———\nChat ID: ${msg.chat.id}\nДата: ${response.create_date}`,
                {
                  parse_mode: 'HTML',
                }
              );
              bot.removeListener('text', textListener);
            } else {
              await bot.sendMessage(
                chatId,
                'Извините, задачи принимаем только от аккаунтов менеджеров.'
              );
            }
          };

          bot.on('text', textListener);
        });
    } else {
      // Если сообщение отправлено от неразрешенного пользователя, отправляем предупреждение
      await bot.sendMessage(
        chatId,
        'Извините, задачи принимаем только от аккаунтов менеджеров.'
      );
    }
  } catch (e) {
    console.log(e);
  }
};
