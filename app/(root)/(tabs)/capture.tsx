import CapturePreview from "@/components/features/capture/CapturePreview";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  Aperture,
  Camera,
  CheckCircle,
  Droplets,
  Image as ImageIcon,
  Info,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ImageMetadata {
  timestamp: string;
  location: string;
}

export default function CaptureScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isSourceModalVisible, setIsSourceModalVisible] = useState(false);
  const snackbarAnim = useRef(new Animated.Value(0)).current;

  const triggerSnackbar = () => {
    setShowSnackbar(true);
    Animated.sequence([
      Animated.timing(snackbarAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(snackbarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSnackbar(false));
  };

  const getGeotag = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is needed for geotagging.");
        return "Unknown Location";
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const item = reverseGeocode[0];
        const barangay = item.name || item.street || "";
        const district = item.district || item.subregion || "";
        const city = item.city || "";

        return [barangay, district, city].filter(Boolean).join(", ");
      }
      return "Unknown Location";
    } catch (error) {
      console.error(error);
      return "Location Error";
    }
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      setLoading(true);

      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permission Denied", `You need to allow ${useCamera ? "camera" : "gallery"} access.`);
        setLoading(false);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          quality: 1,
        })
        : await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          quality: 1,
        });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        const timestamp = new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const locationStr = await getGeotag();
        setMetadata({ timestamp, location: locationStr });
        triggerSnackbar();
        setIsSourceModalVisible(false);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while picking the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      Alert.alert("Analysis Complete", "Your image has been successfully processed by our AI models.", [
        { text: "View Results", onPress: () => router.push("/reports") },
      ]);
    }, 2000);
  };

  const resetCapture = () => {
    setImage(null);
    setMetadata(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Fetching metadata...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.mainActionCard}
            onPress={() => setIsSourceModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.mainIconCircle}>
              <View style={styles.iconStack}>
                <Aperture color="white" size={32} strokeWidth={1.5} />
                <View style={styles.sparkleOverlay}>
                  <Sparkles color="white" size={13} fill="white" />
                </View>
              </View>
            </View>
            <Text style={styles.uploadTitle}>Upload Image</Text>
            <Text style={styles.uploadSubtitle}>stagnant water should be visible if possible</Text>
          </TouchableOpacity>

          <View style={styles.guidelinesSection}>
            <View style={styles.sectionHeader}>
              <Info size={20} color="#4F46E5" />
              <Text style={styles.sectionTitle}>Submission Guidelines</Text>
            </View>

            <View style={styles.guidelineCard}>
              <View style={[styles.guideIconBg, { backgroundColor: '#EEF2FF' }]}>
                <Droplets size={22} color="#4F46E5" />
              </View>
              <View style={styles.guideTextWrapper}>
                <Text style={styles.guideTitle}>Clear Visibility</Text>
                <Text style={styles.guideDesc}>Ensure stagnant water or potential breeding spots are centered and clear.</Text>
              </View>
            </View>

            <View style={styles.guidelineCard}>
              <View style={[styles.guideIconBg, { backgroundColor: '#F5F3FF' }]}>
                <ScanSearch size={22} color="#7C3AED" />
              </View>
              <View style={styles.guideTextWrapper}>
                <Text style={styles.guideTitle}>AI Processing</Text>
                <Text style={styles.guideDesc}>Our models work best with natural lighting and unblurred captures.</Text>
              </View>
            </View>

            <View style={styles.guidelineCard}>
              <View style={[styles.guideIconBg, { backgroundColor: '#F0FDF4' }]}>
                <ShieldCheck size={22} color="#10B981" />
              </View>
              <View style={styles.guideTextWrapper}>
                <Text style={styles.guideTitle}>Verification</Text>
                <Text style={styles.guideDesc}>Every report is automatically geotagged to help local health units respond faster.</Text>
              </View>
            </View>
          </View>

          {showSnackbar && (
            <Animated.View
              style={[
                styles.snackbar,
                {
                  transform: [
                    {
                      translateY: snackbarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [100, 0],
                      }),
                    },
                  ],
                  opacity: snackbarAnim,
                },
              ]}
            >
              <CheckCircle color="white" size={20} />
              <Text style={styles.snackbarText}>File added successfully!</Text>
            </Animated.View>
          )}
        </ScrollView>
      ) : (
        <CapturePreview
          image={image}
          metadata={metadata}
          onReset={resetCapture}
          onAnalyze={handleAnalyze}
          analyzing={analyzing}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSourceModalVisible}
        onRequestClose={() => setIsSourceModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSourceModalVisible(false)}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Submit Evidence</Text>
                <Text style={styles.modalSubtitle}>Choose a source for your image</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsSourceModalVisible(false)}
              >
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptions}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => pickImage(true)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIconBg, { backgroundColor: '#EEF2FF' }]}>
                  <Camera color="#4F46E5" size={24} />
                </View>
                <View style={styles.optionTextContent}>
                  <Text style={styles.optionTitle}>Take Photo</Text>
                  <Text style={styles.optionDesc}>Capture evidence in real-time</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionItem, { marginTop: 12 }]}
                onPress={() => pickImage(false)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIconBg, { backgroundColor: '#F5F3FF' }]}>
                  <ImageIcon color="#7C3AED" size={24} />
                </View>
                <View style={styles.optionTextContent}>
                  <Text style={styles.optionTitle}>Upload from Gallery</Text>
                  <Text style={styles.optionDesc}>Choose an existing file</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontFamily: "Inter_500Medium",
  },
  mainActionCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 32,
  },
  mainIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconStack: {
    position: "relative",
  },
  sparkleOverlay: {
    position: "absolute",
    top: -6,
    right: -8,
  },
  uploadTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#4F46E5",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    textAlign: "center",
  },
  guidelinesSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#1E293B",
  },
  guidelineCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  guideIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  guideTextWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  guideTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#1E293B",
    marginBottom: 2,
  },
  guideDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    lineHeight: 18,
  },
  snackbar: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  snackbarText: {
    color: "white",
    fontFamily: "Inter_600SemiBold",
    marginLeft: 10,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#1E293B",
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptions: {
    gap: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  optionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContent: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#1E293B",
  },
  optionDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#64748B",
  },
});
