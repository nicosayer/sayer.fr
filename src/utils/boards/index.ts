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
    return board?.name && sanitize(username).indexOf(sanitize(board?.name));
  }).length;

  return addDoc(collection(db, Collection.boards), {
    users: [user.email],
    name: `Board de ${username}${version ? ` ${version + 1}` : ""}`,
  });
};
