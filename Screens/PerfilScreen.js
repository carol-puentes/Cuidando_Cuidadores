import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "@react-navigation/native";

export default function PerfilScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        setLoading(true);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          Alert.alert("No se encontró información del usuario");
        }
      } catch (error) {
        Alert.alert("Error al obtener datos", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Usuario no autenticado");
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const downloadLabReport = async () => {
    if (!userData) return;

    const labReport = userData?.paciente?.labReport;

    if (!labReport || !labReport.base64) {
      Alert.alert("No hay archivo de laboratorio para descargar");
      return;
    }

    try {
      setDownloading(true);

      const filename = labReport.name || "archivo.pdf";
      const fileUri = FileSystem.cacheDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, labReport.base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("No se puede compartir el archivo en este dispositivo");
        setDownloading(false);
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: labReport.mimeType || "application/pdf",
        dialogTitle: "Guardar o compartir archivo PDF",
        UTI: labReport.mimeType || "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Error al descargar archivo", error.message);
    } finally {
      setDownloading(false);
    }
  };

  const onEditTutor = () => {
    navigation.navigate("EditarTutor");
  };

  const onEditPaciente = () => {
    navigation.navigate("EditarPaciente");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No hay datos para mostrar.</Text>
      </View>
    );
  }

  const { tutor, paciente } = userData;

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );

  const SectionHeader = ({ title, onEdit }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/fondo_principal.png")}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <BlurView intensity={50} tint="light" style={styles.blurContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <SectionHeader title="Cuidador" onEdit={onEditTutor} />
          <View style={styles.card}>
            <InfoRow label="Nombre" value={tutor?.name} />
            <InfoRow label="Género" value={tutor?.gender} />
            <InfoRow label="Correo electrónico" value={tutor?.email} />
            <InfoRow label="Fecha de nacimiento" value={tutor?.birthDate} />
            <InfoRow
              label="Edad"
              value={tutor?.age ? `${tutor.age} años` : "-"}
            />
            <InfoRow label="Dirección" value={tutor?.address} />
            <InfoRow label="Contraseña" value="********" />
          </View>

          <SectionHeader title="Paciente" onEdit={onEditPaciente} />
          <View style={styles.card}>
            <InfoRow label="Nombre" value={paciente?.name} />
            <InfoRow label="Fecha de nacimiento" value={paciente?.birthDate} />
            <InfoRow label="Género" value={paciente?.gender} />
            <InfoRow label="Diagnóstico" value={paciente?.diagnosis} />
            <InfoRow label="Estado" value={paciente?.status} />
            <InfoRow label="Próxima cita" value={paciente?.nextAppointment} />

           
             {/* Recomendaciones */}
            {(paciente?.status === "en casa" ||
              paciente?.status === "hospitalizado") && (
              <InfoRow
                label="Recomendaciones"
                value={
                  paciente?.recommendations?.length > 0
                    ? paciente.recommendations.map((r) => `• ${r}`).join("\n")
                    : "No hay recomendaciones registradas."
                }
                multiline
              />
            )}

            {/* Horarios de visita */}
            {paciente?.status === "hospitalizado" && (
              <InfoRow
                label="Horarios de visita"
                value={
                  paciente?.visitSchedules?.length > 0
                    ? paciente.visitSchedules
                        .map(
                          (item) => `• Día: ${item.day}, Hora: ${item.time}`
                        )
                        .join("\n")
                    : "No hay horarios de visita registrados."
                }
                multiline
              />

              
            )}

            <InfoRow
              label="Archivo de laboratorio"
              value={
                paciente?.labReport && paciente.labReport.base64
                  ? ""
                  : "No hay archivo de laboratorio disponible."
              }
            />

            {paciente?.labReport && paciente.labReport.base64 && (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={downloadLabReport}
                disabled={downloading}
                activeOpacity={0.7}
              >
                <Text style={styles.downloadButtonText}>
                  {downloading ? "Descargando..." : "Descargar PDF"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#8080ff",
  },
  editButton: {
    backgroundColor: "#8080ff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    maxWidth: "50%",
  },
  value: {
    fontSize: 16,
    color: "#555",
    maxWidth: "50%",
    textAlign: "right",
  },
  downloadButton: {
    marginTop: 10,
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});





