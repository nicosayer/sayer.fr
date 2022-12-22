import dayjs from "dayjs";
import "dayjs/locale/fr";

export const formatDate = (
  date?: string | number | Date | dayjs.Dayjs | null | undefined,
  format = "DD MMM YYYY"
) => {
  return dayjs(date).locale("fr").format(format);
};
