import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../constants/api';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const router = useRouter();
  const { token, loading: authLoading } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const fetchAll = async () => {
      try {
        const headers = { headers: { Authorization: `Bearer ${token}` } };

        const [p, s, pf, w] = await Promise.all([
          axios.get(`${API_URL}/user/profile`, headers),
          axios.get(`${API_URL}/user/social-links`, headers),
          axios.get(`${API_URL}/user/portfolio`, headers),
          axios.get(`${API_URL}/user/work-experience`, headers),
        ]);

        setProfile(p.data);
        setSocialLinks(s.data);
        setPortfolio(pf.data);
        setWorkExperience(w.data);
      } catch (err) {
        console.error('Failed to fetch profile data', err);
        if (err.response?.status === 401) {
          router.replace('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAll();
    } else {
      router.replace('/auth/login');
    }
  }, [authLoading, token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/profile/edit')}
      >
        <Text style={styles.primaryButtonText}>Complete Your Profile</Text>
      </TouchableOpacity>

      {profile && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Info</Text>
          <Text>Name: {profile.name}</Text>
          <Text>Email: {profile.email}</Text>
        </View>
      )}

      {socialLinks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          {socialLinks.map((link, idx) => (
            <Text key={idx}>{link.platform}: {link.url}</Text>
          ))}
        </View>
      )}

      {portfolio.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          {portfolio.map((item, idx) => (
            <Text key={idx}>{item.title}: {item.description}</Text>
          ))}
        </View>
      )}

      {workExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {workExperience.map((job, idx) => (
            <Text key={idx}>{job.role} at {job.company}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1C24',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1C24',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 30,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
