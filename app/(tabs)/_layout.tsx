import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import WelcomeScreen from '../screens/WelcomeScreen'; // importeer het welkomscherm
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const [hasSeenWelcome, setHasSeenWelcome] = useState(false); // state om welkomscherm te tonen
    const colorScheme = useColorScheme();

    // Functie om welkomscherm over te slaan en naar Home te gaan
    const handleWelcomeDone = () => setHasSeenWelcome(true);

    // Als de gebruiker klaar is met het welkomscherm, toon de tabs
    if (!hasSeenWelcome) {
        return <WelcomeScreen onDone={handleWelcomeDone} />; // Geef onDone door als prop aan WelcomeScreen
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute', // Transparante achtergrond op iOS voor blur effect
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}
