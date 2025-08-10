import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

const QRScanner = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const router = useRouter();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      setScannedData(data);
    }
  };

  const openProfile = () => {
    if (!scannedData) return;

    const match =
      scannedData.match(/profile\/([\w-]+)$/) || scannedData.match(/user\/([\w-]+)$/);
    const userId = match ? match[1] : null;

    if (userId) {
      console.log(userId)
      router.push(`/profile/${userId}`);
      setScanned(false);
      setScannedData(null);
    } else {
      Alert.alert("Invalid QR Code", "The scanned QR code does not contain a valid profile link.");
      setScanned(false);
      setScannedData(null);
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
          <TouchableOpacity style={styles.openProfileButton} onPress={openProfile}>
            <Text style={styles.openProfileText}>Open Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.openProfileButton, { backgroundColor: "#ff4d4d", marginTop: 10 }]}
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
  container: { flex: 1 },
  message: { textAlign: "center", marginTop: 20 },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
  },
  openProfileContainer: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    width: "80%",
    alignItems: "center",
  },
  openProfileButton: {
    backgroundColor: "#2b74e2",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  openProfileText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default QRScanner;
