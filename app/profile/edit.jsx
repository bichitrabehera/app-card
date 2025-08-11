import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { API_URL } from "../../constants/api";
import BackButton from "../../components/BackButton";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfile() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    profile_picture: "",
    full_name: "",
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        const linksRes = await axios.get(`${API_URL}/user/social-links`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSocialLinks(linksRes.data || []);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDeleteLink = async (linkId) => {
    try {
      await axios.delete(`${API_URL}/user/social-links/${linkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSocialLinks(socialLinks.filter((link) => link.id !== linkId));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to delete link");
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform_name: "", link_url: "" }]);
  };

  const updateSocialLink = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value,
    };
    setSocialLinks(updatedLinks);
  };

  const removeSocialLink = (index) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${API_URL}/user/profile`,
        {
          username: profile.username,
          email: profile.email,
          bio: profile.bio,
          full_name: profile.full_name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const linksPromises = socialLinks.map((link) => {
        if (link.id) {
          return axios.put(
            `${API_URL}/user/social-links/${link.id}`,
            {
              platform_name: link.platform_name,
              link_url: link.link_url,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          return axios.post(
            `${API_URL}/user/social-links`,
            {
              platform_name: link.platform_name,
              link_url: link.link_url,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      });

      await Promise.all(linksPromises);
      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2b74e2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={saveAll}
          disabled={saving}
          style={styles.saveHeaderButton}
        >
          {saving ? (
            <ActivityIndicator color="#2b74e2" size="small" />
          ) : (
            <Text style={styles.saveHeaderButtonText}>Done</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Info Row */}
        <View style={styles.profileCard}>
          <View style={styles.profileDetails}>
            <TextInput
              style={styles.input}
              value={profile.full_name}
              onChangeText={(text) =>
                setProfile({ ...profile, full_name: text })
              }
              placeholder="Full Name"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={profile.bio}
              onChangeText={(text) => setProfile({ ...profile, bio: text })}
              placeholder="Bio"
              placeholderTextColor="#999"
              multiline
            />
          </View>
        </View>

        {/* Links Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Links</Text>
            <TouchableOpacity onPress={addSocialLink} style={styles.addButton}>
              <Ionicons name="add" size={24} color="#2b74e2" />
            </TouchableOpacity>
          </View>
          {socialLinks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="link-outline" size={28} color="#888" />
              <Text style={styles.emptyText}>No links added</Text>
            </View>
          ) : (
            socialLinks.map((link, index) => (
              <View key={link.id || index} style={styles.linkItem}>
                <View style={styles.linkInputs}>
                  <TextInput
                    style={styles.linkInput}
                    value={link.platform_name}
                    onChangeText={(text) =>
                      updateSocialLink(index, "platform_name", text)
                    }
                    placeholder="Platform"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    style={styles.linkInput}
                    value={link.link_url}
                    onChangeText={(text) =>
                      updateSocialLink(index, "link_url", text)
                    }
                    placeholder="https://example.com"
                    placeholderTextColor="#999"
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    link.id
                      ? handleDeleteLink(link.id)
                      : removeSocialLink(index)
                  }
                  style={styles.deleteButton}
                >
                  <Ionicons name="close" size={20} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  saveHeaderButtonText: {
    color: "#2b74e2",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16,
    backgroundColor: "#eee",
  },
  profileDetails: {
    flex: 1,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#222",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 12,
  },
  bioInput: {
    height: 70,
    textAlignVertical: "top",
  },
  sectionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  addButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
    marginTop: 8,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  linkInputs: {
    flex: 1,
  },
  linkInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#222",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 8,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: "#fff0f0",
    borderRadius: 8,
  },
});
