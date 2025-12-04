import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ImageViewScreen({ route, navigation }: any) {
  const { imageUrl } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.full}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  full: { flex: 1 },
  image: { width: "100%", height: "100%" },
});
