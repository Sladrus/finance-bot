module.exports = async function trustCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;

  await bot.sendMessage(
    msg.chat.id,
    `<b>Итак, про гарантии</b>\n\nМы даем гарантию, что ваши деньги будут доставлены до получателя. И эту гарантию, в первую очередь, обеспечиваем репутацией — moneyport.ru/trust, она безупречная.\n\nНо также в момент регистрации вы акцептируете <b><u>публичную оферту</u></b> и согласно <b><u>пункта 1.1</u></b> мы обязуемся <i>«принять от Пользователя денежные средства, обеспечить передачу или перечисление указанному Пользователем лицу (или самому Пользователю) эквивалента суммы этих денежных средств в указанных Пользователем на Сайте стране и валюте…»</i>`,
    { parse_mode: 'HTML' }
  );
};
