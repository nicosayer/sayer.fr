import { db } from "config/firebase";
import { useState } from "react";
import { log } from "utils";
import firebase from "firebase/app";

export const useDeleteData = (): [
  ({
    collection,
    id,
    src,
    onSuccess,
    onError,
  }: {
    collection?: string;
    id?: string;
    src?: firebase.firestore.DocumentReference;
    onSuccess?: () => void;
    onError?: () => void;
  }) => Promise<void>,
  boolean
] => {
  const [loading, setLoading] = useState(false);

  return [
    ({
      collection,
      id,
      src,
      onSuccess = () => null,
      onError = () => null,
    }: {
      collection?: string;
      id?: string;
      src?: firebase.firestore.DocumentReference;
      onSuccess?: () => void;
      onError?: () => void;
    }): Promise<void> => {
      setLoading(true);

      let mutation: any = src || db;

      if (collection) {
        mutation = mutation.collection(collection);
      }

      if (id) {
        mutation = mutation.doc(id);
      }

      return (mutation as firebase.firestore.DocumentReference)
        .delete()
        .then(() => {
          setLoading(false);
          onSuccess();
        })
        .catch((error) => {
          setLoading(false);
          log(error);
          onError();
        });
    },
    loading,
  ];
};
