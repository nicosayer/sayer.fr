import { useUser } from "providers/UserProvider";
import React, { useContext, useEffect, useState } from "react";

const DataContext = React.createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useUser();
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [emails, setEmails] = useState([]);
  const [date, setData] = useState(new Date());

  useEffect(() => {
    if (user?.email) {
      setEmails([user.email]);
    }
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        selectedProfiles,
        setSelectedProfiles,
        selectedReasons,
        setSelectedReasons,
        date,
        setData,
        emails,
        setEmails,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
