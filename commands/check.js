const { checkReqs } = require('../http/api-bpersons');
const { sleep } = require('../utils');

function identifyRequisites(text) {
  const requisitesPatterns = {
    iban: /\b[A-Z]{2}\s?[0-9]{2}(?:\s?[A-Z0-9]){11,30}\b/g,
    account_number: /\b(\d{20})/g,
    card: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    eth: /\b0x+[A-F,a-f,0-9]{40}/g,
    btc: /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}/g,
    dash: /\bX[1-9A-HJ-NP-Za-km-z]{33}/g,
    monero: /\b4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}/g,
    ada: /\baddr1[a-z0-9]/g,
    cosmos: /\bcosmos[a-zA-Z0-9_.-]{10,}/g,
    miota: /\biota[a-z0-9]{10,}/g,
    lsk: /\b[0-9]{19}L/g,
    ltc: /\b[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}/g,
    xem: /\b[N][A-Za-z0-9-]{37,52}/g,
    neo: /\bN[0-9a-zA-Z]{33}/g,
    ont: /\bA[0-9a-zA-Z]{33}/g,
    dot: /\b1[0-9a-zA-Z]{47}/g,
    xrp: /\b1[0-9a-zA-Z]{47}/g,
    xlm: /\bG[0-9A-Z]{40,60}/g,
    tron: /\bT[a-zA-Z0-9]{33}\b/g,
    swift: /\b[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/g,
    sol: /\b[1-9A-HJ-NP-Za-km-z]{32,44}/g,
    zec_z: /\bz[a-zA-Z0-9]{92}/g,
    zec_t: /\bt[13][a-zA-Z0-9]{32}/g,
    email: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    // phone: /\b\+?[1-9]{1}[0-9]{3,14}/g,
    btccash: /\b(q[0-9a-z]{41})\b/g,
  };

  let foundRequisites = [];

  for (const [key, regex] of Object.entries(requisitesPatterns)) {
    const foundTexts = text.matchAll(regex);
    for (const foundText of foundTexts) {
      const newText = foundText[0];
      const isDuplicate = foundRequisites.some((req) => req.text === newText);
      if (!isDuplicate) {
        foundRequisites.push({
          key,
          text: newText,
          toString: function () {
            return `${this.key} — ${this.text}`;
          },
        });
      }
    }
  }
  //2200150935694825
  return foundRequisites;
}

module.exports = async function checkRequisites(bot, msg, args) {
  if (!msg?.reply_to_message) return;

  const replyMessage = msg.reply_to_message;
  if (msg.chat.type === 'private') return;

  try {
    const requisites = identifyRequisites(replyMessage.text);

    if (requisites.length > 0) {
      // const message = `Найдены следующие типы реквизитов:\n\n${requisites.join(
      //   '\n'
      // )}`;
      // await bot.sendMessage(msg.chat.id, message);

      for (const req of requisites) {
        const persons = await checkReqs({ value: req.text });
        if (persons?.length > 0) {
          const message = `❌ <b>Реквизиты не прошли проверку</b>\n\n`;
          const personInfo = persons
            .map(
              (person) =>
                `<i>👤 Имя:</i> ${person?.fullname}\n<i>💳 ${person?.type}:</i> ${person?.value}\n<i>ℹ️ Причина:</i> ${person?.reason}`
            )
            .join('\n\n');

          await bot.sendMessage(msg.chat.id, message + personInfo, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          });
        } else {
          await bot.sendMessage(
            msg.chat.id,
            `✅ <b>Реквизиты проверены</b>\n\n<i>${req.key.toUpperCase()}</i>: ${
              req.text
            }`,
            {
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            }
          );
        }

        await sleep(1500);
      }
    } else {
      await bot.sendMessage(msg.chat.id, '🔎 Реквизиты не найдены');
    }
  } catch (e) {
    console.log(e);
  }
};
