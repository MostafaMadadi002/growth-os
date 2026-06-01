import persianDate from 'persian-date';

export const getJalaliDate = (date: Date = new Date()) => {
  return new persianDate(date).format('YYYY/MM/DD');
};

export const getJalaliMonthName = (date: Date = new Date()) => {
  return new persianDate(date).format('MMMM');
};
