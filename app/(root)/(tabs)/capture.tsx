import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics"; // Essential for modern UX
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  AlertCircle,
  Camera,
  Image as ImageIcon,
  MapPin,
  Zap
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CapturePreview from "@/components/features/capture/CapturePreview";

const { width } = Dimensions.get("window");

export default function CaptureScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);

  // Animation for the "Scanning" effect during loading
  const scanAnim = useRef(new Animated.Value(0)).current;

  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  };

  const handleCapture = async (useCamera: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    startLoadingAnimation();

    try {
      const { granted } = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!granted) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });

      if (!result.canceled) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        let locationName = "Unknown Location";

        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const rev = await Location.reverseGeocodeAsync(loc.coords);
          locationName = rev[0] ? `${rev[0].street}, ${rev[0].city}` : "Location Tagged";
        }

        setImage(result.assets[0].uri);
        setMetadata({
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: locationName
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loaderContent}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingTitle}>Analyzing Environment</Text>
          <Text style={styles.loadingSub}>Fetching geotags and optimizing image...</Text>
        </View>
      </View>
    );
  }

  if (image) {
    return <CapturePreview image={image} metadata={metadata} onReset={() => setImage(null)} />;
  }

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.mainTitle}>Report Breeding Site</Text>
        <Text style={styles.mainSubtitle}>
          Your report helps local health units target mosquito-prone areas in real-time.
        </Text>

        {/* Dual Primary Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.primaryAction, styles.cameraAction]}
            onPress={() => handleCapture(true)}
          >
            <View style={styles.iconCircle}>
              <Camera color="#FFF" size={32} />
            </View>
            <Text style={styles.actionLabel}>Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryAction, styles.galleryAction]}
            onPress={() => handleCapture(false)}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#F1F5F9' }]}>
              <ImageIcon color="#475569" size={32} />
            </View>
            <Text style={[styles.actionLabel, { color: '#475569' }]}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Tips Section */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <Zap size={20} color="#6366F1" />
            <View style={styles.tipTextContent}>
              <Text style={styles.tipTitle}>Quick Tip</Text>
              <Text style={styles.tipDesc}>Keep the water surface in focus for better AI detection.</Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <MapPin size={20} color="#6366F1" />
            <View style={styles.tipTextContent}>
              <Text style={styles.tipTitle}>Auto-Geotag</Text>
              <Text style={styles.tipDesc}>We'll automatically record the location for health responders.</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Safety Notice Footer */}
      <BlurView intensity={80} tint="light" style={styles.footerInfo}>
        <AlertCircle size={16} color="#64748B" />
        <Text style={styles.footerText}>Stay safe. Do not enter hazardous areas to take photos.</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -1,
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
    lineHeight: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 40,
  },
  primaryAction: {
    flex: 1,
    height: 160,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraAction: {
    backgroundColor: '#6366F1',
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  galleryAction: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tipsContainer: {
    marginTop: 40,
    gap: 16,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    alignItems: 'center',
  },
  tipTextContent: {
    marginLeft: 16,
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  tipDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  footerInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContent: {
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 24,
  },
  loadingSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  }
});