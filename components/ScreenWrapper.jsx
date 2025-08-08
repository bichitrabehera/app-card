// components/ScreenWrapper.jsx
import { View, StyleSheet } from "react-native";

const ScreenWrapper = ({ children }) => (
  <View style={styles.wrapper}>{children}</View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#111111",
  },
});

export default ScreenWrapper;
