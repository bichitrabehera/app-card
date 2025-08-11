import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { API_URL } from "../../constants/api";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef();

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (e) {
      console.error("Error fetching profile:", e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need gallery access to save the QR."
      );
      return;
    }
    try {
      const uri = await captureRef(qrRef, { format: "png", quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved!", "QR code saved to your gallery.");
    } catch (e) {
      console.error("Error saving QR:", e);
      Alert.alert("Error", "Failed to save QR code.");
    }
  };

  const shareQR = async () => {
    try {
      const uri = await captureRef(qrRef, { format: "png", quality: 0.8 });
      await Share.share({
        message: `Connect with me: ${API_URL}/user/${profile.id}`,
        url: uri,
        title: "TapCard QR",
      });
    } catch (e) {
      console.error("Error sharing:", e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (!profile) {
    router.replace("/auth/login");
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.brandName}>TapCard</Text> */}
      </View>

      <Text style={styles.title}>My QR Code</Text>

      <View style={styles.card} ref={qrRef} collapsable={false}>
        <Text style={styles.username}>@{profile.username}</Text>
        <QRCode
          value={`${API_URL}/user/${profile.id}`}
          size={200}
          color="#2C2E2F"
          backgroundColor="transparent"
        />
        <View style={styles.emailTag}>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Joined {new Date(profile.created_at).getFullYear()}
          </Text>
          <Text style={styles.footerText}>tapcard</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionLink,
            pressed && { backgroundColor: "#E3F2FD" },
          ]}
          onPress={shareQR}
        >
          <Ionicons name="share-outline" size={20} color="#1976D2" />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionLink,
            pressed && { backgroundColor: "#E3F2FD" },
          ]}
          onPress={downloadQR}
        >
          <Ionicons name="download-outline" size={20} color="#1976D2" />
          <Text style={styles.actionText}>Download</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FC", // ultra light blue
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: "space-between",
  },

  // Inside your stylesheet
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 20,
  },

  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C2E2F",
    marginBottom: 16,
    fontFamily: "System", // or your premium font
  },

  emailTag: {
    marginTop: 16,
    backgroundColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  email: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
  },

  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },

  footerText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },

  brandHeader: {
    alignItems: "center",
    paddingVertical: 10,
  },
  brandName: {
    fontSize: 36,
    // fontWeight: "800",
    color: "#000000ff",
    letterSpacing: 0.5,
    fontFamily: "cursive",
    fontWeight: "bold",
  },

  title: {
    fontSize: 22,
    fontWeight: "400",
    color: "#000000ff",
    textAlign: "center",
    marginVertical: 20,
  },

  emailText: {
    fontSize: 14,
    color: "#334155",
  },

  // Sticky Action Bar
  actions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 100,
  },

  actionLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#E8F4FB",
  },
  actionText: {
    color: "#0070BA",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
