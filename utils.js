const getSymbolFromCurrency = require('currency-symbol-map');

function formatter(currency, money) {
  var symbol = getSymbolFromCurrency(currency);
  symbol = symbol ? ' ' + symbol : ' ' + currency;
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
  });
  return formatter.format(money).replaceAll(',', "'") + symbol;
}

const isNumeric = (n) => !!Number(n);

function hasNumber(myString) {
  return /\d/.test(myString);
}

function splitOnHalf(str) {
  let half = Math.floor(str.length / 2);
  str = str.slice(0, half) + ' ' + str.slice(half, str.length);
  return str.split(' ');
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

module.exports = {
  formatter,
  isNumeric,
  hasNumber,
  splitOnHalf,
  randomIntFromInterval,
  sleep,
  formatDate,
};
