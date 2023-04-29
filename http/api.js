require('dotenv').config();
const axios = require('axios');

const token = process.env.API_TOKEN;

const baseApi = axios.create({
  baseURL: process.env.API_URL,
  headers: { 'x-api-key': `${token}` },
});

const officeApi = axios.create({
  baseURL: 'http://pay.moneyport.world/office',
  headers: { 'x-api-key': `${token}` },
});

module.exports = {
  baseApi,
  officeApi,
};
