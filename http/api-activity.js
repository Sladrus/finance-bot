const { baseApi } = require('./api');

async function createActivity(bot, chat_id, body) {
  try {
    const response = await baseApi.post(`/activity/create/${chat_id}`, body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function updateActivity(bot, chat_id, body) {
  try {
    const response = await baseApi.post(`/activity/update/${chat_id}`, body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { createActivity, updateActivity };
