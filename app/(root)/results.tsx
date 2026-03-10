import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, CheckCircle2, ChevronLeft, Sparkles, TriangleAlert } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Mapping params from the Server Response
    const imageUri = (params.imageUri as string);
    const aiMessage = (params.reasoning as string) || "Analysis pending or unavailable.";
    const accuracy = (params.accuracy as string) || "0%";
    const verified = params.verified === 'true';
    const processedImage = (params.processedImage as string) || "";

    // Use the base64 processed image if available, else original imageUri
    const displayImage = processedImage
        ? { uri: `data:image/jpeg;base64,${processedImage}` }
        : { uri: imageUri };

    // Parse detections if passed as a stringified array, or fallback to empty
    const detections = params.detections ? JSON.parse(params.detections as string) : [];

    // Extract unique labels for the "Breeding Site Class" row
    const siteClasses = detections.length > 0
        ? Array.from(new Set(detections.map((d: any) => d.label))).join(', ')
        : "None Detected";

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft color="#1E293B" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <Text style={styles.timestampText}>August 15, 2026 | 10:25 AM</Text>

            {/* Main Image */}
            <View style={styles.imageWrapper}>
                <Image source={displayImage} style={styles.mainImage} resizeMode="cover" />
            </View>

            {/* Card 1: Risk Assessment */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleRow}>
                        <TriangleAlert color="#4338CA" size={22} strokeWidth={2.5} />
                        <Text style={styles.cardTitle}>Risk Assessment</Text>
                    </View>
                    <View style={[styles.criticalBadge, !verified && { backgroundColor: '#64748B' }]}>
                        <Text style={styles.criticalBadgeText}>{verified ? "CRITICAL" : "LOW RISK"}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Breeding Site Class</Text>
                    <Text style={styles.rowValueBold}>{siteClasses}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Assessment Accuracy</Text>
                    <Text style={[styles.rowValueBold, { color: '#10B981' }]}>{accuracy}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Site Population Density</Text>
                    <Text style={[styles.rowValueBold, { color: verified ? '#EF4444' : '#10B981' }]}>
                        {verified ? "High Risk" : "Minimal Risk"}
                    </Text>
                </View>
            </View>

            {/* Card 2: AI-assisted Reasoning (Gemma 3 Data) */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleRow}>
                        <Sparkles color="#4338CA" size={22} strokeWidth={2.5} />
                        <Text style={styles.cardTitle}>AI-assisted Reasoning</Text>
                    </View>
                </View>
                <View style={styles.bulletPointRow}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.reasoningText}>{aiMessage}</Text>
                </View>
            </View>

            {/* Card 3: Location Map */}
            <View style={[styles.card, styles.mapCard]}>
                <Image
                    source={{ uri: 'https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg' }}
                    style={styles.mapImage}
                />
                <View style={styles.mapFooter}>
                    <View style={styles.mapTextContainer}>
                        <Text style={styles.mapLocationTitle}>Brgy. Calumpang, Iloilo City</Text>
                        <Text style={styles.mapLocationSub}>Coordinates captured from device GPS metadata.</Text>
                    </View>
                    <TouchableOpacity style={styles.openMapBtn}>
                        <Text style={styles.openMapBtnText}>Open Map</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Card 4: Submitter Profile */}
            <View style={[styles.card, styles.submitterCard]}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                    style={styles.avatarImage}
                />
                <View style={styles.submitterInfo}>
                    <Text style={styles.submitterLabel}>Submitted by:</Text>
                    <Text style={styles.submitterName}>Joeross Palabrica</Text>
                </View>
                {verified && <CheckCircle2 color="#4338CA" size={20} />}
            </View>

            {/* Card 5: Report Status Timeline */}
            <View style={[styles.card, { marginBottom: 40 }]}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleRow}>
                        <Activity color="#4338CA" size={22} strokeWidth={2.5} />
                        <Text style={styles.cardTitle}>Report Status Timeline</Text>
                    </View>
                </View>

                <View style={styles.timelineContainer}>
                    <View style={styles.timelineLine} />

                    <TimelineItem title="Report Submitted" date="Mar 5, 2026 | 9:15 AM" completed />
                    <TimelineItem title="AI & YOLO Verified" date="Mar 5, 2026 | 9:16 AM" completed />
                    <TimelineItem title="Human Verification" date="Pending Review" active />
                </View>
            </View>
        </ScrollView>
    );
}

// Reusable component for Timeline to keep code clean
const TimelineItem = ({ title, date, completed, active }: any) => (
    <View style={styles.timelineItem}>
        <View style={[
            styles.timelineNode,
            { backgroundColor: completed ? '#10B981' : active ? '#FACC15' : '#CBD5E1' }
        ]} />
        <View style={styles.timelineTextContainer}>
            <Text style={styles.timelineTitle}>{title}</Text>
            <Text style={styles.timelineDate}>{date}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    scrollContent: { paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 16 },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
    timestampText: { textAlign: 'center', color: '#64748B', fontSize: 12, marginBottom: 16 },
    imageWrapper: { width: '100%', height: 220, borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
    mainImage: { width: '100%', height: '100%' },
    card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    cardTitle: { fontSize: 16, fontWeight: '800', color: '#4338CA' },
    criticalBadge: { backgroundColor: '#FF4D4D', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 },
    criticalBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
    divider: { height: 1, backgroundColor: '#E2E8F0' },
    rowLabel: { fontSize: 13, color: '#64748B' },
    rowValueBold: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
    bulletPointRow: { flexDirection: 'row', alignItems: 'flex-start', paddingRight: 8 },
    bulletPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4338CA', marginTop: 6, marginRight: 10 },
    reasoningText: { flex: 1, fontSize: 13, color: '#64748B', lineHeight: 20 },
    mapCard: { padding: 0, overflow: 'hidden' },
    mapImage: { width: '100%', height: 120, backgroundColor: '#0F172A' },
    mapFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    mapTextContainer: { flex: 1, paddingRight: 12 },
    mapLocationTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
    mapLocationSub: { fontSize: 10, color: '#64748B' },
    openMapBtn: { backgroundColor: '#F0FDF4', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
    openMapBtnText: { color: '#16A34A', fontSize: 11, fontWeight: '700' },
    submitterCard: { backgroundColor: '#C7D2FE', flexDirection: 'row', alignItems: 'center', padding: 16 },
    avatarImage: { width: 44, height: 44, borderRadius: 22, marginRight: 16, borderWidth: 2, borderColor: '#FFFFFF' },
    submitterInfo: { flex: 1 },
    submitterLabel: { fontSize: 11, color: '#4F46E5', marginBottom: 2 },
    submitterName: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
    timelineContainer: { position: 'relative', paddingLeft: 10, marginTop: 8 },
    timelineLine: { position: 'absolute', left: 21, top: 8, bottom: 24, width: 2, backgroundColor: '#CBD5E1' },
    timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 32 },
    timelineNode: { width: 24, height: 24, borderRadius: 12, zIndex: 2 },
    timelineTextContainer: { marginLeft: 16, paddingTop: 2 },
    timelineTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
    timelineDate: { fontSize: 10, color: '#94A3B8' }
});