import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (error) {
      console.error(
        "Error fetching profile:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need access to save images to your gallery"
        );
        return;
      }

      const uri = await captureRef(qrRef, { format: "png", quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "QR code saved to your gallery");
    } catch (error) {
      console.error("Error saving QR:", error);
      Alert.alert("Error", "Failed to save QR code");
    }
  };

  const shareQR = async () => {
    try {
      const uri = await captureRef(qrRef, { format: "png", quality: 0.8 });
      await Share.share({
        message: `Connect with me on TapCard: ${API_URL}/user/${profile.id}`,
        url: uri,
        title: "My TapCard QR",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2b74e2" />
      </View>
    );
  }

  if (!profile) {
    router.replace("/auth/login");
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.brandHeader}>
        <Text style={styles.brandName}>TapCard</Text>
      </View>
      <Text style={styles.title}>My QR Code</Text>

      {/* Card with full height and spacing */}
      <View style={styles.card} ref={qrRef} collapsable={false}>
        {/* Top section */}
        <Text style={styles.name}>{profile.username}</Text>

        {/* Middle QR */}
        <QRCode
          value={`${API_URL}/user/${profile.id}`}
          size={250}
          color="#fff"
          backgroundColor="transparent"
        />

        {/* Bottom section */}
        <View style={{ alignItems: "center", width: "100%" }}>
          <View style={styles.emailTag}>
            <Text style={styles.emailText}>{profile.email}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Joined {new Date(profile.created_at).getFullYear()}
            </Text>
            <Text style={styles.footerText}>tapcard</Text>
          </View>
        </View>
      </View>

      {/* Bottom buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={shareQR}>
          <Ionicons name="share-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={downloadQR}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    // paddingTop: 16,
    paddingBottom: 24,
  },
  brandHeader: {
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  brandName: {
    fontSize: 30,
    fontFamily: "cursive",
    color: "#ffffffff",
    textAlign: "left",
    fontWeight: "bold",
    marginLeft: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    marginTop:20,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#ffffff"
  },
  card: {
    // flex: 1,
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    padding: 20,
  },
  emailTag: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 20,
    // padding: 20,
  },
  emailText: {
    color: "#fff",
    fontSize: 14,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderTopWidth: 0.5,
    borderTopColor: "#333",
    paddingTop: 8,
  },
  footerText: {
    color: "#888",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#111",
    borderRadius: 12,
    marginHorizontal: 6,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
});
