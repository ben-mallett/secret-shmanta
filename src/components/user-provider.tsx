"use client"

import { ReactNode, createContext, useContext, useState } from 'react';

interface UserContextType {
    user: null | {_id: string, firstName: string, lastName: string, username: string, role: string};
    setUserState: (userData: {_id: string, firstName: string, lastName: string, username: string, role: string}) => void;
    invalidateUserState: () => void;
  }

const UserContext = createContext<UserContextType>({
    user: null,
    setUserState: () => {},
    invalidateUserState: () => {}
  });

interface UserProviderProps {
    children: ReactNode;
}

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<{_id: string, firstName: string, lastName: string, username: string, role: string} | null>(null); 

  function setUserState(userData: {_id: string, firstName: string, lastName: string, username: string, role: string} | null) {
    setUser(userData);
  }

  const invalidateUserState = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUserState, invalidateUserState }}>
      {children}
    </UserContext.Provider>
  );
};