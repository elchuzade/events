const hourList = [...Array(24).keys()].map(num => String(num).padStart(2, '0'));

module.exports = hourList;
