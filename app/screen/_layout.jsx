import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import ScreenWrapper from "../../components/ScreenWrapper";
import { Text } from "react-native";

export default function Layout() {
  return (
    <>
      <ScreenWrapper>
        <StatusBar style="dark" />

        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: focused ? "600" : "400",
                  fontFamily: "System", // ✅ clean default font
                  color,
                }}
              >
                {focused ? "● " : ""} {/* Optional bullet for active tab */}
              </Text>
            ),
            tabBarStyle: {
              backgroundColor: "#fff",
              borderTopColor: "#e5e5e5",
              elevation: 0,
              height: 80,
              paddingTop: 6,
            },
            tabBarActiveTintColor: "#37b6e9",
            tabBarInactiveTintColor: "#888",
            tabBarItemStyle: {
              paddingVertical: 4,
            },
          }}
          sceneContainerStyle={{
            backgroundColor: "#fff",
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="home" size={size} color={color} />
              ),
              tabBarLabel: "Home",
            }}
          />
          <Tabs.Screen
            name="scanner"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="camera" size={size} color={color} />
              ),
              tabBarLabel: "Scan",
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="user" size={size} color={color} />
              ),
              tabBarLabel: "Profile",
            }}
          />
        </Tabs>
      </ScreenWrapper>
    </>
  );
}
