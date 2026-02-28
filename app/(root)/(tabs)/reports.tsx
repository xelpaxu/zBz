import ReportStatsCard from "@/components/features/reports/ReportStatCard";
import { useRouter } from "expo-router";
import { AlertCircle, ArrowRight, ChevronRight, Flame, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

const COMMUNITY_DATA = [
  {
    id: "1",
    image: require("../../../assets/images/sample-site.webp"),
    userName: "John Doesena",
    location: "Calumpang, Iloilo City",
    timestamp: "1d ago",
    status: "CRITICAL",
  },
  {
    id: "2",
    image: require("../../../assets/images/sample-site.webp"),
    userName: "John Doe",
    location: "Molo, Iloilo City",
    timestamp: "1d ago",
    status: "CRITICAL",
  },
  {
    id: "3",
    image: require("../../../assets/images/sample-site.webp"),
    userName: "John Doe",
    location: "Molo, Iloilo City",
    timestamp: "1d ago",
    status: "CRITICAL",
  },
  {
    id: "4",
    image: require("../../../assets/images/sample-site.webp"),
    userName: "John Doe",
    location: "Molo, Iloilo City",
    timestamp: "1d ago",
    status: "CRITICAL",
  },
];

const MY_REPORTS_HISTORY = [
  {
    id: "1",
    location: "Brgy. Calumpang, Iloilo City",
    date: "Feb 14, 2026",
    image: require("../../../assets/images/sample-site.webp"),
    status: "Pending",
    isUrgent: true,
  },
  {
    id: "2",
    location: "Mandurriao, Iloilo City",
    date: "Feb 12, 2026",
    image: require("../../../assets/images/sample-site.webp"),
    status: "Resolved",
    isUrgent: false,
  },
];

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<"Community" | "My Reports">("Community");
  const router = useRouter();

  const handleNavigateToDetails = (id: string) => {
    router.push({ pathname: "/report-details", params: { id: id } });
  };

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          onPress={() => setActiveTab("Community")}
          style={[styles.tab, activeTab === "Community" && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === "Community" && styles.activeTabText]}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("My Reports")}
          style={[styles.tab, activeTab === "My Reports" && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === "My Reports" && styles.activeTabText]}>My Reports</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "Community" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>Critical Community{'\n'}Reports</Text>
            <TouchableOpacity style={styles.iconCircle} onPress={() => router.push("/community-feed")}>
              <ArrowRight color="white" size={24} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>PRIORITY ALERTS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.8 + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.horizontalScroll}
          >
            {COMMUNITY_DATA.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => handleNavigateToDetails(item.id)}>
                <ImageBackground source={item.image} style={styles.highlightCard} imageStyle={{ borderRadius: 24 }}>
                  <View style={styles.cardOverlay}>
                    <View style={styles.badgeRow}>
                      <View style={styles.criticalBadge}>
                        <Flame size={12} color="#FF5A5F" fill="#FF5A5F" />
                        <Text style={styles.badgeText}>{item.status}</Text>
                      </View>
                    </View>
                    <View>
                      <View style={styles.locRow}>
                        <MapPin size={16} color="white" />
                        <Text style={styles.locText}>{item.location}</Text>
                      </View>
                      <Text style={styles.timeText}>Reported {item.timestamp}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          <ReportStatsCard total={25} resolved={7} active={10} pending={8} />

          <Text style={styles.sectionLabel}>URGENT NOTICES</Text>
          {MY_REPORTS_HISTORY.filter(r => r.isUrgent).map(report => (
            <TouchableOpacity key={report.id} style={styles.urgentCard} onPress={() => handleNavigateToDetails(report.id)}>
              <AlertCircle color="#EF4444" size={20} />
              <View style={styles.urgentContent}>
                <Text style={styles.urgentTitle}>Action Required</Text>
                <Text style={styles.urgentSubtitle}>{report.location}</Text>
              </View>
              <ChevronRight color="#EF4444" size={20} />
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionLabel}>RECENT REPORTS</Text>
          <View style={styles.historyContainer}>
            {MY_REPORTS_HISTORY.map((item) => (
              <TouchableOpacity key={item.id} style={styles.historyRow} onPress={() => handleNavigateToDetails(item.id)}>
                <Image source={item.image} style={styles.historyImage} />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyLoc} numberOfLines={1}>{item.location}</Text>
                  <Text style={styles.historyDate}>{item.date} • {item.status}</Text>
                </View>
                <View style={[styles.dot, { backgroundColor: item.status === 'Resolved' ? '#10B981' : '#F59E0B' }]} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingTop: Platform.OS === "ios" ? 60 : 20 },
  segmentedControl: { flexDirection: "row", backgroundColor: "#F1F5F9", marginHorizontal: 25, marginBottom: 15, borderRadius: 16, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 20 },
  activeTab: { backgroundColor: "#4F46E5", elevation: 2 },
  tabText: { fontSize: 14, color: "#64748B", fontFamily: "Manrope_600SemiBold" },
  activeTabText: { color: "white", fontWeight: "700" },
  scrollPadding: { paddingBottom: 100 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginTop: 10 },
  heroTitle: { fontSize: 32, fontFamily: "Manrope_800ExtraBold", color: "#0F172A", lineHeight: 38 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#5B58E1", justifyContent: 'center', alignItems: 'center' },
  sectionLabel: { fontSize: 12, letterSpacing: 1.2, color: "#94A3B8", fontWeight: "800", marginHorizontal: 25, marginTop: 25, marginBottom: 15 },
  horizontalScroll: { paddingLeft: 25, paddingRight: 10 },
  highlightCard: { width: width * 0.8, height: 420, marginRight: 20 },
  cardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 24, padding: 25, justifyContent: 'space-between' },
  badgeRow: { flexDirection: 'row' },
  criticalBadge: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: "900", color: "#FF5A5F", marginLeft: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center' },
  locText: { color: 'white', fontSize: 22, fontWeight: '800', marginLeft: 6 },
  timeText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, marginLeft: 22 },
  urgentCard: { backgroundColor: "#FFF1F0", marginHorizontal: 25, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "#FFA39E" },
  urgentContent: { flex: 1, marginLeft: 12 },
  urgentTitle: { color: "#CF1322", fontWeight: "800", fontSize: 14 },
  urgentSubtitle: { color: "#CF1322", fontSize: 12, opacity: 0.8 },
  historyContainer: { backgroundColor: "white", marginHorizontal: 25, borderRadius: 24, paddingVertical: 10, elevation: 1 },
  historyRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  historyImage: { width: 50, height: 50, borderRadius: 12 },
  historyInfo: { flex: 1, marginLeft: 15 },
  historyLoc: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  historyDate: { fontSize: 12, color: "#64748B", marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 }
});