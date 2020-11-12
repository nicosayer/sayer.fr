import { useListenData } from "hooks/useListenData";
import { useUser } from "providers/UserProvider";
import React, { useContext, useMemo, useState } from "react";

const DataContext = React.createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [date, setData] = useState(new Date());

  const { user } = useUser();

  const [profiles = [], loading] = useListenData({
    collection: "profiles",
    where: useMemo(() => [["userId", "==", user?.uid]], [user]),
    skip: !user,
  });

  return (
    <DataContext.Provider
      value={{
        selectedProfiles,
        setSelectedProfiles,
        selectedReasons,
        setSelectedReasons,
        date,
        setData,
        profiles,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
