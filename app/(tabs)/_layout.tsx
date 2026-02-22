import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: ({ options }) => (
          <View style={styles.headerWrapper}>
            <View style={styles.headerMainRow}>
              {/* Left: Profile Avatar */}
              <View style={styles.headerSideSection}>
                <TouchableOpacity style={styles.avatarCircle}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/40" }}
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
              </View>

              {/* Center: Title with Manrope Font */}
              <Text style={styles.headerTitle}>{options.title}</Text>

              {/* Right: Actions */}
              <View style={[styles.headerActions, styles.headerSideSection]}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="settings-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Full width line */}
            <View style={styles.headerLine} />
          </View>
        ),

        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#484C52",
        // Inter Font for Tab Labels
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 12,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: "50%",
          // Correct centering: -(345 / 2)
          transform: [{ translateX: 35 }],
          width: 345,
          height: 75,
          borderRadius: 60,
          backgroundColor: "#ffffff",
          paddingBottom: 12,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 3, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 10.6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map View",
          tabBarLabel: "Map",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="map-outline"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: "Capture",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cube-scan" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="assessment" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 50 : 35,
  },
  headerMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerSideSection: {
    width: 80, // Fixed width for left/right to keep center title stable
  },
  headerTitle: {
    flex: 1, // Takes up remaining space
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
    color: "#000000",
    textAlign: "center",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconButton: {
    marginLeft: 15,
  },
  headerLine: {
    height: 1,
    backgroundColor: "#E5E7EB",
    width: "100%",
  },
});
