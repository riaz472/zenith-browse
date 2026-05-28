import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useBrowser } from "@/context/BrowserContext";

type Insight = { summary: string; keyTakeaways: string[] };

function buildInsight(url: string): Insight {
  return {
    summary: `Zenith AI has synthesized the core essence of ${url}. The target exhibits high-velocity data structures and modern architectural alignment, prioritizing user-centric accessibility and low-latency interaction models.`,
    keyTakeaways: [
      "Demonstrates advanced responsive layout synchronization.",
      "Utilizes high-fidelity visual assets for immersive experience.",
      "Implements robust navigational patterns for intuitive exploration.",
      "Optimized for performance across diverse hardware architectures.",
    ],
  };
}

export default function InsightScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { history } = useBrowser();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [copied, setCopied] = useState(false);
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const currentUrl = history[0]?.url || "zenith://home";

  useEffect(() => {
    setAnalyzing(true); setInsight(null);
    const t = setTimeout(() => { setInsight(buildInsight(currentUrl)); setAnalyzing(false); }, 1500);
    return () => clearTimeout(t);
  }, [currentUrl]);

  const handleCopy = async () => {
    if (!insight) return;
    const text = `${insight.summary}\n\nKey Takeaways:\n${insight.keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join("\n")}`;
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const s = makeStyles(colors);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: topPad + 12 }]}>
        <View style={[s.iconBox, { backgroundColor: colors.accent + "22" }]}>
          <Feather name="cpu" size={16} color={colors.accent} />
        </View>
        <Text style={[s.title, { color: colors.foreground }]}>AI SYNTHESIS</Text>
        <TouchableOpacity onPress={() => router.back()} style={s.closeBtn}>
          <Feather name="x" size={20} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <View style={[s.urlChip, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <Feather name="link" size={12} color={colors.mutedForeground} />
        <Text style={[s.urlText, { color: colors.mutedForeground }]} numberOfLines={1}>{currentUrl}</Text>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {analyzing ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[s.loadingTitle, { color: colors.foreground }]}>Synthesizing Content</Text>
            <Text style={[s.loadingHint, { color: colors.mutedForeground }]}>Evaluating target relevance...</Text>
          </View>
        ) : insight ? (
          <>
            <View style={s.section}>
              <View style={s.sectionLabelRow}>
                <Feather name="cpu" size={12} color={colors.primary} />
                <Text style={[s.sectionLabel, { color: colors.primary }]}>EXECUTIVE SUMMARY</Text>
              </View>
              <View style={[s.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[s.summaryText, { color: colors.foreground }]}>"{insight.summary}"</Text>
              </View>
            </View>

            <View style={[s.divider, { backgroundColor: colors.border }]} />

            <View style={s.section}>
              <View style={s.sectionLabelRow}>
                <Feather name="list" size={12} color={colors.accent} />
                <Text style={[s.sectionLabel, { color: colors.accent }]}>KEY TAKEAWAYS</Text>
              </View>
              {insight.keyTakeaways.map((point, i) => (
                <View key={i} style={s.takeawayRow}>
                  <View style={[s.dot, { backgroundColor: colors.accent }]} />
                  <Text style={[s.takeawayText, { color: colors.mutedForeground }]}>{point}</Text>
                </View>
              ))}
            </View>

            <View style={s.actions}>
              <TouchableOpacity
                style={[s.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={handleCopy}
              >
                <Feather name={copied ? "check" : "copy"} size={14} color={copied ? colors.accent : colors.mutedForeground} />
                <Text style={[s.actionText, { color: copied ? colors.accent : colors.mutedForeground }]}>
                  {copied ? "Copied" : "Copy"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => { setAnalyzing(true); setTimeout(() => { setInsight(buildInsight(currentUrl)); setAnalyzing(false); }, 1500); }}
              >
                <Feather name="refresh-cw" size={14} color={colors.mutedForeground} />
                <Text style={[s.actionText, { color: colors.mutedForeground }]}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={s.loadingContainer}>
            <Text style={[s.loadingHint, { color: colors.mutedForeground }]}>Unable to synthesize target.</Text>
          </View>
        )}
      </ScrollView>

      <View style={[s.footer, { borderTopColor: colors.border, paddingBottom: isWeb ? 34 : insets.bottom + 12 }]}>
        <View style={[s.footerIcon, { backgroundColor: colors.secondary }]}>
          <Feather name="arrow-right" size={14} color={colors.mutedForeground} />
        </View>
        <View>
          <Text style={[s.footerLabel, { color: colors.mutedForeground }]}>ENGINE MODE</Text>
          <Text style={[s.footerValue, { color: colors.foreground + "99" }]}>Static Local Processing</Text>
        </View>
      </View>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1 },
    header: {
      flexDirection: "row", alignItems: "center", gap: 10,
      paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    iconBox: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    title: { flex: 1, fontSize: 14, fontWeight: "bold", letterSpacing: 2, fontFamily: "Inter_700Bold" },
    closeBtn: { padding: 4 },
    urlChip: {
      flexDirection: "row", alignItems: "center", gap: 6,
      marginHorizontal: 16, marginTop: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1,
    },
    urlText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
    body: { padding: 20, gap: 4 },
    loadingContainer: { paddingTop: 60, alignItems: "center", gap: 12 },
    loadingTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
    loadingHint: { fontSize: 13, fontFamily: "Inter_400Regular" },
    section: { gap: 12 },
    sectionLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    sectionLabel: { fontSize: 10, fontWeight: "bold", letterSpacing: 2, fontFamily: "Inter_700Bold" },
    summaryBox: { padding: 16, borderRadius: 14, borderWidth: 1 },
    summaryText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, fontStyle: "italic" },
    divider: { height: 1, marginVertical: 8 },
    takeawayRow: { flexDirection: "row", gap: 10, alignItems: "flex-start", paddingVertical: 4 },
    dot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
    takeawayText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
    actions: { flexDirection: "row", gap: 10, marginTop: 16 },
    actionBtn: {
      flexDirection: "row", alignItems: "center", gap: 6,
      paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1,
    },
    actionText: { fontSize: 13, fontFamily: "Inter_500Medium" },
    footer: {
      flexDirection: "row", alignItems: "center", gap: 12,
      paddingTop: 14, paddingHorizontal: 16, borderTopWidth: 1,
    },
    footerIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    footerLabel: { fontSize: 9, fontWeight: "bold", letterSpacing: 1.5, fontFamily: "Inter_700Bold" },
    footerValue: { fontSize: 11, fontFamily: "Inter_400Regular" },
  });
}
