import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import YoutubePlayer from "react-native-youtube-iframe";

const screenWidth = Dimensions.get("window").width;
const videoWidth = screenWidth * 0.9; // 90% del ancho de la pantalla
const videoHeight = (videoWidth * 9) / 16; // Mantiene relación 16:9

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [playing, setPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
      {/* Miniatura del video */}
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
            webViewProps={{
              scrollEnabled: false, // 🔹 Evita que el video bloquee el desplazamiento
            }}
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



// import React, { useEffect, useState } from "react";
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";

// export default function AdminScreen() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchCuidadores = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "users"));
//       const filteredUsers = [];

//       querySnapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         if (data.rolNumber === 1) {
//           filteredUsers.push({ id: docSnap.id, ...data });
//         }
//       });

//       setUsers(filteredUsers);
//     } catch (error) {
//       console.error("Error al obtener usuarios:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleAccount = async (userId, currentDisabledState) => {
//     try {
//       const userRef = doc(db, "users", userId);
//       await updateDoc(userRef, {
//         disabled: !currentDisabledState,
//       });
//       fetchCuidadores();
//     } catch (error) {
//       console.error("Error actualizando cuenta:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCuidadores();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#A2D5F2" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {users.map((user) => (
//         <View key={user.id} style={styles.card}>
//           <Text style={styles.label}><Text style={styles.bold}>Tutor:</Text> {user.tutor?.name || "No disponible"}</Text>
//           <Text style={styles.label}><Text style={styles.bold}>Email:</Text> {user.tutor?.email || "No disponible"}</Text>
//           <Text style={styles.label}><Text style={styles.bold}>Paciente:</Text> {user.paciente?.name || "No disponible"}</Text>
//           <Text style={styles.label}><Text style={styles.bold}>Diagnóstico:</Text> {user.paciente?.diagnosis || "No disponible"}</Text>
//           <Text style={styles.estado}>
//             Estado:{" "}
//             <Text style={{ color: user.disabled ? "red" : "green" }}>
//               {user.disabled ? "Inactivo" : "Activo"}
//             </Text>
//           </Text>

//           <TouchableOpacity
//             style={[
//               styles.button,
//               { backgroundColor: user.disabled ? "#28a745" : "#dc3545" },
//             ]}
//             onPress={() => toggleAccount(user.id, user.disabled)}
//           >
//             <Text style={styles.buttonText}>
//               {user.disabled ? "ACTIVAR CUENTA" : "DESACTIVAR CUENTA"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     paddingBottom: 50,
//   },
//   card: {
//     backgroundColor: "#f5f7fa",
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//     elevation: 3,
//   },
//   label: {
//     marginBottom: 5,
//     color: "#333",
//   },
//   bold: {
//     fontWeight: "bold",
//   },
//   estado: {
//     fontStyle: "italic",
//     color: "#666",
//     marginBottom: 10,
//   },
//   button: {
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });




// // DESCARGUE
// import React, { useEffect, useState } from "react";
// import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from "react-native";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { auth, firebaseApp } from "../firebaseConfig";

// export default function ViewLabReport() {
//   const [loading, setLoading] = useState(true);
//   const [fileData, setFileData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchLabReport() {
//       try {
//         const user = auth.currentUser;
//         if (!user) {
//           setError("Usuario no autenticado");
//           setLoading(false);
//           return;
//         }

//         const db = getFirestore(firebaseApp);
//         const docRef = doc(db, "users", user.uid);
//         const docSnap = await getDoc(docRef);

//         if (!docSnap.exists()) {
//           setError("No se encontró el documento del usuario");
//           setLoading(false);
//           return;
//         }

//         const data = docSnap.data();
//         const labReport = data?.paciente?.labReport;
//         if (!labReport || !labReport.base64) {
//           setError("No hay archivo de laboratorio guardado");
//           setLoading(false);
//           return;
//         }

//         setFileData(labReport);
//       } catch (e) {
//         setError("Error al obtener el archivo: " + e.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchLabReport();
//   }, []);

//   const downloadFile = async () => {
//     if (!fileData || !fileData.base64) {
//       Alert.alert("Archivo no disponible para descargar");
//       return;
//     }

//     try {
//       setLoading(true);

//       const filename = fileData.name || "archivo.pdf";
//       const fileUri = FileSystem.cacheDirectory + filename;

//       // Guardamos el base64 como archivo real
//       await FileSystem.writeAsStringAsync(fileUri, fileData.base64, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       // Comprobamos si el dispositivo puede compartir el archivo
//       const isAvailable = await Sharing.isAvailableAsync();
//       if (!isAvailable) {
//         Alert.alert("No se puede compartir el archivo en este dispositivo");
//         setLoading(false);
//         return;
//       }

//       // Abrimos el diálogo para compartir/guardar
//       await Sharing.shareAsync(fileUri, {
//         mimeType: fileData.mimeType || "application/pdf",
//         dialogTitle: "Guardar o compartir archivo PDF",
//         UTI: fileData.mimeType || "com.adobe.pdf",
//       });

//     } catch (error) {
//       Alert.alert("Error al descargar archivo", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#1E90FF" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "red" }}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.center}>
//       <Text style={styles.title}>{fileData?.name || "Archivo"}</Text>
//       <Text>Tipo de archivo: {fileData?.mimeType || "Desconocido"}</Text>
//       <Button title="Descargar archivo" onPress={downloadFile} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
// });

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
// import { auth, db } from "../firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";

// export default function HomeScreen() {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const docRef = doc(db, "users", user.uid);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             setUserData(docSnap.data());
//           } else {
//             console.log("No such document!");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
//   }

//   if (!userData) {
//     return (
//       <View style={styles.container}>
//         <Text>No se encontró información del usuario.</Text>
//       </View>
//     );
//   }

//   const { paciente } = userData;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Estado del paciente: {paciente.status}</Text>

//       {paciente.status === "en casa" && (
//         <>
//           <Text style={styles.subtitle}>Recomendaciones:</Text>
//           {paciente.recommendations && paciente.recommendations.length > 0 ? (
//             <FlatList
//               data={paciente.recommendations}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => <Text style={styles.textItem}>- {item}</Text>}
//             />
//           ) : (
//             <Text>No hay recomendaciones registradas.</Text>
//           )}
//         </>
//       )}

//       {paciente.status === "hospitalizado" && (
//         <>
//           <Text style={styles.subtitle}>Recomendaciones hospitalarias:</Text>
//           {paciente.recommendations && paciente.recommendations.length > 0 ? (
//             <FlatList
//               data={paciente.recommendations}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => <Text style={styles.textItem}>- {item}</Text>}
//             />
//           ) : (
//             <Text>No hay recomendaciones registradas.</Text>
//           )}

//           <Text style={styles.subtitle}>Horarios de visita:</Text>
//           {paciente.visitSchedules && paciente.visitSchedules.length > 0 ? (
//             <FlatList
//               data={paciente.visitSchedules}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <Text style={styles.textItem}>
//                   - Día: {item.day}, Hora: {item.time}
//                 </Text>
//               )}
//             />
//           ) : (
//             <Text>No hay horarios de visita registrados.</Text>
//           )}
//         </>
//       )}

//       {paciente.status === "fallecido" && (
//         <Text>El paciente ha fallecido.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#F7F9FB" },
//   title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
//   subtitle: { fontSize: 18, fontWeight: "600", marginTop: 15, marginBottom: 5 },
//   textItem: { fontSize: 16, marginBottom: 4 },
// });
