module.exports = async function primerCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;

  await bot.sendMessage(
    msg.chat.id,
    `<b>Где почитать о нас в СМИ?</b>\n\nМы даем комментарии к статьям по финансовой тематике в Forbes:\n→ https://www.forbes.ru/investicii/482864-sredstvo-peredvizenia-deneg-kak-izmenilas-rol-kriptovalut-dla-rossian-v-2022-godu\n→ https://www.forbes.ru/investicii/484349-treugol-niki-v-siti-kak-rossiane-teraut-svoi-den-gi-v-kriptoobmennikah\n\nА также различные издания ссылаются на наши чаты:\n→ https://www.forbes.ru/finansy/471865-razyskivautsa-den-gi-kak-rossiane-isut-poterannye-swift-perevody\n→ https://fintolk.pro/poteryali-dengi-pri-swift-perevode-tri-realnyh-kejsa-i-chetkij-algoritm-vozvrata-deneg/\n→ https://www.vbr.ru/banki/novosti/2022/07/29/swift-vozvrat/\n→ https://vc.ru/finance/615102-kak-rossiyane-poteryali-na-swift-perevodah-bolshe-7-mln-i-chto-delat-so-swift-perevodami-v-2023`,
    {
      parse_mode: 'HTML',
    }
  );
};
