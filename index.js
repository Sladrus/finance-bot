const TelegramBotApp = require('./telegramBot');
var cron = require('node-cron');
const {
  findWhereTaken,
  restoreLkChat,
  restoreChat,
} = require('./http/api-chat');
const { findGroup, restoreGroup } = require('./http/api-group');
const { getAdmins } = require('./http/api-admins');

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

const botApp = new TelegramBotApp();
botApp.start();

async function restore(bot, chat) {
  if (!chat?.issued_by) return;
  const group = await findGroup(bot, chat.chat_id);
  if (!group) return;
  if (group.group_status !== 'READY') return;
  const date = new Date(chat.date_of_issue);
  const aWeekAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
  if (date.valueOf() <= aWeekAgo) {
    console.log(`Прошло уже 7 дней с момента указанной даты: ${chat.chat_id}`);
  } else {
    console.log(
      `Еще не прошло 7 дней с момента указанной даты: ${chat.chat_id}`
    );
    return;
  }
  console.log(group);
  const message = await bot.sendMessage(
    chat.chat_id,
    `⌛️ Подождите. Возврат чата в исходное состояние...`,
    {
      parse_mode: 'HTML',
    }
  );
  if (!group)
    return await bot.editMessageText('Произошла непредвиденная ошибка', {
      chat_id: chat.chat_id,
      message_id: message.message_id,
      parse_mode: 'HTML',
    });
  if (group.active)
    return await bot.editMessageText('Ошибка. В чате активирована касса.', {
      chat_id: chat.chat_id,
      message_id: message.message_id,
      parse_mode: 'HTML',
    });
  const me = await bot.getMe();
  const chatAdmins = await bot.getChatAdministrators(chat.chat_id);
  const isBotAdmin = checkObjectPresenceAdmin([me], chatAdmins);
  if (!isBotAdmin)
    return await bot.editMessageText(
      `Ошибка. Бот не является администратором чата.`,
      {
        chat_id: chat.chat_id,
        message_id: message.message_id,
        parse_mode: 'HTML',
      }
    );
  const data = await restoreLkChat(bot, chat.chat_id);
  if (!data)
    return await bot.editMessageText('Произошла непредвиденная ошибка', {
      chat_id: chat.chat_id,
      message_id: message.message_id,
      parse_mode: 'HTML',
    });
  const link = await bot.exportChatInviteLink(chat.chat_id);
  const newChat = await restoreChat(
    bot,
    chat.chat_id,
    link.replace('+', '%2B')
  );
  if (!newChat)
    return await bot.deleteMessage(chat.chat_id, message.message_id);
  const newGroup = await restoreGroup(bot, newChat.chat_id);
  if (!newGroup)
    return await bot.editMessageText(
      'Ошибка. Произошла ошибка пересоздания чата.',
      {
        chat_id: newChat.chat_id,
        message_id: message.message_id,
        parse_mode: 'HTML',
      }
    );

  //отвязать от лк тут
  try {
    await bot.setChatTitle(
      newChat.chat_id,
      `[${newChat.id}] Персональный чат-касса MoneyPort`
    );
    await bot.setChatDescription(
      newChat.chat_id,
      `Для вас создан персональный чат с командой @moneyport: для организации перевода переходите в чат.`
    );
  } catch (e) {
    console.log(e?.response?.body?.error_code, e?.response?.body?.description);
  }

  await bot.editMessageText(
    `Чат обновлен в исходное состояние.\n\nСсылка на чат: ${link}`,
    {
      chat_id: newChat.chat_id,
      message_id: message.message_id,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }
  );
}

const job = cron.schedule('0 0 * * SUN', async function () {
  // Здесь должны быть расположены нужные вам действия
  const chats = await findWhereTaken(this.bot);
  for (const chat of chats) {
    try {
      await restore(botApp.bot, chat);
    } catch (e) {
      console.log(e);
      continue;
    }
  }
  console.log('Выполнена задача по расписанию');
});

job.start();

// const chatId = '-1001902334847';

// // Текст сообщения, которое вы хотите отправлять
// const messageText = 'Hello, world!';

// // Функция для отправки сообщения
// async function sendMessage() {
//   await botApp.bot.sendMessage(chatId, messageText);
// }
// setInterval(sendMessage, 1000);
