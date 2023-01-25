import { Card, Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import { FC } from "react";
import { formatDate } from "utils/dayjs";
import { useBoard } from "../../Provider";

export const TRANSITION_DURATION = 200;

export interface CalendarCardProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CalendarCard: FC<CalendarCardProps> = ({ date, setDate }) => {
  const { souvenirs } = useBoard();
  return (
    <Card className="m-auto w-min" withBorder>
      <Calendar
        value={date}
        onChange={(date) => {
          if (date) {
            setDate(date);
          }
        }}
        maxDate={dayjs().toDate()}
        renderDay={(date) => {
          const day = date.getDate();
          const disabled = !souvenirs?.some((souvenir) => {
            return (
              formatDate(date, "YYYY-MM-DD") ===
              formatDate(souvenir.date, "YYYY-MM-DD")
            );
          });

          return (
            <Indicator size={6} color="red" offset={8} disabled={disabled}>
              <div>{day}</div>
            </Indicator>
          );
        }}
      />
    </Card>
  );
};

export default CalendarCard;
