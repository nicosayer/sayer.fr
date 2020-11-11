import React, { useContext, useState } from "react";

const DataContext = React.createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [date, setData] = useState(new Date());

  return (
    <DataContext.Provider
      value={{
        selectedProfiles,
        setSelectedProfiles,
        selectedReasons,
        setSelectedReasons,
        date,
        setData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
