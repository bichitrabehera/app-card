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

export default function EditProfile() {
  // const { token } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  console.log("Token from AuthContext:", token);

  const [profile, setProfile] = useState({ username: "", email: "" });
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        console.log("Token:", token);
        const res = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);

        // const s = await axios.get(`${API_URL}/user/social-links`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setSocialLinks(s.data);
      } catch (err) {
        Alert.alert("Error", "Failed to load data.");
        console.log(
          "Axios error:",
          err.response ? err.response.data : err.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const validateData = () => {
    const errors = [];
    
    // Validate profile
    if (!profile.username?.trim()) {
      errors.push("Username is required");
    }
    if (!profile.email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.push("Please enter a valid email address");
    }

    // Validate social links
    socialLinks.forEach((link, index) => {
      if (link.platform?.trim() && !link.url?.trim()) {
        errors.push(`Social link ${index + 1}: URL is required when platform is provided`);
      }
      if (link.url?.trim() && !link.platform?.trim()) {
        errors.push(`Social link ${index + 1}: Platform is required when URL is provided`);
      }
    });

    // Validate portfolio items
    portfolio.forEach((item, index) => {
      if (!item.title?.trim()) {
        errors.push(`Portfolio item ${index + 1}: Title is required`);
      }
    });

    // Validate work experience
    workExperience.forEach((job, index) => {
      if (!job.company_name?.trim()) {
        errors.push(`Work experience ${index + 1}: Company name is required`);
      }
      if (!job.role?.trim()) {
        errors.push(`Work experience ${index + 1}: Role is required`);
      }
    });

    return errors;
  };

  const saveAll = async () => {
    // Validate data before saving
    const validationErrors = validateData();
    if (validationErrors.length > 0) {
      Alert.alert(
        "Validation Error", 
        `Please fix the following issues:\n${validationErrors.join('\n')}`,
        [{ text: "OK" }]
      );
      return;
    }

    setSaving(true);
    const errors = [];
    const successes = [];

    try {
      // Prepare data for API calls
      const cleanProfile = {
        username: profile.username?.trim(),
        email: profile.email?.trim(),
        bio: profile.bio?.trim() || null,
      };

      // Save profile first
      try {
        await axios.put(`${API_URL}/user/profile`, cleanProfile, {
          headers: { Authorization: `Bearer ${token}` },
        });
        successes.push("Profile updated successfully");
      } catch (err) {
        errors.push(`Profile: ${err.response?.data?.detail || err.message}`);
      }

      // Save social links with better error handling
      if (socialLinks.length > 0) {
        const socialPromises = socialLinks.map(async (link, index) => {
          try {
            const cleanLink = {
              platform_name: link.platform?.trim(),
              link_url: link.url?.trim()
            };
            
            if (!cleanLink.platform_name || !cleanLink.link_url) {
              return { 
                type: 'social', 
                index, 
                error: 'Both platform and URL are required',
                platform: link.platform 
              };
            }

            if (link.id) {
              await axios.put(`${API_URL}/user/social-links/${link.id}`, cleanLink, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return { type: 'social', index, status: 'updated' };
            } else {
              await axios.post(`${API_URL}/user/social-links`, cleanLink, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return { type: 'social', index, status: 'created' };
            }
          } catch (err) {
            return { 
              type: 'social', 
              index, 
              error: err.response?.data?.detail || err.message,
              platform: link.platform 
            };
          }
        });

        const socialResults = await Promise.all(socialPromises);
        socialResults.forEach(result => {
          if (result.error) {
            errors.push(`Social link (${result.platform}): ${result.error}`);
          } else {
            successes.push(`Social link ${result.status} successfully`);
          }
        });
      }

      // Save portfolio items
      if (portfolio.length > 0) {
        const portfolioPromises = portfolio.map(async (item, index) => {
          try {
            const cleanPortfolio = {
              title: item.title?.trim(),
              description: item.description?.trim() || null,
              media_url: item.media_url?.trim() || null
            };

            if (!cleanPortfolio.title) {
              return { 
                type: 'portfolio', 
                index, 
                error: 'Title is required',
                title: item.title 
              };
            }

            if (item.id) {
              await axios.put(`${API_URL}/user/portfolio/${item.id}`, cleanPortfolio, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return { type: 'portfolio', index, status: 'updated' };
            } else {
              await axios.post(`${API_URL}/user/portfolio`, cleanPortfolio, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return { type: 'portfolio', index, status: 'created' };
            }
          } catch (err) {
            return { 
              type: 'portfolio', 
              index, 
              error: err.response?.data?.detail || err.message,
              title: item.title 
            };
          }
        });

        const portfolioResults = await Promise.all(portfolioPromises);
        portfolioResults.forEach(result => {
          if (result.error) {
            errors.push(`Portfolio item (${result.title}): ${result.error}`);
          } else {
            successes.push(`Portfolio item ${result.status} successfully`);
          }
        });
      }

      // Save work experience
      if (workExperience.length > 0) {
        const workPromises = workExperience.map(async (job, index) => {
          try {
            const cleanWork = {
              company_name: job.company?.trim() || job.company_name?.trim(),
              role: job.role?.trim(),
              start_date: job.start_date,
              end_date: job.end_date || null,
              description: job.description?.trim() || null
            };

            if (!cleanWork.company_name) {
              return { 
                type: 'work', 
                index, 
                error: 'Company name is required',
                company: job.company || job.company_name 
              };
            }

            if (!cleanWork.role) {
              return { 
                type: 'work', 
                index, 
                error: 'Role is required',
                company: job.company || job.company_name 
              };
            }

            if (job.id) {
              await axios.put(`${API_URL}/user/work-experience/${job.id}`, cleanWork, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return { type: 'work', index, status: 'updated' };
            } else {
              await axios.post(`${API_URL}/user/work-experience`, cleanWork, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return { type: 'work', index, status: 'created' };
            }
          } catch (err) {
            return { 
              type: 'work', 
              index, 
              error: err.response?.data?.detail || err.message,
              company: job.company || job.company_name 
            };
          }
        });

        const workResults = await Promise.all(workPromises);
        workResults.forEach(result => {
          if (result.error) {
            errors.push(`Work experience (${result.company}): ${result.error}`);
          } else {
            successes.push(`Work experience ${result.status} successfully`);
          }
        });
      }

      // Show appropriate message based on results
      if (errors.length === 0) {
        Alert.alert("Success", "All data saved successfully!");
      } else if (successes.length > 0) {
        Alert.alert(
          "Partial Success", 
          `${successes.length} items saved successfully.\n\nErrors:\n${errors.join('\n')}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Save Failed", 
          `Failed to save data:\n${errors.join('\n')}`,
          [{ text: "OK" }]
        );
      }

      console.log('Save results:', { successes, errors });

    } catch (err) {
      console.error('Unexpected error in saveAll:', err);
      Alert.alert(
        "Error", 
        `An unexpected error occurred: ${err.message || 'Please try again'}`,
        [{ text: "OK" }]
      );
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const removeSocialLink = (index) => {
    const updated = [...socialLinks];
    updated.splice(index, 1);
    setSocialLinks(updated);
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <BackButton />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Edit Profile</Text>
        <TextInput
          style={styles.input}
          value={profile.username}
          onChangeText={(text) => setProfile({ ...profile, username: text })}
          placeholder="Username"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={(text) => setProfile({ ...profile, email: text })}
          placeholder="Email"
          placeholderTextColor="#888"
        />

        <Text style={styles.sectionTitle}>Social Links</Text>
        {socialLinks.map((link, idx) => (
          <View key={link.id || idx} style={styles.itemBlock}>
            <TextInput
              style={styles.input}
              value={link.platform}
              onChangeText={(text) => {
                const updated = { ...link, platform: text };
                const updatedList = [...socialLinks];
                updatedList[idx] = updated;
                setSocialLinks(updatedList);
              }}
              placeholder="Platform"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              value={link.url}
              onChangeText={(text) => {
                const updated = { ...link, url: text };
                const updatedList = [...socialLinks];
                updatedList[idx] = updated;
                setSocialLinks(updatedList);
              }}
              placeholder="URL"
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => removeSocialLink(idx)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addSocialLink} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Social Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveAll}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save All"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1C24",
    paddingTop: 40,
  },
  topBar: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#00BFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#00BFFF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 20,
  },
  saveButtonText: {
    color: "#111",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemBlock: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#00BFFF",
    fontSize: 14,
  },
  removeButtonText: {
    color: "#FF4C4C",
    marginTop: 5,
  },
});
