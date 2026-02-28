import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Circle, Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";

const INITIAL_LOCATION: Region = {
  latitude: 10.6840,
  longitude: 122.5130,
  latitudeDelta: 0.03, // Slightly wider to see the whole district
  longitudeDelta: 0.03,
};

export default function UserLocationMap() {
  const [simulationData, setSimulationData] = useState<{ hotspots: any[], agents: any[] }>({
    hotspots: [],
    agents: []
  });
  const [loading, setLoading] = useState(false);
  const [timeStep, setTimeStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSimulationData = async (step: number) => {
    setLoading(true);
    try {
      const url = `http://192.168.1.39:8000/api/v1/simulation?step=${step}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log(`Fetched Step ${step}:`, {
        hotspots: data?.hotspots?.length,
        agents: data?.agents?.length
      });

      setSimulationData(data);
    } catch (error) {
      console.error("Connection Error! Verify Backend is running and IP matches your computer:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSliderChange = (value: number) => {
    const roundedValue = Math.floor(value);
    setTimeStep(roundedValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSimulationData(roundedValue), 100);
  };

  useEffect(() => {
    fetchSimulationData(0);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_LOCATION}
        customMapStyle={darkMapStyle}
      >
        {/* Render the Spread Zones */}
        {simulationData?.hotspots?.map((spot: any) => (
          <Circle
            key={`hotspot-${spot.id}-${timeStep}`}
            center={{ latitude: spot.lat, longitude: spot.lng }}
            radius={spot.radius}
            fillColor="rgba(255, 69, 0, 0.4)" // Slightly more visible
            strokeColor="#FF4500"
            strokeWidth={2}
          />
        ))}

        {/* Render the Individual Mosquitos */}
        {simulationData?.agents?.map((agent: any) => (
          <Marker
            key={`agent-${agent.id}-${timeStep}`}
            coordinate={{ latitude: agent.lat, longitude: agent.lng }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false} // Performance boost
          >
            <Image
              source={require('../../../assets/images/mosquito.png')}
              style={styles.mosquitoIcon}
            />
          </Marker>
        ))}
      </MapView>

      <View style={styles.controlPanel}>
        <Text style={styles.locationTag}>Villa Arevalo District</Text>

        {/* Connection Status Helper */}
        {simulationData.agents.length === 0 && !loading && (
          <Text style={{ color: '#ff4444', fontSize: 10 }}>No agents found - check backend connection</Text>
        )}

        <View style={styles.headerRow}>
          <Text style={styles.timeLabel}>T + {timeStep} Hours</Text>
          {loading && <ActivityIndicator size="small" color="#FF4500" style={{ marginLeft: 10 }} />}
        </View>

        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={72}
          minimumTrackTintColor="#FF4500"
          thumbTintColor="#FF4500"
          value={timeStep}
          onValueChange={onSliderChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mosquitoIcon: {
    width: 30,  // Fixed Width
    height: 30, // Fixed Height
    resizeMode: 'contain',
  },
  locationTag: { color: '#FF4500', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  controlPanel: {
    position: 'absolute',
    bottom: 100, left: 20, right: 20,
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#333',
    alignItems: 'center',
  },
  timeLabel: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#1a1a1a" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];