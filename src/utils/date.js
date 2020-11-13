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

export const getDate = (value) => {
  if (isDate(value)) {
    return {
      day: value.getDate(),
      month: value.getMonth() + 1,
      year: value.getFullYear(),
    };
  }

  if (value.length === 8) {
    return {
      day: value.substring(0, 2),
      month: value.substring(2, 4),
      year: value.substring(4, 8),
    };
  }

  const [day, month, year] = value.split("/");

  return { day, month, year };
};

export const getTime = (value) => {
  if (isDate(value)) {
    return { hours: value.getHours(), minutes: value.getMinutes() };
  }

  if (value.length === 4) {
    return { hours: value.substring(0, 2), minutes: value.substring(2, 4) };
  }

  const [hours, minutes] = value.split(":");

  return { hours, minutes };
};

export const getDateTime = (value) => {
  const { day, month, year } = getDate(value);
  const { hours, minutes } = getTime(value);

  return { day, month, year, hours, minutes };
};

export const formatDate = (date) => {
  if (!isDate(date)) {
    return null;
  }

  const { day, month, year } = getDate(date);

  return `${twoDigits(day)}/${twoDigits(month)}/${year}`;
};

export const formatTime = (date) => {
  if (!isDate(date)) {
    return null;
  }

  const { hours, minutes } = getTime(date);

  return `${twoDigits(hours)}:${twoDigits(minutes)}`;
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

  const { day, month, year } = getDate(string);

  const date = new Date(year, Number(month) - 1, day);

  if (!isDate(date)) {
    return null;
  }

  return date;
};

export const parseTime = (string) => {
  if (isDate(string)) {
    return string;
  }

  const { hours, minutes } = getTime(string);

  const date = new Date(0, 0, 0, hours, minutes);

  if (!isDate(date)) {
    return null;
  }

  return date;
};

export const parseDateTime = (string) => {
  if (isDate(string)) {
    return string;
  }

  const { hours, minutes, day, month, year } = getDateTime(string);

  const date = new Date(year, month, day, hours, minutes);

  if (!isDate(date)) {
    return null;
  }

  return date;
};
