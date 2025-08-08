// app/_layout.jsx
import { Slot } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import SafeScreen from "../components/SafeScreen";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </AuthProvider>
  );
}
