require('dotenv').config();
const axios = require('axios');

const path = require('path');
const csvWriter = require('csv-writer');
const fs = require('fs');
// const FormData = require('form-data');
const token = process.env.API_TOKEN;
const mainApiToken = process.env.OFFICE_TOKEN;
const ymApiToken = process.env.YM_API_TOKEN;

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
  baseURL: 'http://api.moneyport.world/bot',
  headers: { 'X-Api-Key': `${mainApiToken}` },
});

const mainApi = axios.create({
  baseURL: 'http://api.moneyport.world',
  headers: { 'X-Api-Key': `${mainApiToken}` },
});

const ymApi = axios.create({
  baseURL: 'https://api-metrika.yandex.net',
  headers: {
    Authorization: `OAuth ${ymApiToken}`,
  },
});

function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1; // Месяцы начинаются с 0
  let year = date.getFullYear();

  // Добавляем ведущий ноль, если число меньше 10
  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  return `${day}.${month}.${year}`;
}

async function createBlobFromFile(path) {
  const file = await fs.promises.readFile(path);
  return new Blob([file]);
}

async function addTgLogin(bot, chat_id, tlg_login) {
  try {
    const response = await mainApi.post(
      `/AddTlgLogin?chat_id=${chat_id}&tlg_login=${tlg_login}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}

async function activeUserInYm(chat_id, client_id) {
  try {
    const filePath = path.resolve('./data.csv');

    const writer = csvWriter.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'create_date_time', title: 'create_date_time' },
        { id: 'client_ids', title: 'client_ids' },
      ],
    });
    writer.writeRecords([
      {
        id: chat_id,
        create_date_time: formatDate(new Date()),
        client_ids: client_id,
      },
    ]);

    const form = new FormData();
    form.append('file', await createBlobFromFile(filePath), 'data.csv');
    const response = await ymApi.post(
      `/cdp/api/v1/counter/92731458/data/simple_orders?merge_mode=UPDATE`,
      form
    );

    console.log(response);
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
  ymApi,
  activeUserInYm,
};
