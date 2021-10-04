import React, { useContext, useState } from "react";
import { menuitems } from "./components/SideBarMenu";

const AdminContext = React.createContext();

const AdminProvider = ({ children }) => {
  const [screenTitle, setScreenTitle] = useState(menuitems[0].title);
  return (
    <AdminContext.Provider value={{ screenTitle, setScreenTitle }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};

export { AdminContext, AdminProvider };
