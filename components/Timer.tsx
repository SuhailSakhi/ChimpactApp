import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useGameTimer } from '@/context/GameTimerContext';

type TimerProps = {
    onEnd?: () => void;
};

export default function Timer({ onEnd }: TimerProps) {
    const { timeLeft, setTime } = useGameTimer();

    useEffect(() => {
        if (timeLeft <= 0) {
            if (onEnd) onEnd();
            return;
        }

        const interval = setInterval(() => {
            setTime(timeLeft - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return <Text style={styles.timerText}>⏱️ {formatTime(timeLeft)}</Text>;
}

const styles = StyleSheet.create({
    timerText: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
