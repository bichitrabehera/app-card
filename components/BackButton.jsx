import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

const BackButton = ({ color = "#000000ff", size = 24, style }) => {
  const router = useRouter();

  return (
    <Pressable onPress={router.back} style={[styles.button, style]}>
      <Ionicons name="arrow-back" size={size} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});

export default BackButton;
