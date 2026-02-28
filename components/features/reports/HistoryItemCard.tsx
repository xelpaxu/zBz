import { Calendar, ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HistoryItemProps {
  image: ImageSourcePropType;
  location: string;
  date: string;
  isUrgent?: boolean;
  onPress?: () => void;
}

export default function HistoryItemCard({
  image,
  location,
  date,
  isUrgent,
  onPress,
}: HistoryItemProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={typeof image === "string" ? { uri: image } : image}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.locationText} numberOfLines={1}>
          {location}
        </Text>
        <View style={styles.dateRow}>
          <Calendar size={12} color="#6B7280" />
          <Text style={styles.dateText}>{date}</Text>
        </View>
        {isUrgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
      </View>

      <ChevronRight size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    // Matching the shadow in your screenshot
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 4,
  },
  urgentBadge: {
    backgroundColor: "#FF5A5F",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentText: {
    color: "white",
    fontSize: 8,
    fontWeight: "900",
  },
});
