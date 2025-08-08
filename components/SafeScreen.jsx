// components/SafeScreen.jsx
import { View, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: "#1A1C24",
        
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1A1C24" />
      {children}
    </View>
  );
};

export default SafeScreen;
