import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

export default function DarkMap() {
  // Center coordinates for San Juan, Calumpang, and South Fundidor in Molo, Iloilo
  const ILOILO_MOLO_REGION = {
    latitude: 10.6931,
    longitude: 122.54,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        // "standard" shows the normal Google/Apple map with colors
        mapType="standard"
        initialRegion={ILOILO_MOLO_REGION}
        // Shows the user's current location blue dot if permissions are granted
        showsUserLocation={true}
        showsMyLocationButton={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
});
