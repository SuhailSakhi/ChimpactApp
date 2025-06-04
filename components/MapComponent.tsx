import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, Platform } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { usePlayer } from '@/context/PlayerContext';
import haversine from 'haversine-distance';

type MapComponentProps = {
    zoom?: number;
    showRunners?: boolean;
    onCatch?: () => void;
};

type UserLocation = {
    id: string;
    name: string;
    role: 'hunter' | 'runner';
    coords: {
        latitude: number;
        longitude: number;
    };
};

const API_URL = 'https://bf9f-145-137-69-220.ngrok-free.app/locations';

const mapStyle = [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road.local', stylers: [{ visibility: 'simplified' }] },
];

export default function MapComponent({
                                         zoom = 0.0015,
                                         showRunners = false,
                                         onCatch,
                                     }: MapComponentProps) {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [otherUsers, setOtherUsers] = useState<UserLocation[]>([]);
    const [hasPermission, setHasPermission] = useState(false);
    const { player } = usePlayer();

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('❌ Locatie niet toegestaan');
                return;
            }
            setHasPermission(true);
            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
        })();
    }, []);

    useEffect(() => {
        if (!hasPermission) return;

        const interval = setInterval(async () => {
            try {
                const currentLocation = await Location.getCurrentPositionAsync({});
                setLocation(currentLocation);

                const playerData = {
                    id: player.id,
                    role: player.role,
                    name: `Speler-${player.id.slice(-4)}`,
                    coords: {
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                    },
                };

                // POST of PUT voor eigen speler
                const checkRes = await fetch(`${API_URL}/${player.id}`);
                if (checkRes.status === 404) {
                    await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(playerData),
                    });
                } else {
                    await fetch(`${API_URL}/${player.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(playerData),
                    });
                }

                // Haal alle gebruikers op
                const res = await fetch(API_URL);
                if (!res.ok) {
                    console.warn(`❌ Geen geldige response van API: ${res.status}`);
                    return;
                }
                const contentType = res.headers.get('Content-Type') || '';
                if (!contentType.includes('application/json')) {
                    console.warn('❌ Verwachte JSON, maar kreeg:', contentType);
                    return;
                }

                const data: UserLocation[] = await res.json();
                // Filter dubbele IDs
                const uniqueUsers = Object.values(
                    data.reduce((acc: Record<string, UserLocation>, curr) => {
                        acc[curr.id] = curr;
                        return acc;
                    }, {})
                );
                setOtherUsers(uniqueUsers);

                // Check afstand tussen runner en hunter
                if (player.role === 'runner') {
                    const hunter = uniqueUsers.find(u => u.role === 'hunter');
                    if (hunter) {
                        const distance = haversine(
                            {
                                latitude: currentLocation.coords.latitude,
                                longitude: currentLocation.coords.longitude,
                            },
                            {
                                latitude: hunter.coords.latitude,
                                longitude: hunter.coords.longitude,
                            }
                        );
                        if (distance < 10 && onCatch) {
                            onCatch();
                        }
                    }
                }
            } catch (err) {
                console.error('❌ Locatie-update fout:', err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [hasPermission, player]);

    if (!location || !hasPermission) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" color="#8EFFA0" />;
    }

    return (
        <View style={styles.mapContainer}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={mapStyle}
                showsUserLocation={false}
                followsUserLocation
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                toolbarEnabled={false}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: zoom,
                    longitudeDelta: zoom,
                }}
            >
                {player.role === 'hunter' && (
                    <Circle
                        center={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        radius={10}
                        strokeColor="rgba(255,0,0,1)"
                        fillColor="rgba(255,0,0,0.3)"
                        strokeWidth={2}
                        zIndex={0}
                    />
                )}

                {(player.role !== 'hunter' || showRunners) &&
                    otherUsers
                        .filter(user => user.id !== player.id)
                        .map(user => {
                            const isOverlap =
                                location.coords.latitude === user.coords.latitude &&
                                location.coords.longitude === user.coords.longitude;
                            const offset = isOverlap ? 0.00007 : 0;

                            return (
                                <Marker
                                    key={user.id}
                                    coordinate={{
                                        latitude: user.coords.latitude + offset,
                                        longitude: user.coords.longitude + offset,
                                    }}
                                    zIndex={1}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                >
                                    <Text style={styles.emoji}>
                                        {user.role === 'hunter' ? '👮' : '🐵'}
                                    </Text>
                                </Marker>
                            );
                        })}

                <Marker
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    zIndex={2}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <Text style={styles.emoji}>
                        {player.role === 'hunter' ? '👮🏻' : '🐵'}
                    </Text>
                </Marker>
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        height: 300,
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#ffffff',
        marginTop: 20,
    },
    map: {
        flex: 1,
    },
    emoji: {
        fontSize: Platform.OS === 'android' ? 32 : 30,
        textAlign: 'center',
        lineHeight: Platform.OS === 'android' ? 32 : 30,
    },
});
