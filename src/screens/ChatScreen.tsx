import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { messagesCollection, auth } from "../firebase";
import { signOut } from "firebase/auth";

type MessageType = {
  id: string;
  text?: string;
  user: string;
  createdAt?: any;
  imageUrl?: string;
  type: "text" | "image";
};

export default function ChatScreen({ navigation }: any) {
  const name = auth.currentUser?.email?.split("@")[0] || "User";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const STORAGE_KEY = "@chat_cache";

  useEffect(() => {
    const loadCache = async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    };
    loadCache();

    const q = query(messagesCollection, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: MessageType[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...(doc.data() as any) });
      });

      setMessages(list);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    });

    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await addDoc(messagesCollection, {
        text: message,
        user: name,
        type: "text",
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const uploadImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
        quality: 0.6,
      });

      if (!result.assets || !result.assets[0].base64) return;

      const base64Data = "data:image/jpeg;base64," + result.assets[0].base64;

      await addDoc(messagesCollection, {
        user: name,
        type: "image",
        imageUrl: base64Data,
        createdAt: serverTimestamp(),
      });
    } catch (err: any) {
      Alert.alert("Error Upload", err.message);
    }
  };

    const formatDateSeparator = (date: any) => {
    if (!date) return ""; // → anti error

    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    const d = date.toDateString();

    if (d === today.toDateString()) return "Today";
    if (d === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderItem = ({ item, index }: any) => {
    const isMe = item.user === name;
    const currentDate = item.createdAt?.toDate ? item.createdAt.toDate() : null;

    let showDate = false;

    if (index === 0) showDate = true;
    else {
      const prevDate = messages[index - 1]?.createdAt?.toDate?.();
      if (prevDate && currentDate) {
        showDate =
          prevDate.toDateString() !== currentDate.toDateString();
      }
    }

    const time = item.createdAt?.toDate
      ? item.createdAt.toDate().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <View style={{ marginBottom: 10 }}>
      {showDate && (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateText}>
            {formatDateSeparator(currentDate)}
          </Text>
        </View>
      )}

      {/* 🟦 TAMPILKAN NAMA PENGIRIM (HANYA UNTUK ORANG LAIN) */}
      {!isMe && (
        <Text style={styles.chatUserName}>{item.user}</Text>
      )}

      <View
        style={[
          styles.msgBox,
          isMe ? styles.myMsg : styles.otherMsg,
        ]}
      >
        {item.type === "image" ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ImageView", { imageUrl: item.imageUrl })
            }
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.msgText}>{item.text}</Text>
        )}

        <Text style={styles.timestamp}>{time}</Text>
      </View>
    </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerName}>{name}</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut(auth)}>
        <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
      />

      {/* INPUT AREA */}
      <View style={styles.bottomRow}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ketik pesan..."
          placeholderTextColor="#364C84"
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={sendMessage}>
          <Text style={styles.btnTxt}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnImg} onPress={uploadImage}>
          <Text style={styles.btnTxt}>Img</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E7F1A8" },

  header: {
  height: 80,
  backgroundColor: "#364C84",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 20,

  borderBottomLeftRadius: 25,
  borderBottomRightRadius: 25,

  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 8,
  },
  headerName: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },

  logoutBtn: {
    backgroundColor: "#FFFDF5",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: {
    color: "#364C84",
    fontWeight: "600",
    fontSize: 14,
  },







  msgBox: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "75%",
    marginVertical: 6,
  },
  myMsg: {
    backgroundColor: "#364C84",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  otherMsg: {
    backgroundColor: "#95B1EE",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },

  msgText: {
    color: "white",
    fontSize: 15,
  },

  chatUserName: {
    fontSize: 12,
    color: "#364C84",
    marginBottom: 4,
    marginLeft: 4,
    fontWeight: "600",
  },


  timestamp: {
    fontSize: 11,
    color: "#EEE",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  dateSeparator: {
  alignSelf: "center",
  backgroundColor: "#FFFDF5",
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 12,
  marginBottom: 6,
  },
  
  dateText: {
    color: "#364C84",
    fontWeight: "600",
    fontSize: 12,
  },



  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },

  bottomRow: {
     flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFFDF5",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFDF5",
    borderWidth: 1,
    borderColor: "#364C84",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 10,
    color: "#364C84",
  },
  btn: {
    backgroundColor: "#364C84",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnImg: {
    backgroundColor: "#95B1EE",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 6,
  },
  btnTxt: {
    color: "white",
    fontWeight: "bold",
  },
});
