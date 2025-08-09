import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../constants/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Debug: Log the token being sent
      console.log('Token being sent:', token);
      console.log('API URL:', `${API_URL}/user/profile`);
      
      // Debug: Check token format
      if (!token || token.length < 10) {
        console.error('Invalid token format:', token);
        setLoading(false);
        return;
      }
      
      const profileRes = await axios.get(`${API_URL}/user/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('Profile response:', profileRes.data);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Profile fetch error:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      
      // More detailed error handling
      if (error.response?.status === 401) {
        console.error('Authentication failed - token may be invalid or expired');
      } else if (error.response?.status === 404) {
        console.error('Profile endpoint not found');
      } else {
        console.error('Other error:', error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: profile.profile_picture || 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profile.username || 'No Name'}</Text>
        <Text style={styles.email}>{profile.email || 'No Email'}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <Text style={styles.sectionContent}>
          Username: {profile.username || 'Not provided'}
        </Text>
        <Text style={styles.sectionContent}>
          Email: {profile.email || 'Not provided'}
        </Text>
        <Text style={styles.sectionContent}>
          Bio: {profile.bio || 'Not provided'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1C24',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1C24',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2A2C36',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#00BFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BFFF',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  errorText: {
    color: '#FF4C4C',
    fontSize: 16,
  },
});
