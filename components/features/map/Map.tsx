import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  AlertTriangle,
  Crosshair,
  Eye,
  EyeOff,
  Map,
  Satellite,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from "react-native-maps";

// ─── Report shape — use Convex's generated Doc type directly ──────────────────
// This guarantees the interface always matches your schema with zero drift.
// Schema fields: userId, userName, description, imageUri, processedImage,
// reasoning, accuracy (string!), verified, detections, locationName,
// lat, lng, status
type Report = Doc<"reports">;

// ─── Derived risk-zone shape ───────────────────────────────────────────────────
interface RiskZone {
  id: string;
  lat: number;
  lng: number;
  radius: number;
  isCritical: boolean;
}

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0B0E14",
  surface: "#111520",
  surfaceRaised: "#161C2D",
  border: "#1E2640",
  text: "#E8EDF8",
  textSub: "#697A9B",
  textDim: "#3C4A66",
  accent: "#4F8EF7",
  accentGlow: "#4F8EF730",
  danger: "#FF4D6A",
  dangerGlow: "#FF4D6A22",
  safe: "#00C896",
  warning: "#fbbf24",
};

// ─── Map data ─────────────────────────────────────────────────────────────────
const INITIAL_LOCATION = {
  latitude: 10.684,
  longitude: 122.513,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

type MapMode = "vector" | "satellite";

// ─── Risk zone radius (metres around each verified hotspot) ──────────────────
const RISK_ZONE_RADIUS = 150;

// ─── Control pill button ──────────────────────────────────────────────────────
const PillBtn = ({
  onPress,
  active,
  icon: Icon,
  label,
}: {
  onPress: () => void;
  active?: boolean;
  icon: React.ComponentType<any>;
  label: string;
}) => (
  <Pressable onPress={onPress} style={[pill.btn, active && pill.btnActive]}>
    <Icon color={active ? C.bg : C.textSub} size={13} strokeWidth={2.5} />
    <Text style={[pill.text, active && pill.textActive]}>{label}</Text>
  </Pressable>
);

const pill = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnActive: {
    backgroundColor: C.accent,
    shadowColor: C.accent,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textSub,
    letterSpacing: 0.3,
  },
  textActive: { color: C.bg },
});

// ─── Icon toggle button (floating right panel) ────────────────────────────────
const FloatBtn = ({
  onPress,
  icon: Icon,
  active,
  color = C.accent,
}: {
  onPress: () => void;
  icon: React.ComponentType<any>;
  active?: boolean;
  color?: string;
}) => (
  <Pressable
    onPress={onPress}
    style={[
      fb.btn,
      active && { borderColor: color + "60", backgroundColor: color + "18" },
    ]}
  >
    <Icon color={active ? color : C.textSub} size={16} strokeWidth={2.5} />
  </Pressable>
);

const fb = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(17,21,32,0.92)",
    borderWidth: 1,
    borderColor: "rgba(30,38,64,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── Custom marker pin ────────────────────────────────────────────────────────
// Mirrors the web version: red for CRITICAL, amber for others
const PinMarker = ({ isCritical }: { isCritical: boolean }) => {
  const color = isCritical ? C.danger : C.warning;
  return (
    <View
      style={[
        pin.outer,
        {
          backgroundColor: color + "30",
          borderColor: color,
          shadowColor: color,
        },
      ]}
    >
      <View style={[pin.inner, { backgroundColor: color }]} />
    </View>
  );
};

const pin = StyleSheet.create({
  outer: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  inner: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});

// ─── Stats HUD ────────────────────────────────────────────────────────────────
const StatsHUD = ({ zones, markers }: { zones: number; markers: number }) => (
  <View style={hud.wrap}>
    <View style={hud.item}>
      <Text style={[hud.num, { color: C.danger }]}>{markers}</Text>
      <Text style={hud.label}>SITES</Text>
    </View>
    <View style={hud.div} />
    <View style={hud.item}>
      <Text style={[hud.num, { color: C.accent }]}>{zones}</Text>
      <Text style={hud.label}>ZONES</Text>
    </View>
  </View>
);

const hud = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17,21,32,0.92)",
    borderWidth: 1,
    borderColor: "rgba(30,38,64,0.9)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 10,
  },
  item: { alignItems: "center", gap: 2 },
  num: { fontSize: 16, fontWeight: "800" },
  label: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: C.textSub,
  },
  div: { width: 1, height: 24, backgroundColor: C.border },
});

// ─── Loading / empty state overlay ───────────────────────────────────────────
const StatusOverlay = ({ message }: { message: string }) => (
  <View style={so.wrap} pointerEvents="none">
    <Text style={so.text}>{message}</Text>
  </View>
);

