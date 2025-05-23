import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaProvider> {/* ✅ wrap alles in SafeAreaProvider */}
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                    {/* 👇 Welcome screen zonder tabs */}
                    <Stack.Screen name="welcome" />
                    <Stack.Screen name='runner' />
                    <Stack.Screen name='runnerchallenges' />
                    <Stack.Screen name='runnershop' />
                    <Stack.Screen name='hunter' />
                    <Stack.Screen name='hunterchallenges' />
                    <Stack.Screen name='huntershop' />
                    {/* 👇 Alles met tabs komt hieronder */}
                    <Stack.Screen name="(tabs)" />
                    {/* 404 fallback */}
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
