import { useRouter } from "expo-router";
import {
    ChevronLeft,
    Sparkles,
    TriangleAlert
} from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import "../../assets/images/sample-site.webp";

const { width } = Dimensions.get("window");

export default function ReportDetailsScreen() {
    const router = useRouter();

    const initialRegion = {
        latitude: 10.6966,
        longitude: 122.5455,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* 1. Header Navigation */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>

                {/* Applied Manrope Font here */}
                <Text style={styles.headerTitle}>Report Details</Text>

                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.topTimestamp}>August 15, 2026 | 10:25 AM</Text>

                <Image
                    source={require("../../assets/images/sample-site.webp")}
                    style={styles.heroImage}
                    resizeMode="cover"
                />

                {/* Risk Assessment Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.titleRow}>
                            <TriangleAlert color="#5B58E1" size={20} />
                            <Text style={styles.cardTitle}>Risk Assessment</Text>
                        </View>
                        <View style={styles.criticalBadge}>
                            <Text style={styles.criticalText}>CRITICAL</Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Breeding Site Class</Text>
                        <Text style={styles.value}>Stagnant, Pots</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.label}>Assessment Accuracy</Text>
                        <Text style={[styles.value, { color: "#10B981" }]}>96%</Text>
                    </View>
                    <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.label}>Site Population Density</Text>
                        <Text style={[styles.value, { color: "#EF4444" }]}>High Risk</Text>
                    </View>
                </View>

                {/* AI-assisted Reasoning Card */}
                <View style={styles.card}>
                    <View style={styles.titleRow}>
                        <Sparkles color="#5B58E1" size={20} />
                        <Text style={styles.cardTitle}>AI-assisted Reasoning</Text>
                    </View>
                    <View style={styles.aiContent}>
                        <Text style={styles.reasoningText}>
                            Reflection patterns consistent with stagnant water surfaces
                            detected. Therefore, this is a sample of an AI-assisted reasoning
                            which was done by LLM models got by the team via API.
                        </Text>
                    </View>
                </View>

                {/* Map Card */}
                <View style={styles.mapCard}>
                    <View style={styles.mapContainer}>
                        <MapView
                            provider={PROVIDER_DEFAULT}
                            style={styles.map}
                            initialRegion={initialRegion}
                            scrollEnabled={false}
                            zoomEnabled={false}
                        >
                            <Marker coordinate={initialRegion} pinColor="#5B58E1" />
                        </MapView>
                    </View>
                    <View style={styles.mapFooter}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.mapLocation}>Brgy. Calumpang, Iloilo City</Text>
                            <Text style={styles.mapSubtext}>Incident Location Preview</Text>
                        </View>
                        <TouchableOpacity style={styles.openMapBtn}>
                            <Text style={styles.openMapText}>Open Map</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7F9"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "ios" ? 50 : 25,
        paddingBottom: 15,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: "Manrope_700Bold", // Ensure this matches the name in your useFonts hook
        color: "#1F2937",
        letterSpacing: -0.5, // Manrope looks great with a tighter letter spacing
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 15
    },
    topTimestamp: {
        textAlign: "center",
        color: "#6B7280",
        fontSize: 12,
        marginBottom: 12,
        fontFamily: "Manrope_500Medium" // Optional: consistency for secondary text
    },
    heroImage: {
        width: "100%",
        height: 220,
        borderRadius: 20,
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    cardTitle: {
        marginLeft: 8,
        marginBottom: 5,
        fontSize: 16,
        fontFamily: "Manrope_700Bold",
        color: "#5B58E1",
    },
    criticalBadge: {
        backgroundColor: "#FF5A5F",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    criticalText: { color: "#FFF", fontSize: 10, fontWeight: "900" },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    label: { color: "#9CA3AF", fontSize: 14, fontFamily: "Manrope_400Regular" },
    value: { fontWeight: "700", color: "#374151" },
    aiContent: { flexDirection: "row" },
    reasoningText: { fontSize: 13, color: "#4B5563", lineHeight: 20, flex: 1 },
    mapCard: {
        backgroundColor: "#FFF",
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 16,
    },
    mapContainer: { width: "100%", height: 150 },
    map: { ...StyleSheet.absoluteFillObject },
    mapFooter: { flexDirection: "row", alignItems: "center", padding: 12 },
    mapLocation: { fontSize: 13, fontWeight: "700", color: "#1F2937" },
    mapSubtext: { fontSize: 10, color: "#9CA3AF", marginTop: 2 },
    openMapBtn: {
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    openMapText: { color: "#10B981", fontSize: 11, fontWeight: "700" },
});