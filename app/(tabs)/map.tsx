import { StyleSheet, View } from "react-native";
import DarkMap from "../../components/Map";

export default function CaptureScreen() {
  return (
    <View style={styles.container}>
      <DarkMap />

      {/* You can add your "Capture" UI elements on top here */}
      <View style={styles.overlay}>
        {/* Placeholder for camera buttons or barangay info cards */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Matches the dark map
  },
  overlay: {
    position: "absolute",
    bottom: 120, // Stays above your floating navbar
    width: "100%",
    padding: 20,
  },
});
