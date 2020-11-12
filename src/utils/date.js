export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;

export const isDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const twoDigits = (string) => {
  return `0${string}`.slice(-2);
};

export const formatISODate = (date) => {
  if (!isDate(date)) {
    return null;
  }

  return date.toISOString();
};

export const formatDate = (date) => {
  if (!isDate(date)) {
    return null;
  }

  return `${twoDigits(date.getDate())}/${twoDigits(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};

export const formatTime = (date) => {
  if (!isDate(date)) {
    return null;
  }

  return `${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;
};

export const formatDateTime = (date) => {
  if (!isDate(date)) {
    return null;
  }

  return `${formatDate(date)} ${formatTime(date)}`;
};

export const parseDate = (string) => {
  if (isDate(string)) {
    return string;
  }

  const [day, month, year] = string.split("/");

  const date = new Date(year, Number(month) - 1, day);

  if (!isDate(date)) {
    return null;
  }

  return date;
};

export const parseDateTime = (string) => {
  if (isDate(string)) {
    return string;
  }

  const [dateString, timeString] = string.split(" ");
  const [day, month, year] = dateString.split("/");
  const [hours, minutes] = timeString.split(":");

  const date = new Date(year, Number(month) - 1, day, hours, minutes);

  if (!isDate(date)) {
    return null;
  }

  return date;
};
