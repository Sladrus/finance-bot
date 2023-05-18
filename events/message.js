const { updateActivity } = require('../http/api-activity');
const { getAdmins } = require('../http/api-admins');
const {
  findWhereTaken,
  restoreChat,
  restoreLkChat,
} = require('../http/api-chat');
const {
  updateGroup,
  findOrCreateGroup,
  restoreGroup,
  findGroup,
} = require('../http/api-group');
const { createLogs } = require('../http/api-logs');

module.exports = async function messageEvent(bot, msg) {
  if (msg.chat.type === 'private') return;
  if (msg?.migrate_from_chat_id) return;
  if (msg?.group_chat_created) return;
  if (msg?.new_chat_member) return;
  if (msg?.left_chat_member) return;
  if (msg?.text) {
    const log = await createLogs(bot, msg);
    console.log(log);
  }
  if (msg?.text == '/sleep') return;
  // const chats = await findWhereTaken(bot);
  // for (const chat of chats) {
  //   try {
  //     if (chat?.chat_id == undefined) continue;
  //     const group = await findGroup(bot, chat?.chat_id);
  //     if (group?.group_status != 'READY') continue;
  //     const date = new Date(chat.date_of_issue); // здесь указываем нужную дату
  //     const aWeekAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000; // вычисляем дату 7 дней назад
  //     if (date.valueOf() <= aWeekAgo) {
  //       console.log('Прошло уже 7 дней с момента указанной даты');
  //     } else {
  //       console.log('Еще не прошло 7 дней с момента указанной даты');
  //       continue;
  //     }
  //     //restore chats
  //     //отвязать от лк
  //     const data = await restoreLkChat(bot, chat.chat_id);
  //     if (!data) {
  //       await bot.sendMessage(chat.chat_id, 'Произошла непредвиденная ошибка');
  //       continue;
  //     }
  //     console.log(data);
  //     const link = await bot.exportChatInviteLink(chat.chat_id);
  //     console.log(link);

  //     const newChat = await restoreChat(
  //       bot,
  //       chat.chat_id,
  //       link.replace('+', '%2B')
  //     );
  //     if (!newChat) {
  //       await bot.sendMessage(
  //         newChat.chat_id,
  //         'Данный чат отсутсвует в базе созданных чатов.'
  //       );
  //       continue;
  //     }
  //     const newGroup = await restoreGroup(bot, newChat.chat_id);
  //     if (!newGroup) {
  //       await bot.sendMessage(
  //         newChat.chat_id,
  //         'Ошибка. Произошла ошибка пересоздания чата.'
  //       );
  //       continue;
  //     }
  //     console.log(newGroup);

  //     //отвязать от лк тут
  //     try {
  //       await bot.setChatTitle(
  //         newChat.chat_id,
  //         `[${newChat.id}] 🔵 Персональный чат-касса MoneyPort`
  //       );
  //       await bot.setChatDescription(
  //         newChat.chat_id,
  //         `Для вас создан персональный чат с менеджерами. Для расчета курса по вашему переводу, вступайте в чат и опишите вашу задачу.`
  //       );
  //     } catch (e) {
  //       console.log(
  //         e?.response?.body?.error_code,
  //         e?.response?.body?.description
  //       );
  //     }

  //     await bot.sendMessage(
  //       newChat.chat_id,
  //       `Чат обновлен в исходное состояние.\n\nСсылка на чат: ${link}`,
  //       {
  //         parse_mode: 'HTML',
  //         disable_web_page_preview: true,
  //       }
  //     );
  //   } catch (e) {
  //     console.log(
  //       e?.response?.body?.error_code,
  //       e?.response?.body?.description
  //     );
  //     continue;
  //   }
  // }
  console.log('Create Group from message');
  const group = await findOrCreateGroup(bot, msg.chat.id, msg.chat.title);

  if (msg?.migrate_to_chat_id !== undefined) {
    await updateGroup(bot, msg.chat.id, { chat_id: msg?.migrate_to_chat_id });
    await updateActivity(bot, msg.chat.id, {
      chat_id: msg?.migrate_to_chat_id,
    });
    await bot.sendMessage(
      msg?.migrate_to_chat_id,
      'Новый чат айди: `' + msg?.migrate_to_chat_id + '`',
      {
        parse_mode: 'Markdown',
      }
    );
  }
  try {
    const memberCount = await bot.getChatMemberCount(
      msg?.migrate_to_chat_id !== undefined
        ? msg?.migrate_to_chat_id
        : msg.chat.id
    );
    const res = await updateGroup(
      bot,
      msg?.migrate_to_chat_id !== undefined
        ? msg?.migrate_to_chat_id
        : msg.chat.id,
      {
        title: msg.chat.title,
        members_count: memberCount,
      }
    );
  } catch (e) {
    console.log(e?.response?.body);
  }
};
