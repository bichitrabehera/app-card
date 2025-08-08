import { View, Text, StyleSheet } from 'react-native';

export default function Scanner() {
  return (
    <View style={styles.container}>
      <Text>Scanner Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
