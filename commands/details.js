module.exports = async function detailsCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;

  await bot.sendMessage(
    msg.chat.id,
    `Статья с детальным описанием возможностей MoneyPort доступна по этой ссылке https://mediacompany.notion.site/MoneyPort-0288dc46fce449f68204d8a3cdb42320#0bc7505cd24545009ab511fb5d98b76f`,
    {
      parse_mode: 'HTML',
    }
  );
};
