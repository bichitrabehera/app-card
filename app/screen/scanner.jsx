import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { API_URL } from "../../constants/api";

const QRScanner = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to access the camera
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    try {
      const userId = data.split("/").pop().trim();
      console.log("Extracted User ID:", userId);

      const res = await fetch(`${API_URL}/user/api/user/profile/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch profile");

      const profile = await res.json();
      setScannedData(profile);
    } catch (error) {
      console.error(error);
      alert("Error fetching profile");
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const openProfile = () => {
    if (scannedData?.id) {
      router.push({
        pathname: "/profile/scanned-profile",
        params: { userId: scannedData.id },
      });
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code39",
            "code128",
          ],
        }}
        onBarcodeScanned={handleScan}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {scannedData && (
        <View style={styles.openProfileContainer}>
          <TouchableOpacity
            style={styles.openProfileButton}
            onPress={openProfile}
            disabled={loading}
          >
            <Text style={styles.openProfileText}>
              {loading ? "Loading..." : "Open Profile"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.openProfileButton,
              { backgroundColor: "#ff4d4d", marginTop: 10 },
            ]}
            onPress={() => {
              setScanned(false);
              setScannedData(null);
            }}
          >
            <Text style={styles.openProfileText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  scanArea: {
    width: 260,
    height: 260,
    borderWidth: 2,
    borderColor: "#00E0FF",
    borderRadius: 16,
    shadowColor: "#00E0FF",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  openProfileContainer: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    width: "85%",
    alignItems: "center",
    gap: 12,
  },
  openProfileButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  openProfileText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});

export default QRScanner;
