import { createContext, useContext, useState } from 'react';

type UserContextType = {
  username: string;
  toggleUsername: (newUsername: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);


type UserProviderProps = {
  children: React.ReactNode;
};


export function UserProvider({ children }: UserProviderProps) {
  const [username, setUsername] = useState<string>("User");


  const toggleUsername = (newDifficulty: string) => {
    setUsername(newDifficulty);
  }

  return (
    <UserContext.Provider value={{ username, toggleUsername }}>
      {children}
    </UserContext.Provider>
  );

}

export function useUser() {
  const context = useContext(UserContext);

  return context;
}

