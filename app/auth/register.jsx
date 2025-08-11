import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError("");
  };

  const handleRegister = async () => {
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Ensure we're sending the correct payload
      const payload = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      await register(payload);
      router.replace("/screen/home");
    } catch (err) {
      console.error("Register error:", err);

      // Handle validation errors properly
      let message = "Registration failed. Try again.";

      if (err?.response?.data?.detail) {
        const detail = err.response.data.detail;

        if (typeof detail === "string") {
          message = detail;
        } else if (Array.isArray(detail)) {
          // Handle array of validation errors
          message = detail
            .map((error) => {
              if (typeof error === "string") return error;
              if (error?.msg) return error.msg;
              if (error?.loc && error?.msg)
                return `${error.loc.join(".")}: ${error.msg}`;
              return JSON.stringify(error);
            })
            .join(", ");
        } else if (typeof detail === "object") {
          // Handle object errors
          message = detail.msg || detail.detail || JSON.stringify(detail);
        }
      } else if (err?.response?.status === 500) {
        message = "Server error. Please try again later.";
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "username",
      placeholder: "Username",
      icon: "person-outline",
      autoCapitalize: "words",
    },
    {
      key: "email",
      placeholder: "Email Address",
      icon: "mail-outline",
      keyboardType: "email-address",
      autoCapitalize: "none",
    },
    {
      key: "password",
      placeholder: "Password (min 6 characters)",
      icon: "lock-closed-outline",
      secure: !showPassword,
      autoCapitalize: "none",
      rightIcon: (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo and Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Join thousands of professionals using TapCard
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {fields.map(
            ({
              key,
              placeholder,
              icon,
              keyboardType,
              secure,
              autoCapitalize,
              rightIcon,
            }) => (
              <View key={key} style={styles.inputContainer}>
                <Ionicons
                  name={icon}
                  size={20}
                  color="#888"
                  style={styles.icon}
                />
                <TextInput
                  placeholder={placeholder}
                  placeholderTextColor="#888"
                  value={formData[key]}
                  onChangeText={(val) => handleChange(key, val)}
                  style={styles.input}
                  secureTextEntry={secure}
                  keyboardType={keyboardType}
                  autoCapitalize={autoCapitalize}
                />
                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
              </View>
            )
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.passwordHint}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#888"
            />
            <Text style={styles.hintText}>Use at least 6 characters</Text>
          </View>

          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable
            onPress={() => router.push("/auth/login")}
            style={({ pressed }) => [
              styles.loginButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF", // White background
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1C24", // Dark text for white background
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Light gray input background
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 56,
  },
  icon: {
    marginRight: 12,
    color: "#888888",
  },
  rightIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#1A1C24",
    fontSize: 16,
  },
  passwordHint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  hintText: {
    color: "#888888",
    fontSize: 14,
    marginLeft: 8,
  },
  error: {
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#3391FF",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    elevation: 3,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    color: "#888888",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  footer: {
    alignItems: "center",
    marginBottom: 24,
  },
  footerText: {
    color: "#666666",
    marginBottom: 12,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.3,
    borderColor: "#3391FF",
  },
  loginButtonText: {
    color: "#3391FF",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    color: "#888888",
    textAlign: "center",
    fontSize: 12,
    marginTop: 16,
  },
  linkText: {
    color: "#3391FF",
  },
});

export default Register;
