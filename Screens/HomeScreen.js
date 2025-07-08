import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import YoutubePlayer from "react-native-youtube-iframe";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { BlurView } from "expo-blur";

const screenWidth = Dimensions.get("window").width;
const videoWidth = screenWidth * 0.9;
const videoHeight = (videoWidth * 9) / 16;

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [playing, setPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [rolNumber, setRolNumber] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
  };

  const fetchUserRole = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setRolNumber(data.rolNumber);
        if (data.rolNumber === 2) fetchCuidadores(); // Solo admins
      }
    } catch (error) {
      console.error("Error al obtener el rol:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCuidadores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const filtered = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.rolNumber === 1) {
          filtered.push({ id: docSnap.id, ...data });
        }
      });
      setUsers(filtered);
    } catch (error) {
      console.error("Error al obtener cuidadores:", error);
    }
  };

  const toggleAccount = async (userId, currentDisabledState) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        disabled: !currentDisabledState,
      });
      fetchCuidadores();
    } catch (error) {
      console.error("Error actualizando cuenta:", error);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#A2D5F2" />
      </View>
    );
  }

  // 👤 Vista para rol 1 (cuidador)
  if (rolNumber === 1) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
        {!showVideo ? (
          <TouchableOpacity
            onPress={() => setShowVideo(true)}
            style={{ marginTop: 20 }}
          >
            <Image
              source={{ uri: "https://img.youtube.com/vi/AdZPmob8wtE/0.jpg" }}
              style={{
                width: videoWidth,
                height: videoHeight,
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <YoutubePlayer
              height={videoHeight}
              width={videoWidth}
              play={playing}
              videoId="AdZPmob8wtE"
              webViewProps={{ scrollEnabled: false }}
              onChangeState={(event) => {
                if (event === "ended") setShowVideo(false);
              }}
            />
          </View>
        )}

        <Text style={{ marginTop: 20 }}>{t("selectLanguage")}</Text>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => changeLanguage(itemValue)}
          style={{ height: 50, width: 200 }}
        >
          <Picker.Item label="Español" value="es" />
          <Picker.Item label="English" value="en" />
        </Picker>
      </ScrollView>
    );
  }

  // 🛠️ Vista para rol 2 (admin)
  if (rolNumber === 2) {
    return (
      <ImageBackground
        source={require("../assets/user.png")}
        style={styles.Imagen_blur}
        resizeMode="cover"
      >
        <BlurView intensity={50} tint="light" style={styles.container}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Usuarios</Text>
            </View>

            {users.map((user) => (
              <View key={user.id} style={styles.card}>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Tutor:</Text>{" "}
                  {user.tutor?.name || "No disponible"}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Email:</Text>{" "}
                  {user.tutor?.email || "No disponible"}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Paciente:</Text>{" "}
                  {user.paciente?.name || "No disponible"}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Diagnóstico:</Text>{" "}
                  {user.paciente?.diagnosis || "No disponible"}
                </Text>
                <Text style={styles.estado}>
                  Estado:{" "}
                  <Text style={{ color: user.disabled ? "red" : "green" }}>
                    {user.disabled ? "Inactivo" : "Activo"}
                  </Text>
                </Text>

                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: user.disabled ? "#28a745" : "#dc3545" },
                  ]}
                  onPress={() => toggleAccount(user.id, user.disabled)}
                >
                  <Text style={styles.buttonText}>
                    {user.disabled ? "ACTIVAR CUENTA" : "DESACTIVAR CUENTA"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </BlurView>
      </ImageBackground>
    );
  }

  // Si el rol aún no está definido
  return (
    <View style={styles.centered}>
      <Text>No se pudo determinar el rol del usuario.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 30, fontWeight: "bold", color: "#333" },

  container: {
    paddingTop: 40,
    padding: 16,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "#f5f7fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    marginBottom: 5,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  estado: {
    fontStyle: "italic",
    color: "#666",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  Imagen_blur: { flex: 1 },
    container: { flex: 1, padding: 20 },
});
