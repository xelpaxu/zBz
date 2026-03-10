import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsScreen() {
    const { signOut } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            router.replace("/(auth)/login" as any);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.profileSection}>
                    <Image
                        source={{
                            uri: user?.imageUrl || "https://via.placeholder.com/100",
                        }}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>
                        {user?.fullName || user?.username || "User"}
                    </Text>
                    <Text style={styles.userEmail}>
                        {user?.primaryEmailAddress?.emailAddress}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <View style={styles.logoutIconContainer}>
                            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                        </View>
                        <Text style={styles.logoutText}>Log Out</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 25,
        paddingBottom: 15,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Manrope_700Bold",
        color: "#111827",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    profileSection: {
        alignItems: "center",
        marginVertical: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        backgroundColor: "#E5E7EB",
    },
    userName: {
        fontSize: 24,
        fontFamily: "Manrope_700Bold",
        color: "#111827",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        fontFamily: "Inter_400Regular",
        color: "#6B7280",
    },
    section: {
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: "Inter_500Medium",
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FEE2E2",
    },
    logoutIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#FEF2F2",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    logoutText: {
        flex: 1,
        fontSize: 16,
        fontFamily: "Inter_500Medium",
        color: "#EF4444",
    },
});
