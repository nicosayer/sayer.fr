import {
  Button,
  Card,
  FileButton,
  Group,
  Indicator,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { IconPlus } from "@tabler/icons";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { SouvenirPictureMime } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { useBoard } from "../Provider";
import NewSouvenirModal from "./NewSouvenirModal";

const Souvenirs: FC = () => {
  const { board, loadingSouvenirs, souvenirs } = useBoard();
  const [date, setDate] = useState(dayjs().toDate());
  const [files, setFiles] = useState<File[]>();

  if (!souvenirs || loadingSouvenirs) {
    return <LoadingOverlay visible />;
  }

  return (
    <>
      {board ? (
        <NewSouvenirModal
          board={board}
          files={files}
          onClose={() => {
            setFiles(undefined);
          }}
          defaultDate={date}
        />
      ) : null}
      <Stack>
        <Group position="apart" className="sticky z-50">
          <Text fw={500}>Souvenirs</Text>
          <FileButton
            multiple
            onChange={(files) => {
              setFiles(files.slice(0, 6));
            }}
            accept={[SouvenirPictureMime.Jpeg, SouvenirPictureMime.Png].join(
              ","
            )}
          >
            {(props) => (
              <Button
                variant="default"
                leftIcon={<IconPlus size={18} />}
                {...props}
              >
                Nouveau souvenir
              </Button>
            )}
          </FileButton>
        </Group>
        <Card className="m-auto w-min">
          <Calendar
            value={date}
            onChange={(date) => {
              if (date) {
                setDate(date);
              }
            }}
            renderDay={(date) => {
              const day = date.getDate();
              const disabled = !souvenirs.some((souvenir) => {
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
      </Stack>
    </>
  );
};

export default Souvenirs;
