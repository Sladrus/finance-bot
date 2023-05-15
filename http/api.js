require('dotenv').config();
const axios = require('axios');

const token = process.env.API_TOKEN;
const mainApiToken = '994f4ca3371792beeb727761c6b831dfc410f6a4';

const baseApi = axios.create({
  baseURL: process.env.API_URL,
  headers: { 'x-api-key': `${token}` },
});

const officeApi = axios.create({
  baseURL: 'http://pay.moneyport.world/office',
  headers: { 'x-api-key': `${token}` },
});

const mainApi = axios.create({
  baseURL: 'http://api.moneyport.world',
  headers: { 'X-Api-Key': `${mainApiToken}` },
});

module.exports = {
  baseApi,
  officeApi,
  mainApi,
};
