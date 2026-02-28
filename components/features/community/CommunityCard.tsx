import { MapPin, MessageCircle, Share2, ThumbsUp } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PostCard({
  image,
  userName,
  userAvatar,
  location,
  timestamp,
  status,
  isFullWidth,
  onPress,
}: any) {
  const cardWidth = isFullWidth ? width - 24 : (width - 50) / 2;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.card, { width: cardWidth }]}
    >
      <View style={styles.userHeader}>
        <Image source={userAvatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.locRow}>
            <Text style={styles.timeText}>{timestamp}</Text>
            <Text style={styles.dotSeparator}> • </Text>
            <MapPin size={10} color="#65676B" />
            <Text style={styles.locText} numberOfLines={1}>{location}</Text>
          </View>
        </View>
        <View
          style={status === "CRITICAL" ? styles.criticalBadge : styles.warningBadge}
        >
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>

      <Image source={image} style={styles.mainImage} />

      <View style={styles.socialBar}>
        <TouchableOpacity style={styles.socialAction}>
          <ThumbsUp size={18} color="#65676B" />
          <Text style={styles.socialText}>Helpful</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialAction}>
          <MessageCircle size={18} color="#65676B" />
          <Text style={styles.socialText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialAction}>
          <Share2 size={18} color="#65676B" />
          <Text style={styles.socialText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  userHeader: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F0F2F5",
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1E21",
    fontFamily: "Manrope_700Bold",
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: "#65676B",
  },
  dotSeparator: {
    fontSize: 11,
    color: "#65676B",
  },
  locText: {
    fontSize: 11,
    color: "#65676B",
    marginLeft: 2,
    flex: 1,
  },
  criticalBadge: {
    backgroundColor: "#FF5A5F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  warningBadge: {
    backgroundColor: "#FACC15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "800",
  },
  mainImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#F0F2F5",
  },
  socialBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
  },
  socialAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#65676B",
    fontWeight: "600",
  },
});