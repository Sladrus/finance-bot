const { officeApi } = require('./api');

async function createCabinet(bot, chat_id, group_id) {
  try {
    const response = await officeApi.get(
      `/register?chat_id=${chat_id}&group_id=${group_id}&api_key=JHdjkwhuj2hUKJ@H3uh2uoihfduiah!`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    if (error?.response?.status === 403) {
      await bot.sendMessage(
        chat_id,
        'Учет кассы в этом чате не активирован. Используйте /active «ключ»'
      );
    }
    if (error?.response?.status === 401) {
      await bot.sendMessage(chat_id, `Неправильный API токен.`, {
        parse_mode: 'HTML',
      });
    }
  }
}

module.exports = { createCabinet };
