import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarShowLabel: false,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'android' ? 20 : 0,
                    height: 70,
                    paddingBottom: Platform.OS === 'android' ? 20 : 10,
                    paddingTop: 10,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                },
            }}
        >
            <Tabs.Screen
                name="rewards"
                options={{
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={30} name="medal.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="friends"
                options={{
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={30} name="person.2.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={36} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={30} name="gear" color={color} />
                    ),
                }}
            />
            <Tabs.Screen name="host" options={{ href: null }} />
            <Tabs.Screen name="join" options={{ href: null }} />
        </Tabs>
    );
}
