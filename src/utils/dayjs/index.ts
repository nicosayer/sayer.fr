import dayjs from "dayjs";
import "dayjs/locale/fr";

export const formatDate = (
  date?: string | number | Date | dayjs.Dayjs | null | undefined,
  format = "YYYY-MM-DD"
) => {
  return dayjs(date).locale("fr").format(format);
};
