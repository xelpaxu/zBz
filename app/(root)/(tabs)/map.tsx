import UserLocationMap from "@/components/features/map/Map";
import { StyleSheet, View } from "react-native";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      {/* The Map logic is all inside this component */}
      <UserLocationMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});