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
  PlusIcon,
} from "evergreen-ui";
import firebase from "firebase/app";
import React, { ChangeEvent, useEffect, useState } from "react";

import { Box } from "components/Box";
import { NewRelativeButton } from "components/NewRelativeButton";
import { DocumentData } from "config/firebase";
import { RelativeType } from "config/relative";
import { useOneTimeRelatives } from "providers/OneTimeRelatives";
import { useSideSheet } from "providers/SideSheet";
import { isSet } from "utils/general";
import { linkSpouses, relativeData, relativeDoc } from "utils/relative";

const TableRow = ({
  spouse,
  relative,
}: {
  relative: DocumentData;
  spouse: { type: RelativeType; relative: DocumentData };
}) => {
  const { openSideSheet } = useSideSheet();
  const [data, setData] = useState<DocumentData>();

  useEffect(() => {
    relativeData(spouse.relative.id).then(setData);
  }, []);

  return (
    <Table.Row
      key={spouse.relative.id}
      isSelectable
      onSelect={() => {
        openSideSheet(spouse.relative.id);
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
        {RelativeType[spouse.type]}
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

            spouse.relative.update({
              spouses: firebase.firestore.FieldValue.arrayRemove({
                type: spouse.type,
                relative: currentRelativeDoc,
              }),
            });

            currentRelativeDoc.update({
              spouses: firebase.firestore.FieldValue.arrayRemove({
                type: spouse.type,
                relative: spouse.relative,
              }),
            });
          }}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export const Spouses = ({ relative }: { relative: DocumentData }) => {
  const data = relative.data();

  const { searchableRelatives } = useOneTimeRelatives();
  const [newSpouseId, setNewSpouseId] = useState<string>();
  const [newSpouseType, setNewSpouseType] = useState<RelativeType | undefined>(
    RelativeType.married
  );

  return (
    <Pane background="tint1" padding={16}>
      <Card backgroundColor="white" elevation={0}>
        <Autocomplete
          items={Object.keys(searchableRelatives).filter(
            (searchableRelativeId) => searchableRelativeId !== relative.id
          )}
          onChange={setNewSpouseId}
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
                  placeholder="Search spouse"
                  {...getInputProps()}
                />
                <Select
                  value={newSpouseType}
                  onChange={(event: ChangeEvent) => {
                    // @ts-ignore
                    setNewSpouseType(event.target.value);
                  }}
                  marginLeft={16}
                  marginRight={16}
                >
                  <option value={RelativeType.married}>Married</option>
                  <option value={RelativeType.divorced}>Divorced</option>
                </Select>
                <Button
                  appearance="primary"
                  marginRight={16}
                  onClick={() => {
                    if (isSet(newSpouseType) && newSpouseId) {
                      linkSpouses({
                        spouse1: relativeDoc(relative.id),
                        spouse2: relativeDoc(newSpouseId),
                        type: newSpouseType,
                      });

                      clearSelection();
                    }
                  }}
                >
                  Add
                </Button>
                <NewRelativeButton
                  iconBefore={PlusIcon}
                  onCompleted={(spouse2: DocumentData) => {
                    linkSpouses({
                      spouse1: relativeDoc(relative.id),
                      spouse2,
                      type: newSpouseType ?? RelativeType.married,
                    });
                  }}
                >
                  New
                </NewRelativeButton>
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
            {(data.spouses ?? []).map(
              (spouse: { type: RelativeType; relative: DocumentData }) => {
                return (
                  <TableRow
                    key={spouse.relative.id}
                    spouse={spouse}
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
