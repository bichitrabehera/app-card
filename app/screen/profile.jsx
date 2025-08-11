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
import { API_URL } from "../../constants/api";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchProfileData();
      fetchSocialLinks();
    }
  }, [token]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileRes = await axios.get(`${API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setProfile(profileRes.data);
    } catch (error) {
      console.error(
        "Profile fetch error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/social-links/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSocialLinks(res.data || []);
    } catch (error) {
      console.error(
        "Social links fetch error:",
        error.response?.data || error.message
      );
    }
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
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
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <Text style={styles.name}>@{profile.username || "No Name"}</Text>

        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#e2402bff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileRow}>
          {/* Left: Profile Picture */}

          {/* Right: User Details */}
          <View style={styles.profileDetails}>
            {/* <Text style={styles.username}>@{profile.username}</Text> */}

            {/* Bio */}
            <Text style={styles.bio}>{profile.bio || "No bio yet"}</Text>

            {/* Contact Info */}
            {profile.email && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL(`mailto:${profile.email}`)}
              >
                <Ionicons name="mail-outline" size={18} color="#0070BA" />
                <Text style={styles.contactText}>{profile.email}</Text>
              </TouchableOpacity>
            )}
            {profile.phone && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL(`tel:${profile.phone}`)}
              >
                <Ionicons name="call-outline" size={18} color="#0070BA" />
                <Text style={styles.contactText}>{profile.phone}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.joinedDateText}>
              Joined{" "}
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>

            {/* Edit Profile */}
          </View>

          <Image
            source={{
              uri: profile.profile_picture || "https://i.imgur.com/0CE7jHL.png",
            }}
            style={styles.profileImage}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={handleEditProfile}
        activeOpacity={0.8}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Links Section */}
      <View style={styles.linksSection}>
        <Text style={styles.sectionTitle}>My Links</Text>

        {socialLinks.length > 0 ? (
          socialLinks.map((link) => (
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
            <Text style={styles.emptyLinksSubtext}>
              Add your first link to get started
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Helper function for platform icons
const getPlatformIcon = (platform) => {
  const icons = {
    instagram: <Ionicons name="logo-instagram" size={20} color="#E1306C" />,
    twitter: <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />,
    facebook: <Ionicons name="logo-facebook" size={20} color="#1877F2" />,
    youtube: <Ionicons name="logo-youtube" size={20} color="#FF0000" />,
    tiktok: <Ionicons name="logo-tiktok" size={20} color="#000000" />,
    linkedin: <Ionicons name="logo-linkedin" size={20} color="#0077B5" />,
    website: <Ionicons name="globe-outline" size={20} color="#8A2BE2" />,
    default: <Ionicons name="link-outline" size={20} color="#185dc4ff" />,
  };
  return icons[platform.toLowerCase()] || icons.default;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Pure white background
  },

  profileSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 0.3,
  },
  profileDetails: {
    flex: 1,
  },
  fullName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000ff",
  },
  username: {
    fontSize: 14,
    color: "#6C7378",
    marginBottom: 4,
  },
  joinedDateText: {
    fontSize: 12,
    color: "#8A8F94",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#0070BA",
  },
  editButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#0070BA",
    borderRadius: 6,
    margin: 20,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  // Profile header row
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  userInfo: {
    flex: 1,
    justifyContent: "center",
  },

  joinedDate: {
    backgroundColor: "#eaf2ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  // Contact Info wrapper
  contactInfoContainer: {
    marginBottom: 20,
  },

  contactInfo: {
    gap: 10,
  },

  contactIconContainer: {
    backgroundColor: "#eaf2ff",
    padding: 6,
    borderRadius: 8,
    marginRight: 12,
  },

  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    elevation: 3,
  },

  brandName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.3,
  },

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

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },

  linksSection: {
    padding: 20,
  },

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

  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  linkTextContainer: {
    marginLeft: 12,
  },

  linkPlatform: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 14,
  },

  linkUrl: {
    color: "#555555",
    fontSize: 12,
    marginTop: 2,
  },

  emptyLinks: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#F8FAFF",
    borderRadius: 10,
  },

  emptyLinksText: {
    color: "#000000",
    fontSize: 16,
    marginTop: 12,
  },

  emptyLinksSubtext: {
    color: "#555555",
    fontSize: 14,
    marginTop: 4,
  },
});
