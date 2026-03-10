import { analyzeImage } from "@/services/api_service";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Clock, MapPin, MessageSquareText, RotateCcw, Send, ShieldCheck, Sparkles } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Metadata {
    timestamp: string;
    location: string;
}

interface CapturePreviewProps {
    image: string;
    metadata: Metadata | null;
    onReset: () => void;
}

export default function CapturePreview({
    image,
    metadata,
    onReset,
}: CapturePreviewProps) {
    const router = useRouter();
    const [analyzing, setAnalyzing] = useState(false);
    const [description, setDescription] = useState("");

    const scanAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (analyzing) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanAnim, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scanAnim, {
                        toValue: 0,
                        duration: 2000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            scanAnim.setValue(0);
        }
    }, [analyzing]);

    const handleAnalyze = async () => {
        if (!description.trim()) {
            Alert.alert("Error", "Please add a description.");
            return;
        }

        setAnalyzing(true);
        try {
            const result = await analyzeImage(image, description);

            // WE REMOVED THE Alert.alert block here.
            // Even if result.verified is false, we proceed to the results screen.

            router.push({
                pathname: "/results",
                params: {
                    imageUri: image,
                    verified: String(result.verified),
                    accuracy: result.accuracy,
                    reasoning: result.reasoning,
                    detections: JSON.stringify(result.detections || []),
                    userNotes: description,
                    message: result.message,
                    processedImage: result.processed_image || ""
                }
            } as any);

        } catch (error) {
            Alert.alert("Connection Error", "Check your PC server connection.");
        } finally {
            setAnalyzing(false);
        }
    };

    const translateY = scanAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 400],
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.previewContainer}>
                    <View style={styles.headerInfo}>
                        <ShieldCheck size={18} color="#4F46E5" />
                        <Text style={styles.headerText}>Review Evidence</Text>
                    </View>

                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />

                        {analyzing && (
                            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]}>
                                <View style={styles.scanGlow} />
                            </Animated.View>
                        )}

                        <TouchableOpacity style={styles.resetBtn} onPress={onReset} activeOpacity={0.7}>
                            <RotateCcw color="white" size={20} />
                        </TouchableOpacity>

                        <BlurView intensity={80} tint="dark" style={styles.overlay}>
                            <View style={styles.metadataContent}>
                                <View style={styles.metadataRow}>
                                    <Clock color="#A5B4FC" size={14} />
                                    <Text style={styles.metadataText}>{metadata?.timestamp}</Text>
                                </View>
                                <View style={[styles.metadataRow, { marginTop: 6 }]}>
                                    <MapPin color="#A5B4FC" size={14} />
                                    <Text style={styles.locationText} numberOfLines={1}>
                                        {metadata?.location}
                                    </Text>
                                </View>
                            </View>
                        </BlurView>
                    </View>

                    <View style={styles.descriptionSection}>
                        <View style={styles.inputLabelRow}>
                            <MessageSquareText size={16} color="#64748B" />
                            <Text style={styles.inputLabel}>Site Description</Text>
                        </View>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Describe the stagnant water or container..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={3}
                            value={description}
                            onChangeText={setDescription}
                            editable={!analyzing}
                        />
                    </View>

                    <View style={styles.bottomActions}>
                        <TouchableOpacity
                            style={[styles.analyzeBtn, (analyzing || !description) && styles.disabledBtn]}
                            onPress={handleAnalyze}
                            disabled={analyzing}
                            activeOpacity={0.8}
                        >
                            {analyzing ? (
                                <View style={styles.loaderRow}>
                                    <ActivityIndicator color="white" style={{ marginRight: 10 }} />
                                    <Text style={styles.analyzeBtnText}>AI Processing...</Text>
                                </View>
                            ) : (
                                <>
                                    <Sparkles color="white" size={20} fill="white" style={{ marginRight: 10 }} />
                                    <Text style={styles.analyzeBtnText}>Analyze with AI</Text>
                                    <Send color="rgba(255,255,255,0.6)" size={16} style={{ marginLeft: 10 }} />
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={onReset} disabled={analyzing}>
                            <Text style={styles.cancelBtnText}>Discard & Retake</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { flexGrow: 1, backgroundColor: "#F8FAFC" },
    previewContainer: { flex: 1, padding: 24 },
    headerInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16, gap: 6, marginTop: 40 },
    headerText: { fontSize: 14, color: "#4F46E5", letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '600' },
    imageWrapper: { width: "100%", height: 400, borderRadius: 32, overflow: "hidden", backgroundColor: "#1E293B", position: "relative", elevation: 12 },
    previewImage: { width: "100%", height: "100%" },
    scanLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#4F46E5', zIndex: 10 },
    scanGlow: { height: 40, width: '100%', backgroundColor: 'rgba(79, 70, 229, 0.2)', marginTop: -20 },
    overlay: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 },
    metadataContent: { gap: 2 },
    metadataRow: { flexDirection: "row", alignItems: "center" },
    metadataText: { color: "white", fontSize: 13, marginLeft: 10 },
    locationText: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginLeft: 10, flex: 1 },
    resetBtn: { position: "absolute", top: 20, right: 20, width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(15, 23, 42, 0.6)", justifyContent: "center", alignItems: "center", zIndex: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
    descriptionSection: { marginTop: 24 },
    inputLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    inputLabel: { fontSize: 15, fontWeight: '600', color: '#475569' },
    textInput: { backgroundColor: 'white', borderRadius: 16, padding: 16, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0', textAlignVertical: 'top', minHeight: 100 },
    bottomActions: { marginTop: 24, gap: 12 },
    analyzeBtn: { height: 64, backgroundColor: "#4F46E5", borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", elevation: 8 },
    loaderRow: { flexDirection: 'row', alignItems: 'center' },
    analyzeBtnText: { color: "white", fontSize: 17, fontWeight: '700' },
    disabledBtn: { backgroundColor: "#94A3B8" },
    cancelBtn: { height: 56, justifyContent: "center", alignItems: "center" },
    cancelBtnText: { color: "#64748B", fontSize: 15, fontWeight: '600' },
});