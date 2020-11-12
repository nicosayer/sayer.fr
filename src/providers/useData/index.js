import { useListenData } from "hooks/useListenData";
import { useUser } from "providers/UserProvider";
import React, { useContext, useState } from "react";
import { formatDate, formatTime } from "utils/date";

const DataContext = React.createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [date, setData] = useState(formatDate(new Date()));
  const [time, setTime] = useState(formatTime(new Date()));

  const { user } = useUser();

  const [profiles = [], loading] = useListenData({
    collection: "profiles",
    where: [["userId", "==", user?.uid]],
    skip: !user,
  });

  return (
    <DataContext.Provider
      value={{
        selectedProfiles,
        setSelectedProfiles,
        selectedReason,
        setSelectedReason,
        date,
        setData,
        profiles,
        loading,
        time,
        setTime,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
