import PostCard from "@/components/features/community/CommunityCard";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import {
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const COMMUNITY_DATA = [
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

export default function CommunityFeedScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Community Feed</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={COMMUNITY_DATA}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.feedContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <PostCard
                            {...item}
                            userAvatar={require("@/assets/images/joeross.jpg")}
                            isFullWidth={true}
                            onPress={() =>
                                router.push({
                                    pathname: "/report-details",
                                    params: { id: item.id },
                                })
                            }
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E9EBEE",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: Platform.OS === "ios" ? 50 : 25,
        paddingBottom: 15,
        backgroundColor: "#FFF",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#DDD",
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Manrope_700Bold",
        color: "#1F2937",
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    feedContent: {
        paddingVertical: 12,
    },
    cardContainer: {
        paddingHorizontal: 12,
        marginBottom: 8,
    },
});