import {
  CornerDialog as EvergreenCornerDialog,
  ListItem,
  Text,
  UnorderedList,
} from "evergreen-ui";
import React from "react";

export const CornerDialog = () => {
  return (
    <EvergreenCornerDialog
      title="Welcome to one hell of a family!"
      isShown
      // @ts-ignore
      position="bottom-left"
      hasFooter={false}
    >
      <Text>
        Before you start wandering around here are three things you need to
        know:
      </Text>
      <UnorderedList>
        <ListItem>Use your mouse or trackpad to move around and zoom</ListItem>
        <ListItem>
          Double click on an element to make it the center of the tree
        </ListItem>
        <ListItem>Right click on an element to see more details</ListItem>
      </UnorderedList>
    </EvergreenCornerDialog>
  );
};
