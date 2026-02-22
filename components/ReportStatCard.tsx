import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatsProps {
  total: number;
  resolved: number;
  active: number;
  pending: number;
}

export default function ReportStatsCard({
  total,
  resolved,
  active,
  pending,
}: StatsProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.totalNumber}>{total}</Text>
      <Text style={styles.totalLabel}>TOTAL REPORTS</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#4ADE80" }]}>
            {resolved}
          </Text>
          <Text style={styles.statLabel}>resolved</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#FF5A5F" }]}>
            {active}
          </Text>
          <Text style={styles.statLabel}>active</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#FACC15" }]}>
            {pending}
          </Text>
          <Text style={styles.statLabel}>pending</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    // Soft drop shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  totalNumber: {
    fontSize: 56,
    fontWeight: "800",
    color: "#5B58E1",
    lineHeight: 60,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E0",
  },
});
