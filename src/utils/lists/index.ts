import { ListItemDocument, ListItemStatus } from "types/firebase/collections";

export const getChecked = (listItem: ListItemDocument) => {
  return (
    listItem.status &&
    [ListItemStatus.Checked, ListItemStatus.Indeterminate].includes(
      listItem.status
    )
  );
};

export const getIntermediate = (listItem: ListItemDocument) => {
  return (
    listItem.status && [ListItemStatus.Indeterminate].includes(listItem.status)
  );
};

export const getColor = (listItem: ListItemDocument) => {
  switch (listItem.status) {
    case ListItemStatus.Indeterminate:
      return "red";
  }
};
