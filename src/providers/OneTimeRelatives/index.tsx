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
  updateRelatives: () => void;
}

const OneTimeRelativesContext = React.createContext<IOneTimeRelativesContext>({
  relatives: [],
  searchableRelatives: {},
  updateRelatives: () => {},
});

export const useOneTimeRelatives = (): IOneTimeRelativesContext =>
  useContext(OneTimeRelativesContext);

export const OneTimeRelativesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [version, setVersion] = useState(0);
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
                birthDate,
                deathDate,
              } = relative.data() as IFirebaseRelative;

              return {
                id: relative.id,
                firstName: cleanName(firstName),
                lastName,
                gender: GenderType[gender] as keyof typeof GenderType,
                parents: cleanSubRelatives(parents),
                siblings: cleanSubRelatives(siblings),
                spouses: cleanSubRelatives(spouses),
                children: cleanSubRelatives(children),
                birthYear: birthDate?.year ?? null,
                deathYear: deathDate?.year ?? null,
              };
            })
            .filter(
              ({ id, firstName, lastName, gender }) =>
                id && firstName && lastName && isSet(gender)
            )
        );
      });
  }, [version]);

  const searchableRelatives = useMemo(() => {
    return relatives.reduce(
      (acc, { id, firstName, lastName, birthYear, deathYear }) => ({
        ...acc,
        [id]:
          birthYear && deathYear
            ? `${firstName} ${lastName} (${birthYear} → ${deathYear})`
            : birthYear
            ? `${firstName} ${lastName} (${birthYear})`
            : deathYear
            ? `${firstName} ${lastName} (? → ${deathYear})`
            : `${firstName} ${lastName}`,
      }),
      {}
    );
  }, [relatives]);

  return (
    <OneTimeRelativesContext.Provider
      value={{
        relatives,
        searchableRelatives,
        updateRelatives: () => {
          setVersion((old) => old + 1);
        },
      }}
    >
      {relatives.length ? children : null}
    </OneTimeRelativesContext.Provider>
  );
};
