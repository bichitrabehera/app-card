import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // console.log("Attempting login with:", email);
      await login(email, password);
      // console.log("Login successful, navigating to /home");
      router.replace("/screen/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials or network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            {/* Logo and Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to access your TapCard account
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#888"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError("");
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#888"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError("");
                  }}
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <Pressable
                style={styles.forgotPassword}
                onPress={() => router.push("/auth/forgot-password")}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>

              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : (
                <View style={{ height: 20 }} />
              )}

              <Pressable
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.btn,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.btnText}>Sign In</Text>
                )}
              </Pressable>
            </View>

            {/* Social Login Section */}
            <View style={styles.socialContainer}>
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Dont have a account?</Text>

              <Pressable
                onPress={() => router.push("/auth/register")}
                style={({ pressed }) => [
                  styles.register,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={styles.registerText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  innerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1F2937", // deep gray for text
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280", // softer gray
    textAlign: "center",
    marginBottom: 8,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
    color: "#9CA3AF",
  },
  input: {
    flex: 1,
    height: 56,
    color: "#111827", // black text
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "500",
  },
  error: {
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  socialContainer: {
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#9CA3AF",
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: "500",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#6B7280",
    marginBottom: 12,
  },
  register: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.3,
    borderColor: "#2563EB",
  },
  registerText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Login;
