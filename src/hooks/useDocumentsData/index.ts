import { DocumentReference, onSnapshot } from "firebase/firestore";
import { pick } from "lodash";
import { useSecureLogin } from "providers/SecureLogin";
import { useEffect, useMemo, useState } from "react";
import { spreadSnapshot } from "utils/firebase";

const useReferencesData = <T>(references: DocumentReference[]) => {
  const [data, setData] = useState<Record<string, T>>();
  const { isSecure } = useSecureLogin();

  useEffect(() => {
    const documentIds = references.map((reference) => reference.id as string);

    const unsubscribes = references.map((reference) => {
      if (reference === undefined) {
        return () => {};
      }

      return onSnapshot(
        reference,
        (snapshot) => {
          setData((old) => {
            return {
              ...pick(old ?? {}, documentIds),
              [String(reference.id)]: spreadSnapshot(snapshot) as T,
            };
          });
        },
        () => {
          setData((old) => {
            return { ...old };
          });
        }
      );
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [references, isSecure]);

  return useMemo(() => {
    return [
      data,
      Boolean(
        references.length &&
          (data === undefined || Object.keys(data).length !== references.length)
      ),
    ] as const;
  }, [references.length, data]);
};

export default useReferencesData;
