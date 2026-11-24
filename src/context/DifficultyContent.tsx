import { createContext, useContext, useState } from 'react';

export type Difficulty = 'light' | 'medium' | 'hard';
export type Record = {
  score: number,
  difficulty: Difficulty,
};


type DifficultyContextType = {
  difficulty: Difficulty;
  toggleDifficulty: (newDifficulty: Difficulty) => void;
  records: Record[],
  addRecord: (newRecord: Record) => void;
  clearRecords: () => void;
};

const DifficultyContext = createContext<DifficultyContextType | undefined>(undefined);


type DifficultyProviderProps = {
  children: React.ReactNode;
};


export function DifficultyProvider({ children }: DifficultyProviderProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [records, setRecords] = useState<Record[]>([]);


  const addRecord = (newRecord: Record) => {
    setRecords((currentRecords) => [...currentRecords, newRecord])
  }

  const clearRecords = () => {
    setRecords([]);
  }

  const toggleDifficulty = (newDifficulty: Difficulty) => {
    if (["light", "medium", "hard"].includes(newDifficulty)){
        setDifficulty(newDifficulty);
    }
  }

  return (
    <DifficultyContext.Provider value={{ difficulty, toggleDifficulty, records, addRecord, clearRecords}}>
      {children}
    </DifficultyContext.Provider>
  );

}

export function useDifficulty() {
  const context = useContext(DifficultyContext);

  return context;
}

