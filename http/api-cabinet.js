const { officeApi } = require('./api');

async function createCabinet(bot, chat_id, group_id) {
  try {
    const response = await officeApi.get(
      `/register?chat_id=${chat_id}&group_id=${group_id}&api_key=JHdjkwhuj2hUKJ@H3uh2uoihfduiah!`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return { result: false };
  }
}

async function getOrder(bot, chat_id) {
  try {
    const response = await officeApi.get(
      `/order?chat_id=${chat_id}&api_key=JHdjkwhuj2hUKJ@H3uh2uoihfduiah!`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}

module.exports = { createCabinet, getOrder };
