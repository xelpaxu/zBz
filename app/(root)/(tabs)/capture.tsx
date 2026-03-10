import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, Camera, Check, Image as ImageIcon, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function CaptureScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"main" | "success">("main");
  const [recentPhotos, setRecentPhotos] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const media = await MediaLibrary.getAssetsAsync({
          first: 4,
          mediaType: ["photo"],
          sortBy: ["creationTime"],
        });
        setRecentPhotos(media.assets.map((asset) => asset.uri));
      }
    })();
  }, []);

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setViewMode("success");
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setViewMode("success");
    }
  };

  return (
    <SafeAreaView style={[styles.mainContainer, viewMode === "success" && styles.mainContainerSuccess]}>
      <View style={{ paddingHorizontal: 24, zIndex: 1, elevation: 1, paddingTop: 40 }}>
        {/* Upload Card */}
        <TouchableOpacity style={[styles.uploadCard, viewMode === "success" && styles.uploadCardDimmed]} onPress={openGallery}>
          <View style={[styles.dashedCircle, viewMode === "success" && styles.dashedCircleDimmed]}>
            <Plus color={viewMode === "success" ? "#C7D2FE" : "#4F46E5"} size={28} strokeWidth={3} />
          </View>
          <Text style={[styles.uploadCardTitle, viewMode === "success" && styles.textDimmed]}>
            Upload a Document
          </Text>
          <Text style={[styles.uploadCardSubtitle, viewMode === "success" && styles.textDimmed]}>
            You can upload a document by importing or scanning with your camera
          </Text>
        </TouchableOpacity>

        {/* Buttons Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, viewMode === "success" && styles.actionBtnDimmed]}
            onPress={openGallery}
          >
            <ImageIcon color={viewMode === "success" ? "#C7D2FE" : "#4F46E5"} size={20} />
            <Text style={[styles.actionBtnText, viewMode === "success" && styles.textDimmed]}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, viewMode === "success" && styles.actionBtnDimmed]}
            onPress={openCamera}
          >
            <Camera color={viewMode === "success" ? "#C7D2FE" : "#4F46E5"} size={20} />
            <Text style={[styles.actionBtnText, viewMode === "success" && styles.textDimmed]}>Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Files */}
        <Text style={[styles.recentFilesTitle, viewMode === "success" && { opacity: 0.3 }]}>Your Recent Files</Text>
        <View style={styles.gridContainer}>
          {recentPhotos.length > 0 ? (
            recentPhotos.map((url, i) => (
              <Image
                key={i}
                source={{ uri: url }}
                style={[styles.gridImage, viewMode === "success" && { opacity: 0.3 }]}
              />
            ))
          ) : (
            <Text style={{ color: "#94A3B8", marginTop: 20 }}>No recent photos found.</Text>
          )}
        </View>
      </View>

      {/* Share Button Floating */}
      {viewMode === "main" && (
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={() => { }}>
            <ArrowRight color="#FFFFFF" size={18} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Success Modal overlay (Right screen) */}
      {viewMode === "success" && (
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheet}>
            <View style={styles.successCircle}>
              <Check color="#FFFFFF" size={32} strokeWidth={3} />
            </View>
            <Text style={styles.successTitle}>Upload Complete</Text>
            <Text style={styles.successSubtitle}>
              All selected files have been sucessfully Uploaded
            </Text>

            <View style={{ flex: 1 }} />

            <Text style={styles.uploadMoreText}>Want to upload more files?</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => { setViewMode("main"); setSelectedImage(null); }}>
              <ArrowLeft color="#FFFFFF" size={18} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mainContainerSuccess: {
    backgroundColor: "#A5B4FC", // Indigo 300 to match success theme background
  },
  uploadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  uploadCardDimmed: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  dashedCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#4F46E5", // Indigo 600
    borderStyle: "dashed",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  dashedCircleDimmed: {
    backgroundColor: "transparent",
    borderColor: "#818CF8", // Indigo 400
  },
  uploadCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  uploadCardSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionBtnDimmed: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
    opacity: 0.5,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  textDimmed: {
    color: "#4F46E5", // Stronger text color inside the button/headers
  },
  recentFilesTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridImage: {
    width: (width - 48 - 12) / 2, // 2 columns
    height: (width - 48 - 16) / 2 * 0.7, // Rectangular shapes
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#E2E8F0",
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5", // Indigo 600
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    gap: 8,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSheetContainer: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "flex-end",
    zIndex: 20,
    elevation: 20,
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 40,
    alignItems: "center",
    height: height * 0.45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4F46E5", // Indigo 600
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  uploadMoreText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5", // Indigo 600
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    gap: 8,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});