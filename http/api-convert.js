const axios = require('axios');

async function convertCurrencyEx(currencies, amount) {
  const exchangeApi = axios.create({
    baseURL: 'http://new-converter.1210059-cn07082.tw1.ru',
  });

  const count = amount || 1;
  try {
    const response = await exchangeApi.get(
      `/convert?from=${currencies[0].toUpperCase()}&to=${currencies[1].toUpperCase()}&amount=${count}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
}

async function convertCurrencyMoex(currencies, amount) {
  const exchangeApi = axios.create({
    baseURL: 'http://new-converter.1210059-cn07082.tw1.ru',
  });

  const count = amount || 1;
  try {
    const response = await exchangeApi.get(
      `/convert_moex?from=${currencies[0].toUpperCase()}&to=${currencies[1].toUpperCase()}&amount=${count}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
}

module.exports = { convertCurrencyEx, convertCurrencyMoex };
