import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Platform, Alert, Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useBrowser, Bookmark } from "@/context/BrowserContext";

const CATEGORY_COLORS: Record<string, string> = {
  Tech: "#47A4F5", Dev: "#1AD7D7", AI: "#C084FC",
  Design: "#F472B6", Media: "#FB923C", Default: "#8599AD",
};

export default function CollectionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookmarks, addBookmark, removeBookmark, addHistory } = useBrowser();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 100;
  const s = makeStyles(colors);

  const openBookmark = async (b: Bookmark) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addHistory({ url: b.url, title: b.title, timestamp: Date.now() });
    await WebBrowser.openBrowserAsync(b.url, { toolbarColor: colors.background, controlsColor: colors.primary });
  };

  const confirmDelete = (id: string, title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Remove Hub", `Remove "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeBookmark(id) },
    ]);
  };

  const handleAdd = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const url = newUrl.trim().startsWith("http") ? newUrl.trim() : `https://${newUrl.trim()}`;
    const b: Bookmark = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      url, title: newTitle.trim(), category: newCategory.trim() || "Default",
    };
    addBookmark(b);
    setNewTitle(""); setNewUrl(""); setNewCategory("");
    setShowAdd(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const catColor = (cat: string) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Default;

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: topPad + 16 }]}>
        <View>
          <Text style={[s.headerTitle, { color: colors.foreground }]}>Collections</Text>
          <Text style={[s.headerSub, { color: colors.mutedForeground }]}>{bookmarks.length} smart hubs</Text>
        </View>
        <TouchableOpacity style={[s.addBtn, { backgroundColor: colors.primary }]} onPress={() => setShowAdd(true)}>
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad, paddingTop: 8 }}
        scrollEnabled={bookmarks.length > 0}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="bookmark" size={36} color={colors.muted} />
            <Text style={[s.emptyText, { color: colors.mutedForeground }]}>No collections yet</Text>
            <Text style={[s.emptyHint, { color: colors.mutedForeground }]}>Tap + to add your first hub</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => openBookmark(item)}
            onLongPress={() => confirmDelete(item.id, item.title)}
            activeOpacity={0.75}
          >
            <View style={[s.catDot, { backgroundColor: catColor(item.category) + "33" }]}>
              <View style={[s.catDotInner, { backgroundColor: catColor(item.category) }]} />
            </View>
            <View style={s.cardInfo}>
              <Text style={[s.cardTitle, { color: colors.foreground }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[s.cardUrl, { color: colors.mutedForeground }]} numberOfLines={1}>
                {item.url.replace(/(^\w+:|^)\/\//, "")}
              </Text>
            </View>
            <View style={[s.catBadge, { backgroundColor: catColor(item.category) + "22" }]}>
              <Text style={[s.catBadgeText, { color: catColor(item.category) }]}>{item.category.toUpperCase()}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      />

      <Modal visible={showAdd} animationType="slide" transparent>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowAdd(false)} />
        <View style={[s.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[s.sheetTitle, { color: colors.foreground }]}>New Hub</Text>
          <TextInput
            style={[s.sheetInput, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
            placeholder="Title" placeholderTextColor={colors.mutedForeground}
            value={newTitle} onChangeText={setNewTitle}
          />
          <TextInput
            style={[s.sheetInput, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
            placeholder="URL (e.g. vercel.com)" placeholderTextColor={colors.mutedForeground}
            value={newUrl} onChangeText={setNewUrl} autoCapitalize="none" autoCorrect={false} keyboardType="url"
          />
          <TextInput
            style={[s.sheetInput, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
            placeholder="Category (optional)" placeholderTextColor={colors.mutedForeground}
            value={newCategory} onChangeText={setNewCategory}
          />
          <View style={s.sheetActions}>
            <TouchableOpacity style={[s.sheetBtn, { backgroundColor: colors.secondary }]} onPress={() => setShowAdd(false)}>
              <Text style={[s.sheetBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.sheetBtn, { backgroundColor: colors.primary }]} onPress={handleAdd}>
              <Text style={[s.sheetBtnText, { color: "#fff" }]}>Add Hub</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1 },
    header: {
      flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
      paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 28, fontWeight: "bold", fontFamily: "Inter_700Bold" },
    headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
    addBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    empty: { paddingTop: 80, alignItems: "center", gap: 8 },
    emptyText: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginTop: 8 },
    emptyHint: { fontSize: 13, fontFamily: "Inter_400Regular" },
    card: {
      flexDirection: "row", alignItems: "center", gap: 12,
      padding: 14, borderRadius: 14, borderWidth: 1, marginTop: 10,
    },
    catDot: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    catDotInner: { width: 10, height: 10, borderRadius: 5 },
    cardInfo: { flex: 1 },
    cardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
    cardUrl: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
    catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    catBadgeText: { fontSize: 9, fontWeight: "bold", letterSpacing: 1, fontFamily: "Inter_700Bold" },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
    sheet: {
      paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40,
      borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, gap: 12,
    },
    sheetTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 4 },
    sheetInput: {
      paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1,
      fontSize: 14, fontFamily: "Inter_400Regular",
    },
    sheetActions: { flexDirection: "row", gap: 10, marginTop: 4 },
    sheetBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: "center" },
    sheetBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  });
}
