const { botApi, mainApi } = require("./api");

async function createCabinet(bot, chat_id) {
  try {
    const response = await mainApi.post(`/cabinet/bindingChat`, {
      chatId: chat_id,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
}

async function getOrder(bot, chat_id) {
  try {
    const response = await botApi.get(`/get_order?chat_id=${chat_id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}

module.exports = { createCabinet, getOrder };
