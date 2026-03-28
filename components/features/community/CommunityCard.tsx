import {
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Share2,
  ThumbsUp,
} from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const C = {
  bg: "#0B0E14",
  surface: "#111520",
  surfaceRaised: "#161C2D",
  surfaceHigh: "#1C2438",
  border: "#1E2640",
  borderBright: "#2A3554",
  text: "#E8EDF8",
  textSub: "#697A9B",
  textDim: "#3C4A66",
  accent: "#4F8EF7",
  danger: "#FF4D6A",
  dangerGlow: "#FF4D6A18",
  dangerMid: "#FF4D6A45",
  safe: "#00C896",
  safeGlow: "#00C89618",
  safeMid: "#00C89645",
  warn: "#F5A623",
  warnGlow: "#F5A62318",
  warnMid: "#F5A62345",
};

const badgeCfg = (status: string) => {
  if (status === "CRITICAL")
    return { color: C.danger, glow: C.dangerGlow, mid: C.dangerMid };
  if (status === "LOW RISK" || status === "VERIFIED")
    return { color: C.safe, glow: C.safeGlow, mid: C.safeMid };
  return { color: C.warn, glow: C.warnGlow, mid: C.warnMid };
};

const SocialBtn = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <TouchableOpacity style={sb.btn} activeOpacity={0.65}>
    <Icon color={C.textDim} size={13} strokeWidth={2} />
    <Text style={sb.text}>{label}</Text>
  </TouchableOpacity>
);
const sb = StyleSheet.create({
  btn: { flexDirection: "row", alignItems: "center", gap: 5 },
  text: {
    fontSize: 11,
    color: C.textDim,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

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
  const cardWidth = isFullWidth ? width - 32 : (width - 52) / 2;
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.975,
      useNativeDriver: true,
      tension: 140,
      friction: 12,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 140,
      friction: 12,
    }).start();

  const imgSrc = typeof image === "string" ? { uri: image } : image;
  const avatarSrc =
    typeof userAvatar === "string" ? { uri: userAvatar } : userAvatar;
  const badge = badgeCfg(status);

  return (
    <Animated.View
      style={[styles.card, { width: cardWidth, transform: [{ scale }] }]}
    >
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        {/* IMAGE — clean, no text overlay */}
        <View style={styles.imgWrap}>
          <Image source={imgSrc} style={styles.img} resizeMode="cover" />

          {/* Status pill — top left */}
          <View
            style={[
              styles.pill,
              { backgroundColor: C.bg + "DD", borderColor: badge.mid },
            ]}
          >
            <View
              style={[
                styles.pillDot,
                { backgroundColor: badge.color, shadowColor: badge.color },
              ]}
            />
            <Text style={[styles.pillText, { color: badge.color }]}>
              {status}
            </Text>
          </View>

          {/* Timestamp — top right */}
          <View style={styles.tsChip}>
            <Clock color={C.textSub} size={9} strokeWidth={2.5} />
            <Text style={styles.tsText}>{timestamp}</Text>
          </View>
        </View>

        {/* META ROW — avatar + name + location + view cta */}
        <View style={styles.meta}>
          <Image source={avatarSrc} style={styles.avatar} />
          <View style={styles.metaBody}>
            <Text style={styles.userName} numberOfLines={1}>
              {userName}
            </Text>
            <View style={styles.locRow}>
              <MapPin color={C.accent} size={9} strokeWidth={2.5} />
              <Text style={styles.locText} numberOfLines={1}>
                {location}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onPress}
            style={styles.viewBtn}
            activeOpacity={0.8}
          >
            <ExternalLink color={C.bg} size={12} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* SOCIAL BAR — sits on slightly raised bg so it reads as a footer */}
        <View style={styles.socialBar}>
          <SocialBtn icon={ThumbsUp} label="Helpful" />
          <View style={styles.dot} />
          <SocialBtn icon={MessageCircle} label="Comment" />
          <View style={styles.dot} />
          <SocialBtn icon={Share2} label="Share" />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },

  imgWrap: {
    width: "100%",
    height: 200,
    backgroundColor: C.surfaceRaised,
    position: "relative",
  },
  img: { width: "100%", height: "100%" },

  pill: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 7,
    borderWidth: 1,
  },
  pillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 4,
    elevation: 4,
  },
  pillText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.9 },

  tsChip: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.bg + "DD",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  tsText: { fontSize: 10, color: C.textSub, fontWeight: "600" },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: C.surfaceRaised,
    borderWidth: 1,
    borderColor: C.borderBright,
  },
  metaBody: { flex: 1, gap: 4 },
  userName: { fontSize: 13, fontWeight: "800", color: C.text },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locText: { fontSize: 10, color: C.textSub, fontWeight: "500", flex: 1 },

  viewBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.accent,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },

  socialBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 11,
    backgroundColor: C.surfaceRaised,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.borderBright,
  },
});
