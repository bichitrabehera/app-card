import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";

export default function Index() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (token) {
        router.replace("/screen/home");
      } else {
        setReady(true);
      }
    }
  }, [loading, token]);

  if (loading && !ready) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3391FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.title}>TapCard</Text>
        <Text style={styles.subtitle}>Your Digital Identity, Simplified</Text>
      </View>

      {/* Features Section */}
      <View style={styles.features}>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🔐</Text>
          <Text style={styles.featureTitle}>Secure</Text>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureTitle}>Fast</Text>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🌐</Text>
          <Text style={styles.featureTitle}>Universal</Text>
        </View>

      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaText}>Join thousands of professionals using TapCard</Text>
        
        <View style={styles.buttons}>
          <Pressable
            onPress={() => router.push("/auth/login")}
            style={({ pressed }) => [
              styles.buttonPrimary,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/auth/register")}
            style={({ pressed }) => [
              styles.buttonSecondary,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>
        </View>
        
        <Text style={styles.footerText}>By continuing, you agree to our Terms and Privacy Policy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1C24",
    paddingHorizontal: 24,
    paddingVertical: 200,
    justifyContent: 'space-between'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#1A1C24",
  },
  hero: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 40,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  featureCard: {
    width: '30%',
    backgroundColor: '#252833',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  featureText: {
    color: '#AAAAAA',
    fontSize: 12,
    textAlign: 'center',
  },
  ctaSection: {
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    width: "100%",
    marginBottom: 16,
  },
  buttonPrimary: {
    backgroundColor: "#3391FF",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  buttonSecondary: {
    borderColor: "#FFFFFF",
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
  },
});