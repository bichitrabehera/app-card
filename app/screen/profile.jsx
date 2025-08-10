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
        <Text style={styles.brandName}>TapCard</Text>

        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#e2402bff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          {/* Profile Picture */}
          <Image
            source={{
              uri: profile.profile_picture || "https://i.imgur.com/0CE7jHL.png",
            }}
            style={styles.profileImage}
          />

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.name}>{profile.username || "No Name"}</Text>
            {profile.full_name && (
              <Text style={styles.fullName}>{profile.full_name}</Text>
            )}

            {/* Joined Date */}
            <View style={styles.joinedDate}>
              <Text style={styles.joinedDateText}>
                Joined{" "}
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <Text style={styles.bio}>{profile.bio || "No bio yet"}</Text>

        {/* Contact Info */}
        <View style={styles.contactInfoContainer}>
          {/* Contact Info */}
          <View style={styles.contactInfo}>
            {profile.email && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL(`mailto:${profile.email}`)}
              >
                <View style={styles.contactIconContainer}>
                  <Ionicons name="mail-outline" size={18} color="#2b74e2" />
                </View>
                <Text style={styles.contactText}>{profile.email}</Text>
                <Ionicons name="open-outline" size={16} color="#555" />
              </TouchableOpacity>
            )}

            {profile.phone && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL(`tel:${profile.phone}`)}
              >
                <View style={styles.contactIconContainer}>
                  <Ionicons name="call-outline" size={18} color="#2b74e2" />
                </View>
                <Text style={styles.contactText}>{profile.phone}</Text>
                <Ionicons name="open-outline" size={16} color="#555" />
              </TouchableOpacity>
            )}
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    backgroundColor: "#000000",
  },
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222", // subtle divider
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 16,
  },

  brandName: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
    // textTransform: "uppercase",
    fontFamily: "cursive",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  centerContainer: {
    backgroundColor: "#000000",
  },
  profileSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  fullName: {
    fontSize: 15,
    color: "#bbb",
    marginBottom: 4,
  },
  joinedDateText: {
    fontSize: 12,
    color: "#888",
  },
  bio: {
    fontSize: 14,
    color: "white",
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 18,
  },
  contactInfoContainer: {
    marginTop: 8,
  },
  contactInfo: {
    marginBottom: 14,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  contactIconContainer: {
    marginRight: 10,
  },
  contactText: {
    flex: 1,
    color: "white",
    fontSize: 14,
  },
  editButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },

  linksSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  linkCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
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
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  linkUrl: {
    color: "#888888",
    fontSize: 12,
    marginTop: 2,
  },
  emptyLinks: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
  },
  emptyLinksText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 12,
  },
  emptyLinksSubtext: {
    color: "#888888",
    fontSize: 14,
    marginTop: 4,
  },
});
