import React, { createContext, useContext, useState } from 'react';

type GameTimerContextType = {
    timeLeft: number;
    addTime: (seconds: number) => void;
    setTime: (seconds: number) => void;
};

const GameTimerContext = createContext<GameTimerContextType | undefined>(undefined);

export const GameTimerProvider = ({ children }: { children: React.ReactNode }) => {
    const [timeLeft, setTimeLeftState] = useState(1800); // standaard 30 minuten

    const addTime = (seconds: number) => {
        setTimeLeftState((prev) => prev + seconds);
    };

    const setTime = (seconds: number) => {
        setTimeLeftState(seconds);
    };

    return (
        <GameTimerContext.Provider value={{ timeLeft, addTime, setTime }}>
            {children}
        </GameTimerContext.Provider>
    );
};

export const useGameTimer = () => {
    const context = useContext(GameTimerContext);
    if (!context) {
        throw new Error('useGameTimer must be used within a GameTimerProvider');
    }
    return context;
};
