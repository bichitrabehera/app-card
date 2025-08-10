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
  Image,
} from "react-native";
import axios from "axios";
import { API_URL } from "../../constants/api";
import BackButton from "../../components/BackButton";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_AVATAR = "https://i.imgur.com/mCHMpLT.png";

export default function EditProfile() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState({ 
    username: "", 
    email: "", 
    bio: "", 
    profile_picture: "",
    full_name: ""
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profileRes = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        // Fetch social links
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
      
      setSocialLinks(socialLinks.filter(link => link.id !== linkId));
      Alert.alert("Success", "Link deleted successfully");
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
      [field]: value
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
      // Save profile
      await axios.put(`${API_URL}/user/profile`, {
        username: profile.username,
        email: profile.email,
        bio: profile.bio,
        full_name: profile.full_name
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Save social links
      const linksPromises = socialLinks.map(link => {
        if (link.id) {
          return axios.put(`${API_URL}/user/social-links/${link.id}`, {
            platform_name: link.platform_name,
            link_url: link.link_url
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          return axios.post(`${API_URL}/user/social-links`, {
            platform_name: link.platform_name,
            link_url: link.link_url
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
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

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture */}
        {/* <View style={styles.profilePictureContainer}>
          <Image
            source={{ uri: profile.profile_picture || DEFAULT_AVATAR }}
            style={styles.profilePicture}
          />
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View> */}

        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={profile.username}
              onChangeText={(text) => setProfile({...profile, username: text})}
              placeholder="yourusername"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={profile.full_name}
              onChangeText={(text) => setProfile({...profile, full_name: text})}
              placeholder="Your Name"
              placeholderTextColor="#666"
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({...profile, email: text})}
              placeholder="your@email.com"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={profile.bio}
              onChangeText={(text) => setProfile({...profile, bio: text})}
              placeholder="Tell your story..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Social Links Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Links</Text>
            <TouchableOpacity 
              onPress={addSocialLink} 
              style={styles.addButton}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="#2b74e2" />
            </TouchableOpacity>
          </View>
          
          {socialLinks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="link-outline" size={32} color="#333" />
              <Text style={styles.emptyText}>No links added</Text>
            </View>
          ) : (
            socialLinks.map((link, index) => (
              <View key={link.id || index} style={styles.linkItem}>
                <View style={styles.linkInputContainer}>
                  <TextInput
                    style={styles.platformInput}
                    value={link.platform_name}
                    onChangeText={(text) => updateSocialLink(index, 'platform_name', text)}
                    placeholder="Platform (e.g. Instagram)"
                    placeholderTextColor="#666"
                  />
                  <TextInput
                    style={styles.urlInput}
                    value={link.link_url}
                    onChangeText={(text) => updateSocialLink(index, 'link_url', text)}
                    placeholder="https://example.com"
                    placeholderTextColor="#666"
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
                
                <TouchableOpacity 
                  onPress={() => link.id ? handleDeleteLink(link.id) : removeSocialLink(index)}
                  style={styles.deleteButton}
                  activeOpacity={0.8}
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
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  saveHeaderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveHeaderButtonText: {
    color: '#2b74e2',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#2b74e2',
  },
  changePhotoButton: {
    marginTop: 12,
  },
  changePhotoText: {
    color: '#2b74e2',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#222',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2b74e2',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#111',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkInputContainer: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  platformInput: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
  },
  urlInput: {
    color: '#fff',
    fontSize: 14,
    padding: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
  },
  deleteButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
});