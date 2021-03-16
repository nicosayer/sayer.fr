import {
  Avatar,
  Button,
  Table,
  Pane,
  Card,
  Autocomplete,
  TextInput,
  IconButton,
  TrashIcon,
} from "evergreen-ui";
import firebase from "firebase/app";
import React, { useEffect, useState } from "react";

import { Box } from "components/Box";
import { DocumentData } from "config/firebase";
import { RelativeType } from "config/relative";
import { useOneTimeRelatives } from "providers/OneTimeRelatives";
import { useSideSheet } from "providers/SideSheet";
import { relativeData, relativeDoc } from "utils/relative";

const TableRow = ({
  child,
  relative,
}: {
  relative: DocumentData;
  child: { type: RelativeType; relative: DocumentData };
}) => {
  const { openSideSheet } = useSideSheet();
  const [data, setData] = useState<DocumentData>();

  useEffect(() => {
    relativeData(child.relative.id).then(setData);
  }, []);

  return (
    <Table.Row
      key={child.relative.id}
      isSelectable
      onSelect={() => {
        openSideSheet(child.relative.id);
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

            child.relative.update({
              parents: firebase.firestore.FieldValue.arrayRemove({
                type: RelativeType.blood,
                relative: currentRelativeDoc,
              }),
            });

            currentRelativeDoc.update({
              children: firebase.firestore.FieldValue.arrayRemove({
                type: RelativeType.blood,
                relative: child.relative,
              }),
            });
          }}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export const Children = ({ relative }: { relative: DocumentData }) => {
  const data = relative.data();

  const { searchableRelatives } = useOneTimeRelatives();
  const [newChildId, setNewChildId] = useState<string>();

  return (
    <Pane background="tint1" padding={16}>
      <Card backgroundColor="white" elevation={0}>
        <Autocomplete
          items={Object.keys(searchableRelatives).filter(
            (searchableRelativeId) => searchableRelativeId !== relative.id
          )}
          onChange={setNewChildId}
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
                  placeholder="Add new child"
                  width="100%"
                  marginRight={16}
                  {...getInputProps()}
                />
                <Button
                  appearance="primary"
                  onClick={() => {
                    if (newChildId) {
                      const newChildDoc = relativeDoc(newChildId);
                      const currentRelativeDoc = relativeDoc(relative.id);

                      newChildDoc.update({
                        parents: firebase.firestore.FieldValue.arrayUnion({
                          type: RelativeType.blood,
                          relative: currentRelativeDoc,
                        }),
                      });

                      currentRelativeDoc.update({
                        children: firebase.firestore.FieldValue.arrayUnion({
                          type: RelativeType.blood,
                          relative: newChildDoc,
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
            <Table.TextHeaderCell flexBasis={60} flexShrink={0} flexGrow={0} />
          </Table.Head>
          <Table.VirtualBody height={240}>
            {(data.children ?? []).map(
              (child: { type: RelativeType; relative: DocumentData }) => {
                return (
                  <TableRow
                    key={child.relative.id}
                    child={child}
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
