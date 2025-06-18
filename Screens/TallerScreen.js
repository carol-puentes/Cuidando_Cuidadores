// // Screens/TallerScreen.js
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

// import { obtenerSemanasDesbloqueadas } from './utils/progressUtils';

// import semana2 from './semanas/semana2';
// import semana1 from './semanas/semana1';
// import semana3 from './semanas/semana3';

// const TODAS_LAS_SEMANAS = [semana1, semana2, semana3]; // Aquí puedes agregar semana3, etc.

// export default function TallerScreen({ navigation }) {
//   const [progreso, setProgreso] = useState({
//     ultimaSemanaCompletada: 0, // Esto puede venir de Firebase
//   });

//   const semanas = obtenerSemanasDesbloqueadas(progreso);

//   const handleAbrirSemana = (semanaIndex) => {
//     if (!semanas[semanaIndex].desbloqueada) {
//       Alert.alert('Módulo bloqueado', 'Primero debes completar la semana anterior.');
//       return;
//     }

//     navigation.navigate('DetalleSemana', {
//       contenido: TODAS_LAS_SEMANAS[semanaIndex],
//       onCompletar: () => {
//         // Simulamos guardar el progreso
//         setProgreso((prev) => ({
//           ultimaSemanaCompletada: Math.max(prev.ultimaSemanaCompletada, semanaIndex + 1),
//         }));
//       }
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.titulo}>Módulos Semanales</Text>
//       <FlatList
//         data={semanas}
//         keyExtractor={(item) => `semana-${item.semana}`}
//         renderItem={({ item, index }) => (
//           <TouchableOpacity
//             style={[
//               styles.item,
//               !item.desbloqueada && styles.bloqueado
//             ]}
//             onPress={() => handleAbrirSemana(index)}
//           >
//             <Text style={styles.texto}>
//               Semana {item.semana} {item.desbloqueada ? '' : '🔒'}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   item: {
//     backgroundColor: '#ddd',
//     padding: 16,
//     marginVertical: 8,
//     borderRadius: 8,
//   },
//   texto: { fontSize: 18 },
//   bloqueado: {
//     backgroundColor: '#bbb',
//     opacity: 0.6
//   }
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ImageBackground,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

import { obtenerSemanasDesbloqueadas } from "./utils/progressUtils";
import { BlurView } from "expo-blur";

import semana1 from "./semanas/semana1";
import semana2 from "./semanas/semana2";
import semana3 from "./semanas/semana3";

const TODAS_LAS_SEMANAS = [semana1, semana2, semana3];

export default function TallerScreen({ navigation }) {
  const [progreso, setProgreso] = useState({
    ultimaSemanaCompletada: 0,
  });

  // 🔄 Cargar progreso desde Firebase cuando se enfoca esta pantalla
  useFocusEffect(
    React.useCallback(() => {
      const cargarProgreso = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          const data = userDoc.data();
          setProgreso({
            ultimaSemanaCompletada: data?.ultimaSemanaCompletada || 0,
          });
        } catch (error) {
          console.error("Error al obtener progreso:", error);
        }
      };

      cargarProgreso();
    }, [])
  );

  const semanas = obtenerSemanasDesbloqueadas(progreso);

  const handleAbrirSemana = (semanaIndex) => {
    if (!semanas[semanaIndex].desbloqueada) {
      Alert.alert(
        "Módulo bloqueado",
        "Primero debes completar la semana anterior."
      );
      return;
    }

    navigation.navigate("DetalleSemana", {
      contenido: TODAS_LAS_SEMANAS[semanaIndex],
      onCompletar: async () => {
        const nuevaSemana = semanaIndex + 1;
        const userId = auth.currentUser?.uid;

        try {
          await updateDoc(doc(db, "users", userId), {
            ultimaSemanaCompletada: nuevaSemana,
          });

          setProgreso((prev) => ({
            ultimaSemanaCompletada: Math.max(
              prev.ultimaSemanaCompletada,
              nuevaSemana
            ),
          }));
        } catch (error) {
          console.error("Error al actualizar el progreso:", error);
        }
      },
    });
  };

  return (
    <ImageBackground
      source={require("../assets/talleres_fondo.png")}
      style={styles.Imagen_blur}
      resizeMode="cover"
    >
      <BlurView intensity={50} tint="light" style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Módulos Semanales</Text>
          <FlatList
            data={semanas}
            keyExtractor={(item) => `semana-${item.semana}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.item, !item.desbloqueada && styles.bloqueado]}
                onPress={() => handleAbrirSemana(index)}
              >
                <Text style={styles.texto}>
                  Semana {item.semana} {item.desbloqueada ? "" : "🔒"}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  Imagen_blur: { flex: 1},
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    backgroundColor: "#ddd",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  texto: { fontSize: 18 },
  bloqueado: {
    backgroundColor: "#bbb",
    opacity: 0.6,
  },
});