const so = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    backgroundColor: "rgba(17,21,32,0.92)",
    borderWidth: 1,
    borderColor: "rgba(30,38,64,0.9)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: { color: C.textSub, fontSize: 11, fontWeight: "700" },
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MapComponent() {
  const [mode, setMode] = useState<MapMode>("vector");
  const [showZones, setShowZones] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const mapRef = useRef<MapView>(null);

  // ── Fetch live reports from Convex (same query as the web version) ──
  const allReports = useQuery(api.reports.getAllReports);

  // Mirror the web filter: verified reports that are not yet Completed
  const verifiedHotspots: Report[] =
    allReports?.filter((r: Report) => r.verified && r.status !== "Completed") ??
    [];

  // Derive risk zones from the same hotspot list (one zone per verified site)
  const riskZones: RiskZone[] = verifiedHotspots.map((r: Report) => ({
    id: r._id,
    lat: r.lat,
    lng: r.lng,
    radius: RISK_ZONE_RADIUS,
    isCritical: r.status === "CRITICAL",
  }));

  // Fade-in on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  // Re-centre map when hotspots first load
  useEffect(() => {
    if (verifiedHotspots.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        verifiedHotspots.map((r: Report) => ({
          latitude: r.lat,
          longitude: r.lng,
        })),
        {
          edgePadding: { top: 80, right: 60, bottom: 80, left: 60 },
          animated: true,
        },
      );
    }
  }, [verifiedHotspots.length]);

  const isSatellite = mode === "satellite";
  const isLoading = allReports === undefined;

  return (
    <View style={styles.root}>
      {/* ── MAP ── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_LOCATION}
        mapType={isSatellite ? "satellite" : "standard"}
        customMapStyle={isSatellite ? [] : darkMapStyle}
      >
        {/* Risk zones — one circle per verified hotspot */}
        {showZones &&
          riskZones.map((z: RiskZone) => (
            <Circle
              key={`zone-${z.id}`}
              center={{ latitude: z.lat, longitude: z.lng }}
              radius={z.radius}
              fillColor={
                z.isCritical ? "rgba(255,77,106,0.10)" : "rgba(251,191,36,0.10)"
              }
              strokeColor={
                z.isCritical ? "rgba(255,77,106,0.65)" : "rgba(251,191,36,0.65)"
              }
              strokeWidth={1.5}
            />
          ))}

        {/* Hotspot markers */}
        {showReports &&
          verifiedHotspots.map((r: Report) => (
            <Marker
              key={`marker-${r._id}`}
              coordinate={{ latitude: r.lat, longitude: r.lng }}
              title={r.locationName}
              description={`Status: ${r.status} · Accuracy: ${r.accuracy}%`}
            >
              <PinMarker isCritical={r.status === "CRITICAL"} />
            </Marker>
          ))}
      </MapView>

      <Animated.View style={[styles.overlays, { opacity: fadeAnim }]}>
        {/* ── TOP BAR — map mode toggle + stats ── */}
        <View style={styles.topBar}>
          <View style={styles.modeToggle}>
            <PillBtn
              icon={Map}
              label="Vector"
              active={mode === "vector"}
              onPress={() => setMode("vector")}
            />
            <PillBtn
              icon={Satellite}
              label="Satellite"
              active={mode === "satellite"}
              onPress={() => setMode("satellite")}
            />
          </View>

          <StatsHUD
            zones={showZones ? riskZones.length : 0}
            markers={showReports ? verifiedHotspots.length : 0}
          />
        </View>

        {/* ── RIGHT PANEL — layer toggles ── */}
        <View style={styles.rightPanel}>
          <FloatBtn
            icon={showZones ? Eye : EyeOff}
            active={showZones}
            color={C.danger}
            onPress={() => setShowZones((v) => !v)}
          />
          <FloatBtn
            icon={AlertTriangle}
            active={showReports}
            color={C.accent}
            onPress={() => setShowReports((v) => !v)}
          />
          <FloatBtn
            icon={Crosshair}
            color={C.safe}
            onPress={() => {
              if (verifiedHotspots.length > 0 && mapRef.current) {
                mapRef.current.fitToCoordinates(
                  verifiedHotspots.map((r: Report) => ({
                    latitude: r.lat,
                    longitude: r.lng,
                  })),
                  {
                    edgePadding: { top: 80, right: 60, bottom: 80, left: 60 },
                    animated: true,
                  },
                );
              }
            }}
          />
        </View>

        {/* ── BOTTOM LEGEND ── */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: C.danger, shadowColor: C.danger },
              ]}
            />
            <Text style={styles.legendText}>Critical</Text>
          </View>
          <View style={styles.legendDivider} />
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: C.warning, shadowColor: C.warning },
              ]}
            />
            <Text style={styles.legendText}>Active</Text>
          </View>
          <View style={styles.legendDivider} />
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendSwatch,
                { borderColor: C.danger + "80", backgroundColor: C.dangerGlow },
              ]}
            />
            <Text style={styles.legendText}>Risk Zone</Text>
          </View>
        </View>

        {/* ── Loading / empty feedback ── */}
        {isLoading && <StatusOverlay message="Loading hotspots…" />}
        {!isLoading && verifiedHotspots.length === 0 && (
          <StatusOverlay message="No verified hotspots found" />
        )}
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  overlays: {
    ...(StyleSheet.absoluteFillObject as any),
    pointerEvents: "box-none",
  },

  topBar: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  modeToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17,21,32,0.92)",
    borderWidth: 1,
    borderColor: "rgba(30,38,64,0.9)",
    borderRadius: 14,
    padding: 3,
    gap: 2,
  },

  rightPanel: {
    position: "absolute",
    right: 16,
    top: "40%",
    gap: 8,
  },

  legend: {
    position: "absolute",
    bottom: 36,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(17,21,32,0.92)",
    borderWidth: 1,
    borderColor: "rgba(30,38,64,0.9)",
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 7 },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  legendSwatch: {
    width: 16,
    height: 10,
    borderRadius: 3,
    borderWidth: 1.5,
  },
  legendText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.textSub,
    letterSpacing: 0.3,
  },
  legendDivider: { width: 1, height: 16, backgroundColor: C.border },
});

// ─── Dark map style ───────────────────────────────────────────────────────────
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0d1117" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a5568" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d1117" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#161c2d" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e2640" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3c4a66" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1e2a44" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2e3a5c" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#697a9b" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a1628" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#1e3a5f" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#0f1520" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#0d1a12" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#1a3320" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e2640" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2e3a5c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#111520" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#0d1117" }],
  },
];
