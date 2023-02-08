import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Card,
  CopyButton,
  Image,
  Text,
  Tooltip,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconCheck, IconEdit, IconLink, IconTrash } from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import { FC } from "react";
import { SouvenirDocument } from "types/firebase/collections";

export interface SouvenirCardProps {
  souvenir: SouvenirDocument & { downloadUrls: string[] };
}

const openDeleteModal = (souvenir: SouvenirDocument) => {
  openConfirmModal({
    title: "Supprimer la carte de crédit",
    centered: true,
    zIndex: 1000,
    children: (
      <Text size="sm">
        Voulez-vous vraiment supprimer la carte de crédit ? Cette action est
        définitive et irréversible.
      </Text>
    ),
    labels: { confirm: "Supprimer", cancel: "Annuler" },
    confirmProps: { color: "red" },
    onConfirm: () => {
      if (souvenir.ref) {
        deleteDoc(souvenir.ref);
      }
    },
  });
};

const SouvenirCard: FC<SouvenirCardProps> = ({ souvenir }) => {
  return (
    <Card withBorder>
      <Card.Section className="relative">
        {souvenir.downloadUrls.length > 1 ? (
          <Carousel withIndicators loop>
            {souvenir.downloadUrls.map((downloadUrl, index) => (
              <Carousel.Slide key={index}>
                <Image src={downloadUrl} height={200} />
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <Image src={souvenir.downloadUrls[0]} height={200} />
        )}
      </Card.Section>
      <Card.Section p="sm" withBorder>
        <div className="text-center">{souvenir.description}</div>
      </Card.Section>
      <Card.Section p="sm">
        <div className="grid grid-cols-3">
          <div className="m-auto">
            <CopyButton value={`${window.location.host}/${souvenir.ref?.path}`}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Lien copié" : "Copier le lien"}
                  withArrow
                >
                  <ActionIcon
                    color={copied ? "teal" : "blue"}
                    className="m-auto"
                    onClick={copy}
                  >
                    {copied ? <IconCheck size={18} /> : <IconLink size={18} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </div>
          <div className="m-auto">
            <Tooltip label="Modifier" withArrow>
              <ActionIcon color="blue" className="m-auto">
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          </div>
          <div className="m-auto">
            <Tooltip label="Supprimer" withArrow>
              <ActionIcon
                color="red"
                className="m-auto"
                onClick={() => {
                  openDeleteModal(souvenir);
                }}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </div>
        </div>
      </Card.Section>
    </Card>
  );
};

export default SouvenirCard;
