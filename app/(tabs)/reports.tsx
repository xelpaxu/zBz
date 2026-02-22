import React, { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import PostCard from "../../components/CommunityCard";
import HistoryItemCard from "../../components/HistoryItemCard";
import ReportStatsCard from "../../components/ReportStatCard";

// 1. Define strict types to prevent TypeScript 'status' errors
interface CommunityReport {
  id: string;
  image: any;
  userName: string;
  location: string;
  timestamp: string;
  status: "CRITICAL" | "WARNING";
}

interface HistoryReport {
  id: string;
  location: string;
  date: string;
  image: any;
  isUrgent: boolean;
}

// 2. Data Arrays
const COMMUNITY_DATA: CommunityReport[] = [
  {
    id: "1",
    image: require("../../assets/images/sample-site.webp"),
    userName: "John Doesena",
    location: "Calumpang, Iloilo City",
    timestamp: "1d ago",
    status: "CRITICAL",
  },
  {
    id: "2",
    image: require("../../assets/images/sample-site.webp"),
    userName: "John Doe",
    location: "Calumpang, Iloilo City",
    timestamp: "1d ago",
    status: "CRITICAL",
  },
  {
    id: "3",
    image: require("../../assets/images/sample-site.webp"),
    userName: "Jane Smith",
    location: "San Juan",
    timestamp: "2d ago",
    status: "WARNING",
  },
  {
    id: "4",
    image: require("../../assets/images/sample-site.webp"),
    userName: "Jane Smith",
    location: "South Fundidor",
    timestamp: "2d ago",
    status: "WARNING",
  },
  {
    id: "5",
    image: require("../../assets/images/sample-site.webp"),
    userName: "Jane Smith",
    location: "Molo",
    timestamp: "3d ago",
    status: "WARNING",
  },
  {
    id: "6",
    image: require("../../assets/images/sample-site.webp"),
    userName: "Jane Smith",
    location: "Calumpang",
    timestamp: "3d ago",
    status: "WARNING",
  },
];

const HISTORY_DATA: HistoryReport[] = [
  {
    id: "1",
    location: "Brgy. Calumpang, Iloilo City",
    date: "February 14, 2026",
    image: require("../../assets/images/sample-site.webp"),
    isUrgent: true,
  },
  {
    id: "2",
    location: "Brgy. Calumpang, Iloilo City",
    date: "February 14, 2026",
    image: require("../../assets/images/sample-site.webp"),
    isUrgent: true,
  },
  {
    id: "3",
    location: "Brgy. Calumpang, Iloilo City",
    date: "February 14, 2026",
    image: require("../../assets/images/sample-site.webp"),
    isUrgent: true,
  },
];

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<"Community" | "My Reports">(
    "Community",
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          onPress={() => setActiveTab("Community")}
          style={[styles.tab, activeTab === "Community" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Community" && styles.activeTabText,
            ]}
          >
            Community
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("My Reports")}
          style={[styles.tab, activeTab === "My Reports" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "My Reports" && styles.activeTabText,
            ]}
          >
            My Reports
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "Community" ? (
        <FlatList
          data={COMMUNITY_DATA}
          key={"community-list"} // Unique key for grid mode
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <PostCard
              {...item}
              userAvatar="https://via.placeholder.com/100"
              isFullWidth={index < 2}
              status={item.status} // No longer errors due to strict interface
            />
          )}
        />
      ) : (
        <FlatList
          data={HISTORY_DATA}
          key={"history-list"} // Unique key for list mode
          numColumns={1}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <ReportStatsCard
                total={25}
                resolved={7}
                active={10}
                pending={8}
              />
              <Text style={styles.sectionTitle}>REPORT HISTORY</Text>
            </>
          }
          renderItem={({ item }) => (
            <HistoryItemCard
              {...item}
              onPress={() => console.log("Pressed report", item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F9",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 30,
    marginVertical: 15,
    borderRadius: 30,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 26,
  },
  activeTab: {
    backgroundColor: "#5B58E1",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter_500Medium",
  },
  activeTabText: {
    color: "white",
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 120, // Space for floating bottom nav
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexWrap: "wrap",
  },
});
