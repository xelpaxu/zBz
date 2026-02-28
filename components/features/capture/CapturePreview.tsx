import { BlurView } from "expo-blur";
import { Clock, MapPin, RotateCcw, Send } from "lucide-react-native";
import React from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
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
    onAnalyze: () => void;
    analyzing: boolean;
}

export default function CapturePreview({
    image,
    metadata,
    onReset,
    onAnalyze,
    analyzing,
}: CapturePreviewProps) {
    return (
        <View style={styles.previewContainer}>
            <View style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.previewImage} resizeMode="contain" />

                {/* Metadata Overlay */}
                <BlurView intensity={60} tint="dark" style={styles.overlay}>
                    <View style={styles.metadataRow}>
                        <Clock color="white" size={14} />
                        <Text style={styles.metadataText}>{metadata?.timestamp}</Text>
                    </View>
                    <View style={[styles.metadataRow, { marginTop: 4 }]}>
                        <MapPin color="white" size={14} />
                        <Text style={styles.metadataText} numberOfLines={1}>
                            {metadata?.location}
                        </Text>
                    </View>
                </BlurView>

                <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
                    <RotateCcw color="white" size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={[styles.analyzeBtn, analyzing && styles.disabledBtn]}
                    onPress={onAnalyze}
                    disabled={analyzing}
                >
                    {analyzing ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text style={styles.analyzeBtnText}>Analyze with AI</Text>
                            <Send color="white" size={18} style={{ marginLeft: 8 }} />
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={onReset}>
                    <Text style={styles.cancelBtnText}>Discard</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    previewContainer: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    imageWrapper: {
        width: "100%",
        aspectRatio: 3 / 4,
        borderRadius: 32,
        overflow: "hidden",
        backgroundColor: "#000",
        position: "relative",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 20,
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 25,
    },
    metadataRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    metadataText: {
        color: "white",
        fontSize: 13,
        fontFamily: "Inter_500Medium",
        marginLeft: 8,
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    resetBtn: {
        position: "absolute",
        top: 20,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    bottomActions: {
        marginTop: 32,
        gap: 12,
    },
    analyzeBtn: {
        height: 64,
        backgroundColor: "#4F46E5",
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    analyzeBtnText: {
        color: "white",
        fontSize: 18,
        fontFamily: "Inter_600SemiBold",
    },
    disabledBtn: {
        opacity: 0.7,
    },
    cancelBtn: {
        height: 56,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelBtnText: {
        color: "#6B7280",
        fontSize: 16,
        fontFamily: "Inter_500Medium",
    },
});
