import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_URL } from "../../constants/api";
import QRCode from "react-native-qrcode-svg";

const Home = () => {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#37b6e9" />
      </View>
    );
  }

  const isComplete =
    profile?.full_name &&
    profile?.job_title &&
    profile?.bio &&
    profile?.username;

  const qrValue = isComplete
    ? `${API_URL}/user/${profile.username}`
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome, <Text style={styles.name}>{profile?.full_name || "User"}</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push(isComplete ? "/profile/edit" : "/profile/edit")
          }
        >
          <Text style={styles.primaryButtonText}>
            {isComplete ? "Edit Profile" : "Complete Your Profile"}
          </Text>
        </TouchableOpacity>

        {isComplete && (
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Your Profile QR Code:</Text>
            <QRCode value={qrValue} size={180} />
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1C24",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1A1C24",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  name: {
    color: "#37b6e9",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#37b6e9",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  primaryButtonText: {
    color: "#111111",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#222",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff4d4d",
    width: "100%",
  },
  logoutButtonText: {
    color: "#ff4d4d",
    fontWeight: "bold",
    fontSize: 16,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  qrTitle: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
