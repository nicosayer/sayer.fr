import dayjs from "dayjs";
import "dayjs/locale/fr";

export const formatDate = (
  date?: string | number | Date | dayjs.Dayjs | null | undefined
) => {
  return dayjs(date).locale("fr").format("DD MMM YYYY");
};
