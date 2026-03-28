import { useUser } from "@clerk/clerk-expo";
import { Tabs, useRouter } from "expo-router";
import { BarChart2, Bell, Map, ScanLine, Settings2 } from "lucide-react-native";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0B0E14",
  surface: "#111520",
  border: "#1E2640",
  text: "#E8EDF8",
  textSub: "#697A9B",
  textDim: "#3C4A66",
  accent: "#4F8EF7",
  accentGlow: "#4F8EF730",
};

// ─── Custom tab bar button (centre capture tab) ───────────────────────────────
const CaptureTabIcon = ({ focused }: { focused: boolean }) => (
  <View style={[ctb.outer, focused && ctb.outerActive]}>
    <View style={[ctb.inner, focused && ctb.innerActive]}>
      <ScanLine
        color={focused ? C.bg : C.textSub}
        size={35}
        strokeWidth={2.5}
      />
    </View>
  </View>
);
const ctb = StyleSheet.create({
  outer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 35,
  },
  outerActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
    shadowColor: C.accent,
    shadowOpacity: 0.55,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  inner: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  innerActive: { backgroundColor: "transparent" },
});

// ─── Custom tab icon wrapper ──────────────────────────────────────────────────
const TabIcon = ({
  Icon,
  focused,
  size = 20,
}: {
  Icon: React.ComponentType<any>;
  focused: boolean;
  size?: number;
}) => (
  <View style={[ti.wrap, focused && ti.wrapActive]}>
    <Icon
      color={focused ? C.accent : C.textDim}
      size={size}
      strokeWidth={focused ? 2.5 : 2}
    />
  </View>
);
const ti = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 25,
    gap: 4,
  },
  wrapActive: {
    backgroundColor: C.accentGlow,
  },
});

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function TabLayout() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,

        // ── Shared header ──────────────────────────────────────────────────
        header: ({ options }) => (
          <View style={styles.header}>
            {/* Avatar → settings */}
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => router.push("/settings")}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri:
                    user?.imageUrl ||
                    `https://ui-avatars.com/api/?name=User&background=1a2240&color=4F8EF7&bold=true`,
                }}
                style={styles.avatarImg}
              />
              {/* Online dot */}
              <View style={styles.onlineDot} />
            </TouchableOpacity>

            {/* Screen title */}
            <View style={styles.titleWrap}>
              <Text style={styles.headerTitle}>
                {options.title?.toUpperCase()}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable style={styles.iconBtn}>
                <Bell color={C.textSub} size={18} strokeWidth={2} />
              </Pressable>
              <Pressable
                style={styles.iconBtn}
                onPress={() => router.push("/settings")}
              >
                <Settings2 color={C.textSub} size={18} strokeWidth={2} />
              </Pressable>
            </View>
          </View>
        ),

        // ── Tab bar ────────────────────────────────────────────────────────
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.textDim,
        tabBarIconStyle: {
          marginTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map View",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Map} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: "Capture",
          tabBarIcon: ({ focused }) => <CaptureTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={BarChart2} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // ── Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.bg,
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  avatarBtn: {
    position: "relative",
    width: 38,
    height: 38,
  },
  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  onlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00C896",
    borderWidth: 2,
    borderColor: C.bg,
    shadowColor: "#00C896",
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 3,
    color: C.text,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Tab bar
  tabBar: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    height: 70,
    width: 350,
    marginLeft: 30,
    borderRadius: 50,
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    borderWidth: 1,
    borderColor: C.border,
    paddingBottom: 0,
    paddingTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
