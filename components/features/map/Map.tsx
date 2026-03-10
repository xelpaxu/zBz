import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from "react-native";

// Import react-native-maps components with require to avoid Web crash
let MapView: any, Circle: any, Marker: any, PROVIDER_DEFAULT: any;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Circle = Maps.Circle;
  Marker = Maps.Marker;
  PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
}

const INITIAL_LOCATION = {
  latitude: 10.6840,
  longitude: 122.5130,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

// --- UI DEVELOPMENT MOCK DATA ---
const MOCK_DATA = {
  hotspots: [
    { id: '1', lat: 10.6840, lng: 122.5130, radius: 300 },
    { id: '2', lat: 10.6900, lng: 122.5200, radius: 200 },
  ],
  agents: [
    { id: 'a1', lat: 10.6845, lng: 122.5135 },
    { id: 'a2', lat: 10.6830, lng: 122.5120 },
    { id: 'a3', lat: 10.6860, lng: 122.5150 },
  ]
};

export default function UserLocationMap() {
  // Initializing with MOCK_DATA for UI testing
  const [simulationData, setSimulationData] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [timeStep, setTimeStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSimulationData = async (step: number) => {
    /* --- MODEL/API LOGIC COMMENTED OUT FOR UI DEV ---
    setLoading(true);
    try {
      const url = `http://192.168.1.39:8000/api/v1/simulation?step=${step}`;
      const response = await fetch(url);
      const data = await response.json();
      setSimulationData(data);
    } catch (error) {
      console.error("Connection Error!", error);
    } finally {
      setLoading(false);
    }
    */

    // Just update the timeStep visually for now
    setTimeStep(step);
  };

  const onSliderChange = (value: number) => {
    const roundedValue = Math.floor(value);
    setTimeStep(roundedValue);
    // Logic to simulate a "loading" state flick when sliding
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSimulationData(roundedValue), 100);
  };

  useEffect(() => {
    // fetchSimulationData(0); // Commented out
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FF4500', fontSize: 16 }}>Map feature is not available on web.</Text>
      </View>
    );
  }

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
            key={`hotspot-${spot.id}`}
            center={{ latitude: spot.lat, longitude: spot.lng }}
            radius={spot.radius}
            fillColor="rgba(255, 69, 0, 0.3)"
            strokeColor="#FF4500"
            strokeWidth={2}
          />
        ))}

        {/* Render the Individual Mosquitos */}
        {simulationData?.agents?.map((agent: any) => (
          <Marker
            key={`agent-${agent.id}`}
            coordinate={{ latitude: agent.lat, longitude: agent.lng }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <Image
              source={require('../../../assets/images/mosquito.png')}
              style={styles.mosquitoIcon}
            />
          </Marker>
        ))}
      </MapView>

      <View style={styles.controlPanel}>
        <Text style={styles.locationTag}>VILLA AREVALO DISTRICT</Text>

        <View style={styles.headerRow}>
          <Text style={styles.timeLabel}>T + {timeStep} HOURS</Text>
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