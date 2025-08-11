// app/scanned-profile.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { API_URL } from "../../constants/api";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../../components/BackButton";

export default function ScannedProfile() {
  const { userId } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/user/api/user/profile/${userId}`);
      setProfile(res.data);
    } catch (error) {
      console.error(
        "Scanned profile fetch error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2b74e2" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <BackButton/>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileRow}>
          <View style={styles.profileDetails}>
            <Text style={styles.name}>@{profile.username || "No Name"}</Text>
            {/* Bio */}
            <Text style={styles.bio}>{profile.bio || "No bio yet"}</Text>

            <Text style={styles.joinedDateText}>
              Joined{" "}
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>

          <Image
            source={{
              uri: profile.profile_picture || "https://i.imgur.com/0CE7jHL.png",
            }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Social Links */}
      <View style={styles.linksSection}>
        <Text style={styles.sectionTitle}>Social Links</Text>

        {profile.social_links.length > 0 ? (
          profile.social_links.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={styles.linkCard}
              onPress={() => Linking.openURL(link.link_url)}
            >
              <View style={styles.linkContent}>
                {getPlatformIcon(link.platform_name)}
                <View style={styles.linkTextContainer}>
                  <Text style={styles.linkPlatform}>{link.platform_name}</Text>
                  <Text style={styles.linkUrl} numberOfLines={1}>
                    {link.link_url}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#2b74e2" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyLinks}>
            <Ionicons name="link-outline" size={32} color="#2b74e2" />
            <Text style={styles.emptyLinksText}>No links added</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Platform icons
const getPlatformIcon = (platform) => {
  const icons = {
    instagram: <Ionicons name="logo-instagram" size={20} color="#E1306C" />,
    twitter: <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />,
    facebook: <Ionicons name="logo-facebook" size={20} color="#1877F2" />,
    youtube: <Ionicons name="logo-youtube" size={20} color="#FF0000" />,
    tiktok: <Ionicons name="logo-tiktok" size={20} color="#000000" />,
    linkedin: <Ionicons name="logo-linkedin" size={20} color="#0077B5" />,
    github: <Ionicons name="logo-github" size={20} color="#000000" />,
    website: <Ionicons name="globe-outline" size={20} color="#8A2BE2" />,
    default: <Ionicons name="link-outline" size={20} color="#185dc4ff" />,
  };
  return icons[platform.toLowerCase()] || icons.default;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    // paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    elevation: 3,
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#000000" },
  profileSection: { padding: 20, backgroundColor: "#FFFFFF" },
  profileRow: { flexDirection: "row", alignItems: "flex-start" },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 0.3,
  },
  profileDetails: { flex: 1 },
  bio: { fontSize: 14, color: "#333", marginBottom: 12 },
  joinedDateText: { fontSize: 12, color: "#8A8F94", marginBottom: 8 },
  linksSection: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  linkCard: {
    backgroundColor: "#F8FAFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  linkTextContainer: { marginLeft: 12 },
  linkPlatform: { color: "#000000", fontWeight: "600", fontSize: 14 },
  linkUrl: { color: "#555555", fontSize: 12, marginTop: 2 },
  emptyLinks: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#F8FAFF",
    borderRadius: 10,
  },
  emptyLinksText: { color: "#000000", fontSize: 16, marginTop: 12 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: { fontSize: 14, color: "#e2402b" },
});
