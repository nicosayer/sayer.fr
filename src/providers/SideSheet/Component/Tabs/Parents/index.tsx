import {
  Button,
  Table,
  Pane,
  Card,
  Autocomplete,
  TextInput,
  IconButton,
  TrashIcon,
  PlusIcon,
} from "evergreen-ui";
import firebase from "firebase/app";
import React, { useEffect, useState } from "react";

import { NewRelativeButton } from "components/NewRelativeButton";
import { DocumentData } from "config/firebase";
import { RelativeType } from "config/relative";
import { useAuth } from "providers/Auth";
import { useOneTimeRelatives } from "providers/OneTimeRelatives";
import { useSideSheet } from "providers/SideSheet";
import { NameCell } from "providers/SideSheet/Component/Tabs/NameCell";
import { linkParentAndChild, relativeData, relativeDoc } from "utils/relative";

const TableRow = ({
  parent,
  relative,
}: {
  relative: DocumentData;
  parent: { type: RelativeType; relative: DocumentData };
}) => {
  const { isAuth } = useAuth();
  const { openSideSheet } = useSideSheet();
  const [data, setData] = useState<DocumentData>();

  useEffect(() => {
    relativeData(parent.relative.id).then(setData);
  }, []);

  return (
    <Table.Row
      key={parent.relative.id}
      isSelectable
      onSelect={() => {
        openSideSheet(parent.relative.id);
      }}
    >
      {/* @ts-ignore */}
      <NameCell data={data} />
      {isAuth && (
        <Table.TextCell flexBasis={60} flexShrink={0} flexGrow={0}>
          <IconButton
            icon={TrashIcon}
            intent="danger"
            // @ts-ignore
            onClick={(event: MouseEvent) => {
              event.stopPropagation();
              const currentRelativeDoc = relativeDoc(relative.id);

              parent.relative.update({
                children: firebase.firestore.FieldValue.arrayRemove({
                  type: RelativeType.blood,
                  relative: currentRelativeDoc,
                }),
              });

              currentRelativeDoc.update({
                parents: firebase.firestore.FieldValue.arrayRemove({
                  type: RelativeType.blood,
                  relative: parent.relative,
                }),
              });
            }}
          />
        </Table.TextCell>
      )}
    </Table.Row>
  );
};

export const Parents = ({ relative }: { relative: DocumentData }) => {
  const data = relative.data();
  const { isAuth } = useAuth();

  const { searchableRelatives } = useOneTimeRelatives();
  const [newParentId, setNewParentId] = useState<string>();

  return (
    <Pane background="tint1" padding={16}>
      <Card backgroundColor="white" elevation={0}>
        {isAuth && (
          <Autocomplete
            items={Object.keys(searchableRelatives).filter(
              (searchableRelativeId) => searchableRelativeId !== relative.id
            )}
            onChange={setNewParentId}
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
                    placeholder="Search parent"
                    width="100%"
                    {...getInputProps()}
                  />
                  <Button
                    marginLeft={16}
                    marginRight={16}
                    appearance="primary"
                    onClick={() => {
                      if (newParentId) {
                        linkParentAndChild({
                          parentDoc: relativeDoc(newParentId),
                          childDoc: relativeDoc(relative.id),
                        });

                        clearSelection();
                      }
                    }}
                  >
                    Add
                  </Button>
                  <NewRelativeButton
                    iconBefore={PlusIcon}
                    onCompleted={(parentDoc: DocumentData) => {
                      linkParentAndChild({
                        parentDoc,
                        childDoc: relativeDoc(relative.id),
                      });
                    }}
                  >
                    New
                  </NewRelativeButton>
                </Pane>
              );
            }}
          </Autocomplete>
        )}
        <Table>
          <Table.Head>
            <Table.TextHeaderCell flexGrow={2}>Name</Table.TextHeaderCell>
            {isAuth && (
              <Table.TextHeaderCell
                flexBasis={60}
                flexShrink={0}
                flexGrow={0}
              />
            )}
          </Table.Head>
          <Table.VirtualBody height={240}>
            {(data.parents ?? []).map(
              (parent: { type: RelativeType; relative: DocumentData }) => {
                return (
                  <TableRow
                    key={parent.relative.id}
                    parent={parent}
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
