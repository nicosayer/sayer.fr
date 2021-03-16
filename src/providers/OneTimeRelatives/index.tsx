import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { db } from "config/firebase";
import { GenderType, IFirebaseRelative, IRelative } from "config/relative";
import { isSet } from "utils/general";
import { cleanName, cleanSubRelatives } from "utils/relative";

export interface IOneTimeRelativesContext {
  relatives: IRelative[];
  searchableRelatives: Record<string, string>;
}

const OneTimeRelativesContext = React.createContext<IOneTimeRelativesContext>({
  relatives: [],
  searchableRelatives: {},
});

export const useOneTimeRelatives = (): IOneTimeRelativesContext =>
  useContext(OneTimeRelativesContext);

export const OneTimeRelativesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [relatives, setRelatives] = useState<IRelative[]>([]);

  useEffect(() => {
    db.collection("relatives")
      .get()
      .then((relatives) => {
        setRelatives(
          relatives.docs
            .map((relative) => {
              const {
                firstName = "",
                lastName = "",
                gender,
                parents = [],
                siblings = [],
                spouses = [],
                children = [],
              } = relative.data() as IFirebaseRelative;

              return {
                id: relative.id,
                firstName: cleanName(firstName),
                lastName: cleanName(lastName),
                gender: GenderType[gender] as keyof typeof GenderType,
                parents: cleanSubRelatives(parents),
                siblings: cleanSubRelatives(siblings),
                spouses: cleanSubRelatives(spouses),
                children: cleanSubRelatives(children),
              };
            })
            .filter(
              ({ id, firstName, lastName, gender }) =>
                id && firstName && lastName && isSet(gender)
            )
        );
      });
  }, []);

  const searchableRelatives = useMemo(() => {
    return relatives.reduce(
      (acc, { id, firstName, lastName }) => ({
        ...acc,
        [id]: `${firstName} ${lastName}`,
      }),
      {}
    );
  }, [relatives]);

  return (
    <OneTimeRelativesContext.Provider
      value={{ relatives, searchableRelatives }}
    >
      {relatives.length ? children : null}
    </OneTimeRelativesContext.Provider>
  );
};
