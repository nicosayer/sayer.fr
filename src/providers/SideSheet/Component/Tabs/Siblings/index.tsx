import {
  Avatar,
  Button,
  Table,
  Pane,
  Card,
  Autocomplete,
  TextInput,
  Select,
  IconButton,
  TrashIcon,
} from "evergreen-ui";
import firebase from "firebase/app";
import React, { ChangeEvent, useEffect, useState } from "react";

import { Box } from "components/Box";
import { DocumentData } from "config/firebase";
import { RelativeType } from "config/relative";
import { useOneTimeRelatives } from "providers/OneTimeRelatives";
import { useSideSheet } from "providers/SideSheet";
import { isSet } from "utils/general";
import { relativeData, relativeDoc } from "utils/relative";

const TableRow = ({
  sibling,
  relative,
}: {
  relative: DocumentData;
  sibling: { type: RelativeType; relative: DocumentData };
}) => {
  const { openSideSheet } = useSideSheet();
  const [data, setData] = useState<DocumentData>();

  useEffect(() => {
    relativeData(sibling.relative.id).then(setData);
  }, []);

  return (
    <Table.Row
      key={sibling.relative.id}
      isSelectable
      onSelect={() => {
        openSideSheet(sibling.relative.id);
      }}
    >
      <Table.Cell>
        {data && (
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              name={`${data.firstName} ${data.lastName}`}
              marginRight={8}
            />
            {data.firstName} {data.lastName}
          </Box>
        )}
      </Table.Cell>
      <Table.Cell textTransform="capitalize">
        {RelativeType[sibling.type]}
      </Table.Cell>
      <Table.Cell
        textTransform="capitalize"
        flexBasis={60}
        flexShrink={0}
        flexGrow={0}
      >
        <IconButton
          icon={TrashIcon}
          intent="danger"
          // @ts-ignore
          onClick={(event: MouseEvent) => {
            event.stopPropagation();
            const currentRelativeDoc = relativeDoc(relative.id);

            sibling.relative.update({
              siblings: firebase.firestore.FieldValue.arrayRemove({
                type: sibling.type,
                relative: currentRelativeDoc,
              }),
            });

            currentRelativeDoc.update({
              siblings: firebase.firestore.FieldValue.arrayRemove({
                type: sibling.type,
                relative: sibling.relative,
              }),
            });
          }}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export const Siblings = ({ relative }: { relative: DocumentData }) => {
  const data = relative.data();

  const { searchableRelatives } = useOneTimeRelatives();
  const [newSiblingId, setNewSiblingId] = useState<string>();
  const [newSiblingType, setNewSiblingType] = useState<
    RelativeType | undefined
  >(RelativeType.blood);

  return (
    <Pane background="tint1" padding={16}>
      <Card backgroundColor="white" elevation={0}>
        <Autocomplete
          items={Object.keys(searchableRelatives).filter(
            (searchableRelativeId) => searchableRelativeId !== relative.id
          )}
          onChange={setNewSiblingId}
          itemToString={(searchableRelativeId) => {
            return searchableRelatives[searchableRelativeId] ?? "";
          }}
        >
          {(props) => {
            // @ts-ignore
            const { getInputProps, getRef, clearSelection } = props;

            return (
              <Pane key={relative.id} display="flex" padding={16}>
                <TextInput
                  ref={getRef}
                  placeholder="Add new sibling"
                  {...getInputProps()}
                />
                <Select
                  value={newSiblingType}
                  onChange={(event: ChangeEvent) => {
                    // @ts-ignore
                    setNewSiblingType(event.target.value);
                  }}
                  marginLeft={16}
                  marginRight={16}
                >
                  <option value={RelativeType.blood}>Blood</option>
                  <option value={RelativeType.half}>Half</option>
                </Select>
                <Button
                  appearance="primary"
                  onClick={() => {
                    if (isSet(newSiblingType) && newSiblingId) {
                      const newSiblingDoc = relativeDoc(newSiblingId);
                      const currentRelativeDoc = relativeDoc(relative.id);

                      newSiblingDoc.update({
                        siblings: firebase.firestore.FieldValue.arrayUnion({
                          type: newSiblingType,
                          relative: currentRelativeDoc,
                        }),
                      });

                      currentRelativeDoc.update({
                        siblings: firebase.firestore.FieldValue.arrayUnion({
                          type: newSiblingType,
                          relative: newSiblingDoc,
                        }),
                      });

                      clearSelection();
                    }
                  }}
                >
                  Save
                </Button>
              </Pane>
            );
          }}
        </Autocomplete>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
            <Table.TextHeaderCell>Type</Table.TextHeaderCell>
            <Table.TextHeaderCell flexBasis={60} flexShrink={0} flexGrow={0} />
          </Table.Head>
          <Table.VirtualBody height={240}>
            {(data.siblings ?? []).map(
              (sibling: { type: RelativeType; relative: DocumentData }) => {
                return (
                  <TableRow
                    key={sibling.relative.id}
                    sibling={sibling}
                    relative={relative}
                  />
                );
              }
            )}
          </Table.VirtualBody>
        </Table>
      </Card>
    </Pane>
  );
};
