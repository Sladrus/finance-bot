const { createCabinet } = require("../http/api-cabinet");
const { findGroup } = require("../http/api-group");

module.exports = async function cabinetCommand(bot, msg, args) {
  if (msg.chat.type === "private") return;
  const group = await findGroup(bot, msg.chat.id);
  if (!group) return;
  // if (!group.active)
  //   return await bot.sendMessage(
  //     msg.chat.id,
  //     'Учет кассы в этом чате не активирован. Используйте /active'
  //   );
  const message = await bot.sendMessage(
    msg.chat.id,
    "⌛️ Создание/проверка личного кабинета..."
  );
  const data = await createCabinet(bot, msg.chat.id);
  console.log(data);
  if (!data?.token)
    return await bot.editMessageText(
      `Чат уже привязан к личному кабинету на почту - ${data?.email}\n\nДля авторизации перейдите по ссылке - https://app.moneyport.ru\n\n<i>Если забыли пароль, воспользуйтесь кнопкой "Забыли пароль?" под формой</i>`,
      {
        chat_id: msg.chat.id,
        message_id: message.message_id,
        parse_mode: "HTML",
      }
    );
  await bot.editMessageText(
    `Ваша ссылка для привязки чат-кассы: https://app.moneyport.ru/link/${data?.token}`,
    {
      chat_id: msg.chat.id,
      message_id: message.message_id,
      parse_mode: "HTML",
    }
  );
};
