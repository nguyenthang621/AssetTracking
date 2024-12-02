import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

export default function Login() {
  return (
    <View>
      <Text>Login</Text>
      <Image
        source={require("../../../assets/icon.png")}
        style={styles.loginImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loginImage: {
    width: 100,
    height: 100,
  },
});
