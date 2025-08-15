import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

export default function TallerScreen({ navigation }) {
  const [progreso, setProgreso] = useState({ ultimaSemanaCompletada: 0 });
  const [rolNumber, setRolNumber] = useState(1);
  const [semanas, setSemanas] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const cargarDatos = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          const data = userDoc.data();

          setProgreso({ ultimaSemanaCompletada: data?.ultimaSemanaCompletada || 0 });
          setRolNumber(data?.rolNumber || 1);

          const snapshot = await getDocs(collection(db, "semanas"));
          const semanasFirestore = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => a.semana - b.semana);

          setSemanas(semanasFirestore);
        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
      };

      cargarDatos();
    }, [])
  );

  const handleAbrirSemana = (semanaData, index) => {
    const desbloqueada = rolNumber === 2 || index <= progreso.ultimaSemanaCompletada;

    if (!desbloqueada) {
      Alert.alert("Módulo bloqueado", "Primero debes completar la semana anterior.");
      return;
    }

    if (rolNumber === 2) {
      navigation.navigate("EditarSemana", {
        contenido: semanaData,
        semanaIndex: index,
      });
    } else {
      navigation.navigate("DetalleSemana", {
        contenido: semanaData,
        rolNumber,
        onCompletar: async () => {
          const nuevaSemana = index + 1;
          const userId = auth.currentUser?.uid;

          try {
            await updateDoc(doc(db, "users", userId), {
              ultimaSemanaCompletada: nuevaSemana,
            });

            setProgreso((prev) => ({
              ...prev,
              ultimaSemanaCompletada: Math.max(prev.ultimaSemanaCompletada, nuevaSemana),
            }));
          } catch (error) {
            console.error("Error al actualizar el progreso:", error);
          }
        },
      });
    }
  };

  return (
    <ImageBackground source={require("../assets/talleres_fondo.png")} style={styles.Imagen_blur} resizeMode="cover">
      <BlurView intensity={50} tint="light" style={styles.container}>
        <View style={styles.container}>
          
        <View style={styles.row}>
        <Ionicons name="heart-circle-outline" size={64} color="#A2D5F2" style={styles.icon} />
           <Text style={styles.titulo}>Módulos Semanales</Text>
      </View>

      
      {rolNumber === 1 && (
  <>
    <Text style={styles.paragraph}>
      Este programa ha sido creado desde el{" "}
      <Text style={styles.bold}>Programa de Enfermería de la Universidad Surcolombiana</Text>,
      especialmente para ti, cuidador(a), como un reconocimiento a tu entrega, amor y compromiso diario.
    </Text>

    <Text style={styles.paragraph}>
      Gracias por permitirnos acompañarte en este camino.
    </Text>
  </>
)}


          <FlatList
            data={semanas}
            keyExtractor={(item) => `semana-${item.semana}`}
            renderItem={({ item, index }) => {
              const desbloqueada = rolNumber === 2 || index <= progreso.ultimaSemanaCompletada;

              let texto;
              if (index === 0) {
                texto = rolNumber === 2 ? "Editar Prueba Inicial" : `Prueba Inicial ${desbloqueada ? "" : "🔒"}`;
              } else if (index === semanas.length - 1) {
                texto = rolNumber === 2 ? "Editar Prueba Final" : `Prueba Final ${desbloqueada ? "" : "🔒"}`;
              } else {
                texto = rolNumber === 2
                  ? `Editar Semana ${item.semana}`
                  : `Semana ${item.semana} ${desbloqueada ? "" : "🔒"}`;
              }

              return (
                <TouchableOpacity
                  style={[styles.item, !desbloqueada && styles.bloqueado]}
                  onPress={() => handleAbrirSemana(item, index)}
                >
                  <Text style={styles.texto}>{texto}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </BlurView>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  Imagen_blur: {
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  item: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  texto: {
    fontSize: 18,
    color: "#333",
  },
  bloqueado: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },




  container_introduccion: {
    backgroundColor: "#ffffffee", // Blanco con transparencia
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    width: "100%",
  },
  icon: {
    marginBottom: 12,
  },
  title_introduccion: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3B3B98",
    textAlign: "center",
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    color: "#444",
    textAlign: "justify",
    marginBottom: 12,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
    color: "#3B3B98",
  },


  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },


});
