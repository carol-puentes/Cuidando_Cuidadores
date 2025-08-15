// import React from "react";
// import { View, Text } from "react-native";

// export default function ProgressScreen() {
//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Pantalla de Progreso</Text>
//     </View>
//   );
// }






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







// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   ScrollView,
//   Button,
//   Alert,
// } from "react-native";
// import { auth, db, firebaseApp } from "../firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";

// export default function PerfilScreen() {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [downloading, setDownloading] = useState(false);

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
//             Alert.alert("No se encontró información del usuario");
//           }
//         } catch (error) {
//           Alert.alert("Error al obtener datos", error.message);
//         }
//       } else {
//         Alert.alert("Usuario no autenticado");
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, []);

//   const downloadLabReport = async () => {
//     if (!userData) return;

//     const labReport = userData?.paciente?.labReport;

//     if (!labReport || !labReport.base64) {
//       Alert.alert("No hay archivo de laboratorio para descargar");
//       return;
//     }

//     try {
//       setDownloading(true);

//       const filename = labReport.name || "archivo.pdf";
//       const fileUri = FileSystem.cacheDirectory + filename;

//       await FileSystem.writeAsStringAsync(fileUri, labReport.base64, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       const isAvailable = await Sharing.isAvailableAsync();
//       if (!isAvailable) {
//         Alert.alert("No se puede compartir el archivo en este dispositivo");
//         setDownloading(false);
//         return;
//       }

//       await Sharing.shareAsync(fileUri, {
//         mimeType: labReport.mimeType || "application/pdf",
//         dialogTitle: "Guardar o compartir archivo PDF",
//         UTI: labReport.mimeType || "com.adobe.pdf",
//       });
//     } catch (error) {
//       Alert.alert("Error al descargar archivo", error.message);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#1E90FF" />
//       </View>
//     );
//   }

//   if (!userData) {
//     return (
//       <View style={styles.centered}>
//         <Text>No hay datos para mostrar.</Text>
//       </View>
//     );
//   }

//   const { tutor, paciente } = userData;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.sectionTitle}>Información del Cuidador</Text>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Nombre:</Text>
//         <Text style={styles.value}>{tutor?.name || "-"}</Text>
//       </View>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Género:</Text>
//         <Text style={styles.value}>{tutor?.gender || "-"}</Text>
//       </View>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Correo electrónico:</Text>
//         <Text style={styles.value}>{tutor?.email || "-"}</Text>
//       </View>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Contraseña:</Text>
//         <Text style={styles.value}>
//           {/* Solo mostrar a modo informativo, no recomendado en apps reales */}
//           {"********"}
//         </Text>
//       </View>

//       <Text style={styles.sectionTitle}>Información del Paciente</Text>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Nombre:</Text>
//         <Text style={styles.value}>{paciente?.name || "-"}</Text>
//       </View>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Fecha de nacimiento:</Text>
//         <Text style={styles.value}>{paciente?.birthDate || "-"}</Text>
//       </View>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Género:</Text>
//         <Text style={styles.value}>{paciente?.gender || "-"}</Text>
//       </View>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Diagnóstico:</Text>
//         <Text style={styles.value}>{paciente?.diagnosis || "-"}</Text>
//       </View>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Estado:</Text>
//         <Text style={styles.value}>{paciente?.status || "-"}</Text>
//       </View>

//       <View style={styles.infoBlock}>
//         <Text style={styles.label}>Próxima cita:</Text>
//         <Text style={styles.value}>{paciente?.nextAppointment || "-"}</Text>
//       </View>

//       {(paciente?.status === "en casa" || paciente?.status === "hospitalizado") && (
//         <>
//           <Text style={styles.sectionTitle}>Recomendaciones</Text>
//           {paciente?.recommendations && paciente.recommendations.length > 0 ? (
//             <FlatList
//               data={paciente.recommendations}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => <Text style={styles.listItem}>- {item}</Text>}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.value}>No hay recomendaciones registradas.</Text>
//           )}
//         </>
//       )}

//       {paciente?.status === "hospitalizado" && (
//         <>
//           <Text style={styles.sectionTitle}>Horarios de visita</Text>
//           {paciente?.visitSchedules && paciente.visitSchedules.length > 0 ? (
//             <FlatList
//               data={paciente.visitSchedules}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <Text style={styles.listItem}>
//                   - Día: {item.day}, Hora: {item.time}
//                 </Text>
//               )}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.value}>No hay horarios de visita registrados.</Text>
//           )}
//         </>
//       )}

//       <Text style={styles.sectionTitle}>Archivo de laboratorio</Text>
//       {paciente?.labReport && paciente.labReport.base64 ? (
//         <Button
//           title={downloading ? "Descargando..." : "Descargar archivo PDF"}
//           onPress={downloadLabReport}
//           disabled={downloading}
//         />
//       ) : (
//         <Text style={styles.value}>No hay archivo de laboratorio disponible.</Text>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#F7F9FB",
//     flexGrow: 1,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginTop: 15,
//     marginBottom: 10,
//     color: "#4a90e2",
//   },
//   infoBlock: {
//     marginBottom: 10,
//   },
//   label: {
//     fontWeight: "600",
//     fontSize: 16,
//     color: "#333",
//   },
//   value: {
//     fontSize: 16,
//     color: "#555",
//     marginTop: 2,
//   },
//   listItem: {
//     fontSize: 16,
//     color: "#555",
//     marginLeft: 10,
//     marginBottom: 4,
//   },
// });

// PerfilNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PerfilScreen from './PerfilScreen';
import EditarTutorScreen from './EditarTutorScreen';
import EditarPacienteScreen from './EditarPacienteScreen';

const Stack = createNativeStackNavigator();

export default function PerfilNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="EditarTutor" component={EditarTutorScreen} />
      <Stack.Screen name="EditarPaciente" component={EditarPacienteScreen} />
    </Stack.Navigator>
  );
}
