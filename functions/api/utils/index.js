// import numeral
const numeral = require('numeral');

const remove_decimal = number => {
  if (typeof number === 'number') {
    number = number.toString();
  }
  if (number.includes('NaN')) {
    return number.replace('NaN', '<0.00000001');
  }
  if (typeof number === 'string') {
    if 