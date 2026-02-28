import { useAuth, useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
    useWarmUpBrowser();
    const router = useRouter();
    const { isSignedIn, isLoaded } = useAuth();

    const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
    const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: "oauth_facebook" });

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.replace("/" as any);
        }
    }, [isSignedIn, isLoaded, router]);

    const onSelectAuth = useCallback(async (strategy: "google" | "facebook") => {
        const selectedAuth = strategy === "google" ? googleAuth : facebookAuth;

        try {
            const { createdSessionId, setActive } = await selectedAuth({
                redirectUrl: Linking.createURL("/", { scheme: "moskito" }),
            });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                router.replace("/" as any);
            }
        } catch (err) {
            console.error("OAuth Error:", err);
        }
    }, [googleAuth, facebookAuth, router]);

    if (!isLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join us and start your journey today</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.googleBtn}
                        onPress={() => onSelectAuth("google")}
                    >
                        <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.btnIcon} />
                        <Text style={styles.googleBtnText}>Sign up with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.fbBtn}
                        onPress={() => onSelectAuth("facebook")}
                    >
                        <Ionicons name="logo-facebook" size={24} color="#fff" style={styles.btnIcon} />
                        <Text style={styles.fbBtnText}>Sign up with Facebook</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Log In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: "center",
    },
    header: {
        marginBottom: 48,
    },
    title: {
        fontSize: 32,
        fontFamily: "Manrope_700Bold",
        color: "#111827",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Inter_400Regular",
        color: "#6B7280",
    },
    buttonContainer: {
        gap: 16,
    },
    googleBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    googleBtnText: {
        fontSize: 16,
        fontFamily: "Inter_500Medium",
        color: "#374151",
    },
    fbBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: "#1877F2",
    },
    fbBtnText: {
        fontSize: 16,
        fontFamily: "Inter_500Medium",
        color: "#fff",
    },
    btnIcon: {
        marginRight: 12,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 32,
    },
    footerText: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#6B7280",
    },
    linkText: {
        fontSize: 14,
        fontFamily: "Inter_500Medium",
        color: "#4F46E5",
    },
});
