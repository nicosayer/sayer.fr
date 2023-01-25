import { Carousel } from "@mantine/carousel";
import {
  Button,
  Card,
  FileButton,
  Group,
  Image,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC, useEffect, useMemo, useState } from "react";
import {
  Collection,
  SouvenirDocument,
  SouvenirPictureDocument,
  SouvenirPictureMime,
} from "types/firebase/collections";
import { mapAsync } from "utils/async";
import { formatDate } from "utils/dayjs";
import { spreadQuerySnapshot, storage } from "utils/firebase";
import { cleanArray } from "utils/lib";
import { getExtension } from "utils/storage";
import { useBoard } from "../Provider";
import CalendarCard from "./CalendarCard";
import NewSouvenirModal from "./NewSouvenirModal";

export const TRANSITION_DURATION = 200;

const Souvenirs: FC = () => {
  const { board, loadingSouvenirs, souvenirs } = useBoard();
  const [loading, start, stop] = useBooleanState();
  const [souvenirsWithDownloadUrls, setSouvenirsWithDownloadUrls] = useState<
    (SouvenirDocument & { downloadUrls: string[] })[]
  >([]);
  const [date, setDate] = useState(new Date());
  const [files, setFiles] = useState<File[]>();

  const filteredSouvenirs = useMemo(() => {
    return (souvenirs ?? []).filter((souvenir) => {
      return souvenir.date === formatDate(date);
    });
  }, [date, souvenirs]);

  useEffect(() => {
    (async () => {
      start();

      const souvenirsWithDownloadUrls = await mapAsync(
        filteredSouvenirs,
        async (souvenir) => {
          if (souvenir.ref) {
            const souvenirPictures = (await getDocs(
              collection(souvenir.ref, Collection.souvenirPictures)
            ).then(spreadQuerySnapshot)) as SouvenirPictureDocument[];

            const downloadUrls = await mapAsync(
              souvenirPictures,
              (souvenirPicture) => {
                if (souvenirPicture.mime) {
                  const path = `${
                    souvenirPicture.ref?.path
                  }/document.${getExtension(souvenirPicture.mime)}`;

                  return getDownloadURL(ref(storage, path));
                }
              }
            );

            return { ...souvenir, downloadUrls: cleanArray(downloadUrls) };
          }
        }
      );

      setSouvenirsWithDownloadUrls(cleanArray(souvenirsWithDownloadUrls));

      stop();
    })();
  }, [date, filteredSouvenirs, start, stop]);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  }, []);

  if (!souvenirsWithDownloadUrls || loadingSouvenirs) {
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
          transitionDuration={TRANSITION_DURATION}
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
        <CalendarCard date={date} setDate={setDate} />
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 1200, cols: 2 },
            { maxWidth: 768, cols: 1 },
          ]}
        >
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
              <Card
                withBorder
                className="transition-shadow shadow-none cursor-pointer hover:shadow-lg"
                {...props}
              >
                <Card.Section>
                  <Image
                    withPlaceholder
                    height={200}
                    placeholder={
                      <Group spacing="xs">
                        <IconPlus />
                        Nouveau souvenir
                      </Group>
                    }
                  />
                </Card.Section>
                <Text mt="md" c="dimmed">
                  Ajouter un souvenir au {formatDate(date, "D MMMM")}
                </Text>
              </Card>
            )}
          </FileButton>
          {loading
            ? filteredSouvenirs.map((souvenir) => {
                return (
                  <Card withBorder>
                    <Card.Section>
                      <Image
                        withPlaceholder
                        height={200}
                        placeholder={<LoadingOverlay visible />}
                      />
                    </Card.Section>
                    <Text mt="md" c="dimmed">
                      {souvenir.description}
                    </Text>
                  </Card>
                );
              })
            : souvenirsWithDownloadUrls.map((souvenir) => {
                return (
                  <Card withBorder>
                    <Card.Section>
                      <Carousel withIndicators loop>
                        {souvenir.downloadUrls.map((downloadUrl, index) => (
                          <Carousel.Slide key={index}>
                            <Image src={downloadUrl} height={200} />
                          </Carousel.Slide>
                        ))}
                      </Carousel>
                    </Card.Section>
                    <Text mt="md" c="dimmed">
                      {souvenir.description}
                    </Text>
                  </Card>
                );
              })}
        </SimpleGrid>
      </Stack>
    </>
  );
};

export default Souvenirs;
