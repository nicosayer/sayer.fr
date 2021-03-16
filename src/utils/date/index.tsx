import dayjs from "dayjs";

export const currentYear = () => {
  return new Date().getFullYear();
};

export const formatDate = ({
  year,
  month,
  day,
}: {
  year: number | null;
  month: number | null;
  day: number | null;
}) => {
  return year && month && day && dayjs(`${year}-${month}-${day}`).isValid()
    ? {
        day,
        month,
        year,
      }
    : null;
};
