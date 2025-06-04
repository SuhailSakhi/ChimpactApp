import React, { createContext, useContext, useState } from "react";

const PlayerContext = createContext<any>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [player, setPlayer] = useState<{
        id: string;
        role: 'hunter' | 'runner' | null;
    }>({ id: '', role: null });

    return (
        <PlayerContext.Provider value={{ player, setPlayer }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
