import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";

import LoginScreen from "./screens/LoginScreen";
import ChatScreen from "./screens/ChatScreen";
import ImageViewScreen from "./screens/ImageViewScreen";


import { auth, onAuthStateChanged } from "./firebase";
import { User } from "firebase/auth";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="ImageView" component={ImageViewScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>

  );
}
