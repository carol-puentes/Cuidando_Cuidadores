import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditarTutorScreen({ navigation }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [address, setAddress] = useState("");
  const [age, setAge] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuario no autenticado");

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.tutor?.name || "");
          setGender(data.tutor?.gender || "");
          setEmail(data.tutor?.email || "");
          setAddress(data.tutor?.address || "");
          if (data.tutor?.birthDate) {
            const date = new Date(data.tutor.birthDate);
            setBirthDate(date);
            calculateAge(date);
          }
        } else {
          Alert.alert("No se encontró información del tutor");
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("Error", error.message);
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, []);

  const calculateAge = (date) => {
    const today = new Date();
    let ageCalc = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      ageCalc--;
    }
    setAge(ageCalc);
  };

  const onSave = async () => {
    if (
      !name.trim() ||
      !gender.trim() ||
      !email.trim() ||
      !address.trim() ||
      !birthDate
    ) {
      Alert.alert("Por favor completa todos los campos");
      return;
    }

    try {
      setSaving(true);
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");

      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        "tutor.name": name,
        "tutor.gender": gender,
        "tutor.email": email,
        "tutor.address": address,
        "tutor.birthDate": birthDate.toISOString(),
        "tutor.age": age,
      });

      Alert.alert("Éxito", "Datos del tutor actualizados");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error al guardar", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/fondo_principal.png")}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <BlurView intensity={50} tint="light" style={styles.blurContainer}>
        <ScrollView
          contentContainerStyle={{ padding: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Género</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
          />

          {/* <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          /> */}

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#ddd", color: "#555" }]} // color de fondo y texto atenuado
            value={email}
            editable={false} // 🔹 esto evita que se pueda escribir
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.label}>Fecha de nacimiento</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {birthDate ? birthDate.toLocaleDateString() : "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  const today = new Date();
                  let ageCalc = today.getFullYear() - date.getFullYear();
                  const m = today.getMonth() - date.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                    ageCalc--;
                  }

                  if (ageCalc < 18) {
                    Alert.alert(
                      "Edad no permitida",
                      "El tutor no puede ser menor de 18 años"
                    );
                    return;
                  }

                  setBirthDate(date);
                  calculateAge(date);
                }
              }}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onSave} disabled={saving}>
              <LinearGradient
                colors={["#4A90E2", "#357ABD"]}
                style={styles.saveButton}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Guardar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <LinearGradient
                colors={["#999", "#777"]}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Volver</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: { flex: 1, width: "100%", height: "100%" },
  blurContainer: { flex: 1 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  buttonContainer: { marginTop: 30, marginBottom: 40 },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: { paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
