import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { BoardDocument, Collection } from "types/firebase/collections";
import { db } from "utils/firebase";
import { searchString } from "utils/string";

export const newBoard = ({
  user,
  boards,
}: {
  user: User;
  boards: BoardDocument[];
}) => {
  const username = user.displayName ?? user.email ?? "";

  const version = (boards ?? []).filter((board) => {
    return searchString(String(board.name), username);
  }).length;

  return addDoc<BoardDocument>(collection(db, Collection.boards), {
    users: user.email ? [user.email] : [],
    name: `Board de ${username}${version ? ` ${version + 1}` : ""}`,
  });
};

export const ALL_BOARDS_SLUG = "a";
