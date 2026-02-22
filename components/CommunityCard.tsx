import { MapPin } from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface PostCardProps {
  image: ImageSourcePropType;
  userName: string;
  userAvatar: string;
  location: string;
  timestamp: string;
  status: "CRITICAL" | "WARNING";
  isFullWidth: boolean;
}

export default function PostCard({
  image,
  userName,
  userAvatar,
  location,
  timestamp,
  status,
  isFullWidth,
}: PostCardProps) {
  const cardWidth = isFullWidth ? width - 40 : (width - 50) / 2;

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      {/* 1. Image gets flex: 1 to occupy top space */}
      <View style={styles.imageContainer}>
        <Image
          source={typeof image === "string" ? { uri: image } : image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* 2. ContentRow stays at the bottom with a fixed height */}
      <View style={styles.contentRow}>
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.userName} numberOfLines={1}>
              {userName}
            </Text>
            <View style={styles.subRow}>
              <MapPin size={10} color="#6B7280" />
              <Text style={styles.subText} numberOfLines={1}>
                {location} • {timestamp}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statusContainer}>
          {status === "CRITICAL" ? (
            <View style={styles.criticalBadge}>
              <Text style={styles.criticalText}>CRITICAL</Text>
            </View>
          ) : (
            <View style={styles.warningCircle} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 180, // Total height remains 180
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    flex: 1, // This pushes the content row to the bottom
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentRow: {
    height: 60, // Set fixed height to ensure it is visible
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.8, // Take most of the row
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  textContainer: {
    marginLeft: 8,
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  subText: {
    fontSize: 9,
    color: "#6B7280",
    marginLeft: 2,
  },
  statusContainer: {
    flex: 0.2,
    alignItems: "flex-end",
  },
  criticalBadge: {
    backgroundColor: "#FF5A5F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  criticalText: {
    color: "#FFF",
    fontSize: 8,
    fontWeight: "900",
  },
  warningCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF6B00",
    borderWidth: 2,
    borderColor: "#FFF",
  },
});
