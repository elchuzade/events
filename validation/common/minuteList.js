const minuteList = [...Array(12).keys()].map(num =>
  String(num * 5).padStart(2, '0')
);

module.exports = minuteList;
