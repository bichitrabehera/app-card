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
import { AuthContext } from '../context/AuthContext';

export default function EditProfile() {
  // const { token } = useContext(AuthContext);
const { token } = useContext(AuthContext);
console.log("Token from AuthContext:", token);

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [socialLinks, setSocialLinks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);

        const s = await axios.get(`${API_URL}/user/social-links`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSocialLinks(s.data);

        const pf = await axios.get(`${API_URL}/user/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPortfolio(pf.data);

        const w = await axios.get(`${API_URL}/user/work-experience`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkExperience(w.data);
      } catch (err) {
        Alert.alert("Error", "Failed to load data.");
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const saveAll = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/user/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Promise.all(
        socialLinks.map((link) => {
          if (link.id) {
            return axios.put(`${API_URL}/user/social-links/${link.id}`, link, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            return axios.post(`${API_URL}/user/social-links`, link, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        })
      );

      await Promise.all(
        portfolio.map((item) =>
          item.id
            ? axios.put(`${API_URL}/user/portfolio/${item.id}`, item, {
                headers: { Authorization: `Bearer ${token}` },
              })
            : axios.post(`${API_URL}/user/portfolio`, item, {
                headers: { Authorization: `Bearer ${token}` },
              })
        )
      );

      await Promise.all(
        workExperience.map((job) => {
          if (job.id) {
            return axios.put(`${API_URL}/user/work-experience/${job.id}`, job, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            return axios.post(`${API_URL}/user/work-experience`, job, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        })
      );

      Alert.alert("Success", "All data saved successfully.");
    } catch (err) {
      Alert.alert("Error", "Failed to save all data.");
      console.log(err.message);
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

  const addExperience = () => {
    setWorkExperience([...workExperience, { role: "", company: "" }]);
  };

  const removeExperience = (index) => {
    const updated = [...workExperience];
    updated.splice(index, 1);
    setWorkExperience(updated);
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
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
          placeholder="Name"
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

        <Text style={styles.sectionTitle}>Portfolio</Text>
        {portfolio.map((item, idx) => (
          <View key={item.id || idx} style={styles.itemBlock}>
            <TextInput
              style={styles.input}
              value={item.title}
              onChangeText={(text) => {
                const updated = { ...item, title: text };
                const updatedList = [...portfolio];
                updatedList[idx] = updated;
                setPortfolio(updatedList);
              }}
              placeholder="Title"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              value={item.description}
              onChangeText={(text) => {
                const updated = { ...item, description: text };
                const updatedList = [...portfolio];
                updatedList[idx] = updated;
                setPortfolio(updatedList);
              }}
              placeholder="Description"
              placeholderTextColor="#888"
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Work Experience</Text>
        {workExperience.map((job, idx) => (
          <View key={job.id || idx} style={styles.itemBlock}>
            <TextInput
              style={styles.input}
              value={job.role}
              onChangeText={(text) => {
                const updated = { ...job, role: text };
                const updatedList = [...workExperience];
                updatedList[idx] = updated;
                setWorkExperience(updatedList);
              }}
              placeholder="Role"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              value={job.company}
              onChangeText={(text) => {
                const updated = { ...job, company: text };
                const updatedList = [...workExperience];
                updatedList[idx] = updated;
                setWorkExperience(updatedList);
              }}
              placeholder="Company"
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => removeExperience(idx)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addExperience} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Experience</Text>
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
