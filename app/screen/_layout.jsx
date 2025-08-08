import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons"; // ✅ Use Feather
import { StatusBar } from "expo-status-bar";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function Layout() {
  return (
    <>
      <ScreenWrapper>
        <StatusBar style="light" />

        <Tabs
          screenOptions={{
            headerShown: false,
            // tabBarShowLabel: false, // 🔕 Hide labels
            tabBarStyle: {
              backgroundColor: "#1A1C24",
              borderTopColor: "#222",
              elevation: 0,
              height: 60,
            },
            tabBarActiveTintColor: "#37b6e9ff",
            tabBarInactiveTintColor: "#888888",
            tabBarItemStyle: {
              paddingVertical: 4,
            },
          }}
          sceneContainerStyle={{
            backgroundColor: "#1A1C24",
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="scanner"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="camera" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="user" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </ScreenWrapper>
    </>
  );
}
