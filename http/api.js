require('dotenv').config();
const axios = require('axios');

const token = process.env.API_TOKEN;
const mainApiToken = process.env.OFFICE_TOKEN;

// const mainApiToken = '994f4ca3371792beeb727761c6b831dfc410f6a4';

const baseApi = axios.create({
  baseURL: process.env.API_URL,
  headers: { 'x-api-key': `${token}` },
});

const officeApi = axios.create({
  baseURL: 'http://app.moneyport.ru/office',
  headers: { 'x-api-key': `${token}` },
});

const botApi = axios.create({
  baseURL: 'http://api.moneyport.ru/bot',
  headers: { 'X-Api-Key': `${mainApiToken}` },
});

const mainApi = axios.create({
  baseURL: 'http://api.moneyport.world',
  headers: { 'X-Api-Key': `${mainApiToken}` },
});

async function addTgLogin(bot, chat_id, tlg_login) {
  try {
    const response = await mainApi.get(
      `/AddTlgLogin?chat_id=${chat_id}&tlg_login=${tlg_login}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}

module.exports = {
  baseApi,
  botApi,
  officeApi,
  mainApi,
  addTgLogin,
};
