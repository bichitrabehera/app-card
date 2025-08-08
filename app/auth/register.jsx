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
  TouchableOpacity
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
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
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(formData);
      router.replace("/home");
    } catch (err) {
      console.error("Register error:", err);
      const message =
        err?.response?.data?.detail || "Registration failed. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "name",
      placeholder: "Full Name",
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
          <Text style={styles.subtitle}>Join thousands of professionals using TapCard</Text>
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
                {rightIcon && (
                  <View style={styles.rightIcon}>
                    {rightIcon}
                  </View>
                )}
              </View>
            )
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.passwordHint}>
            <Ionicons name="information-circle-outline" size={16} color="#888" />
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
    backgroundColor: "#1A1C24",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
    alignSelf: 'center'
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2C33",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#FFFFFF",
    fontSize: 16,
  },
  passwordHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hintText: {
    color: '#888',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#888',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialContainer: {
    marginBottom: 32,
  },
  socialText: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#252833',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: '#AAAAAA',
    marginBottom: 12,
  },
  loginButton: {
    width: '100%',
    backgroundColor: "transparent",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 16,
  },
  linkText: {
    color: '#3391FF',
  },
});

export default Register;