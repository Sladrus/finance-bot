const { getAdmins } = require('../http/api-admins');

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

const textList = [
  'Скажите, а будет у вас возможность оставить отзыв? Если да, то можно в свободной форме\n\nСсылка на страницу компании:\n\n<a href="https://2gis.ru/moscow/firm/70000001075777302/tab/reviews">2GIS</a>\n\nБудем благодарны:)',
  'Скажите, а будет у вас возможность оставить отзыв? Если да, то можно в свободной форме\n\nСсылка на страницу компании:\n\n<a href="https://yandex.com/maps/org/moneyport/209315553724/?ll=41.636267%2C41.651102&z=13">Яндекс карты</a>\n\nБудем благодарны:)',
  'Скажите, а будет у вас возможность оставить отзыв? Если да, то можно в свободной форме\n\nСсылка на страницу компании:\n\n<a href="https://maps.app.goo.gl/PwELSiNhrr1ZJhA69?g_st=ic">Google карты</a>\n\nБудем благодарны:)',
  'Скажите, а будет у вас возможность оставить отзыв? Если да, то можно в свободной форме в этом чате\n\nСсылка на страницу компании:\n\n@goswift\n\nБудем благодарны:)',
];

function* getNextElement(list) {
  let index = 0;
  const length = list.length;

  while (true) {
    yield list[index];

    index = (index + 1) % length;
  }
}

const getNext = getNextElement(textList);

module.exports = async function reviewCommand(bot, msg, args) {
  if (msg.chat.type === 'private') return;
  try {
    const admins = await getAdmins();
    const isValidAdmins = checkObjectPresence([msg.from], admins);
    if (!isValidAdmins)
      return await bot.sendMessage(
        msg.chat.id,
        'Вы не можете использовать эту команду.'
      );
    const text = getNext.next().value;
    await bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  } catch (e) {
    console.log(e);
  }
};
