import { db } from "configs/firebase";
import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { BoardDocument, Collection } from "types/firebase/collections";
import { sanitize } from "utils/string";

export const newBoard = ({
  user,
  boards,
}: {
  user: User;
  boards: BoardDocument[];
}) => {
  const username = user.displayName ?? user.email ?? "";

  const version = (boards ?? []).filter((board) => {
    return sanitize(String(board.name)).indexOf(sanitize(username)) > -1;
  }).length;

  return addDoc<BoardDocument>(collection(db, Collection.boards), {
    users: user.email ? [user.email] : [],
    name: `Board de ${username}${version ? ` ${version + 1}` : ""}`,
  });
};
