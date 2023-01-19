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
    if (number.indexOf('.') > -1) {
      let decimal = number.substring(number.indexOf('.') + 1);
      while (decimal.endsWith('0')) {
        decimal = decimal.substring(0, decimal.length - 1);
      }
      if (number.substring(0, number.indexOf('.')).length >= 7 && decimal.length > 2 && !isNaN(`0.${decimal}`)) {
        decimal = Number(`0.${decimal}`).toFixed(2).toString();
        if (decimal.indexOf('.') > -1) {
          decimal = decimal.substring(decimal.indexOf('.') + 1);
          while (decimal.endsWith('0')) {
            decimal = decimal.substring(0, decimal.length - 1);
          }
        }
      }
      return `${number.substring(0, number.indexOf('.'))}${decimal ? '.' : ''}${decimal}`;
    }
    return number;
  }
  return '';
}
const number_format = (number, format, is_exact) => {
  let string = remove_decimal(numeral(number).format(format.includes('.000') && Math.abs(Number(number)) >= 1.01 ? `${format.substring(0, format.indexOf('.') + (is_exact ? 7 : 3))}` : format === '0,0' && Number(number) < 1 ? '0,0.00' : format));
  if (string?.toLowerCase().endsWith('t') && string.split(',').length > 1) {
    string = numeral(number).format('0,0e+0');
  }
  return string;
}

const equals_ignore_case = (a, b) => (!a && !b) || a?.toLowerCase() === b?.toLowerCase();

const names = {
  btc: 'Bitcoin',
  eth: 'Ethereum',
};
const capitalize = s => type