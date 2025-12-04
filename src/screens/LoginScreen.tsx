import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      setErrorMsg(err.message);
      setShowError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatApp</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#364C84"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#364C84"
        secureTextEntry={true} 
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      
      <Text style={styles.footerText}>made with love by regina</Text>

      {/* Modal Error */}
      <Modal transparent visible={showError} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{errorMsg}</Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setShowError(false)}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7F1A8",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#364C84",
    alignSelf: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#364C84",
    backgroundColor: "#FFFDF5",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#364C84",
    marginBottom: 15,
  
  },

  footerText: {
  marginTop: 40,
  textAlign: "center",
  fontSize: 14,
  color: "#364C84",
  opacity: 0.7,
  fontStyle: "italic",
  },

  button: {
    backgroundColor: "#364C84",
    padding: 14,
    borderRadius: 12,
    marginTop: 5,
  },
  btnText: {
    color: "#FFFDF5",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },

  // modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalBox: {
    margin: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
  },
  modalText: {
    fontSize: 16,
    color: "#364C84",
    marginBottom: 15,
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: "#364C84",
    padding: 12,
    borderRadius: 10,
  },
  modalBtnText: {
    color: "#FFFDF5",
    textAlign: "center",
    fontSize: 16,
  },
});
