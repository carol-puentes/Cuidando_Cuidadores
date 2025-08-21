// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   Platform,
//   TouchableOpacity,
//   ImageBackground,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { auth, db } from "../firebaseConfig";
// import { doc, updateDoc, getDoc } from "firebase/firestore";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";

// export default function EditarPacienteScreen({ navigation }) {
//   const [name, setName] = useState("");
//   const [birthDate, setBirthDate] = useState("");
//   const [gender, setGender] = useState("");
//   const [diagnosis, setDiagnosis] = useState("");
//   const [status, setStatus] = useState("en casa");
//   const [nextAppointment, setNextAppointment] = useState("");
//   const [recommendations, setRecommendations] = useState([""]);
//   const [visitSchedules, setVisitSchedules] = useState([{ day: "", time: "" }]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
//   const [showNextAppPicker, setShowNextAppPicker] = useState(false);

//   // Control individual para cada horario
//   const [showDayPickerIndex, setShowDayPickerIndex] = useState(null);
//   const [showTimePickerIndex, setShowTimePickerIndex] = useState(null);

//   useEffect(() => {
//     const fetchPacienteData = async () => {
//       try {
//         const user = auth.currentUser;
//         if (!user) throw new Error("Usuario no autenticado");

//         const docRef = doc(db, "users", user.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           const paciente = data.paciente || {};

//           setName(paciente.name || "");
//           setBirthDate(paciente.birthDate || "");
//           setGender(paciente.gender || "");
//           setDiagnosis(paciente.diagnosis || "");
//           setStatus(paciente.status || "en casa");
//           setNextAppointment(paciente.nextAppointment || "");
//           setRecommendations(
//             paciente.recommendations?.length > 0 ? paciente.recommendations : [""]
//           );
//           setVisitSchedules(
//             paciente.visitSchedules?.length > 0
//               ? paciente.visitSchedules
//               : [{ day: "", time: "" }]
//           );
//         } else {
//           Alert.alert("No se encontró información del paciente");
//           navigation.goBack();
//         }
//       } catch (error) {
//         Alert.alert("Error", error.message);
//         navigation.goBack();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPacienteData();
//   }, []);

//   const formatDate = (date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const d = String(date.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   };

//   const formatTime = (date) => {
//     const h = String(date.getHours()).padStart(2, "0");
//     const min = String(date.getMinutes()).padStart(2, "0");
//     return `${h}:${min}`;
//   };

//   const onChangeBirthDate = (event, selectedDate) => {
//     setShowBirthDatePicker(false);
//     if (selectedDate) setBirthDate(formatDate(selectedDate));
//   };

//   const onChangeNextAppointment = (event, selectedDate) => {
//     setShowNextAppPicker(false);
//     if (selectedDate) setNextAppointment(formatDate(selectedDate));
//   };

//   const handleRecChange = (text, index) => {
//     const newRecs = [...recommendations];
//     newRecs[index] = text;
//     setRecommendations(newRecs);
//   };

//   const addRecommendation = () => setRecommendations([...recommendations, ""]);
//   const removeRecommendation = (index) => {
//     if (recommendations.length > 1)
//       setRecommendations(recommendations.filter((_, i) => i !== index));
//   };

//   const handleVisitChange = (field, value, index) => {
//     const newVisits = [...visitSchedules];
//     newVisits[index][field] = value;
//     setVisitSchedules(newVisits);
//   };

//   const addVisitSchedule = () =>
//     setVisitSchedules([...visitSchedules, { day: "", time: "" }]);
//   const removeVisitSchedule = (index) => {
//     if (visitSchedules.length > 1)
//       setVisitSchedules(visitSchedules.filter((_, i) => i !== index));
//   };

//   const onSave = async () => {
//     if (!name.trim() || !birthDate.trim() || !gender.trim()) {
//       Alert.alert("Por favor completa los campos obligatorios");
//       return;
//     }

//     try {
//       setSaving(true);
//       const user = auth.currentUser;
//       if (!user) throw new Error("Usuario no autenticado");

//       const docRef = doc(db, "users", user.uid);
//       await updateDoc(docRef, {
//         "paciente.name": name,
//         "paciente.birthDate": birthDate,
//         "paciente.gender": gender,
//         "paciente.diagnosis": diagnosis,
//         "paciente.status": status,
//         "paciente.nextAppointment": nextAppointment,
//         "paciente.recommendations":
//           status === "fallecido"
//             ? []
//             : recommendations.filter((r) => r.trim() !== ""),
//         "paciente.visitSchedules":
//           status === "hospitalizado"
//             ? visitSchedules.filter(
//                 (v) => v.day.trim() !== "" && v.time.trim() !== ""
//               )
//             : [],
//       });

//       Alert.alert("Éxito", "Datos del paciente actualizados");
//       navigation.goBack();
//     } catch (error) {
//       Alert.alert("Error al guardar", error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#4A90E2" />
//       </View>
//     );
//   }

//   return (
//     <ImageBackground
//       source={require("../assets/fondo_principal.png")}
//       style={styles.imageBackground}
//       resizeMode="cover"
//     >
//       <BlurView intensity={50} tint="light" style={styles.blurContainer}>
//         <ScrollView contentContainerStyle={{ padding: 30 }} keyboardShouldPersistTaps="handled">
//           <Text style={styles.label}>Nombre</Text>
//           <TextInput style={styles.input} value={name} onChangeText={setName} />

//           <Text style={styles.label}>Fecha de nacimiento</Text>
//           <TouchableOpacity onPress={() => setShowBirthDatePicker(true)} style={styles.input}>
//             <Text>{birthDate || "Selecciona una fecha"}</Text>
//           </TouchableOpacity>
//           {showBirthDatePicker && (
//             <DateTimePicker
//               value={birthDate ? new Date(birthDate) : new Date()}
//               mode="date"
//               display="default"
//               onChange={onChangeBirthDate}
//             />
//           )}

//           <Text style={styles.label}>Género</Text>
//           <View style={styles.pickerIOS}>
//             <Picker
//               selectedValue={gender}
//               onValueChange={(itemValue) => setGender(itemValue)}
//               mode={Platform.OS === "android" ? "dialog" : undefined}
//               style={styles.picker}
//             >
//               <Picker.Item label="Selecciona género" value="" />
//               <Picker.Item label="Masculino" value="masculino" />
//               <Picker.Item label="Femenino" value="femenino" />
//               <Picker.Item label="No binario" value="no_binario" />
//               <Picker.Item label="Prefiero no decirlo" value="prefiero_no_decirlo" />
//               <Picker.Item label="Otro" value="otro" />
//             </Picker>
//           </View>

//           <Text style={styles.label}>Diagnóstico</Text>
//           <TextInput style={styles.input} value={diagnosis} onChangeText={setDiagnosis} />

//           <Text style={styles.label}>Estado</Text>
//           <View style={Platform.OS === "android" ? styles.pickerAndroid : styles.pickerIOS}>
//             <Picker selectedValue={status} onValueChange={setStatus}>
//               <Picker.Item label="En casa" value="en casa" />
//               <Picker.Item label="Hospitalizado" value="hospitalizado" />
//               <Picker.Item label="Fallecido" value="fallecido" />
//             </Picker>
//           </View>

//           {(status === "en casa" || status === "hospitalizado") && (
//             <>
//               <Text style={styles.label}>Recomendaciones</Text>
//               {recommendations.map((rec, i) => (
//                 <View key={i} style={styles.dynamicRow}>
//                   <TextInput
//                     style={[styles.input, { flex: 1 }]}
//                     placeholder={`Recomendación #${i + 1}`}
//                     value={rec}
//                     onChangeText={(text) => handleRecChange(text, i)}
//                   />
//                   {recommendations.length > 1 && (
//                     <Button title="Eliminar" color="#d9534f" onPress={() => removeRecommendation(i)} />
//                   )}
//                 </View>
//               ))}
//               <Button title="Añadir recomendación" onPress={addRecommendation} />
//             </>
//           )}

//           {status === "hospitalizado" && (
//             <>
//               <Text style={[styles.label, { marginTop: 20 }]}>Horarios de visita</Text>
//               {visitSchedules.map((visit, i) => (
//                 <View key={i} style={[styles.dynamicRow, { marginBottom: 10 }]}>
//                   <TouchableOpacity
//                     style={[styles.input, { flex: 1, marginRight: 10 }]}
//                     onPress={() => setShowDayPickerIndex(i)}
//                   >
//                     <Text>{visit.day || "Seleccionar día"}</Text>
//                   </TouchableOpacity>
//                   {showDayPickerIndex === i && (
//                     <DateTimePicker
//                       value={visit.day ? new Date(visit.day) : new Date()}
//                       mode="date"
//                       display="default"
//                       onChange={(event, selectedDate) => {
//                         setShowDayPickerIndex(null);
//                         if (selectedDate) handleVisitChange("day", formatDate(selectedDate), i);
//                       }}
//                     />
//                   )}

//                   <TouchableOpacity
//                     style={[styles.input, { flex: 1 }]}
//                     onPress={() => setShowTimePickerIndex(i)}
//                   >
//                     <Text>{visit.time || "Seleccionar hora"}</Text>
//                   </TouchableOpacity>
//                   {showTimePickerIndex === i && (
//                     <DateTimePicker
//                       value={visit.time ? new Date(`1970-01-01T${visit.time}:00`) : new Date()}
//                       mode="time"
//                       is24Hour={true}
//                       display="spinner"
//                       onChange={(event, selectedDate) => {
//                         setShowTimePickerIndex(null);
//                         if (selectedDate) handleVisitChange("time", formatTime(selectedDate), i);
//                       }}
//                     />
//                   )}

//                   {visitSchedules.length > 1 && (
//                     <Button title="Eliminar" color="#d9534f" onPress={() => removeVisitSchedule(i)} />
//                   )}
//                 </View>
//               ))}
//               <Button title="Añadir horario" onPress={addVisitSchedule} />
//             </>
//           )}

//           {status === "fallecido" && (
//             <Text style={styles.infoText}>El paciente ha fallecido. No hay campos adicionales.</Text>
//           )}

//           <Text style={styles.label}>Próxima cita</Text>
//           <TouchableOpacity onPress={() => setShowNextAppPicker(true)} style={styles.input}>
//             <Text>{nextAppointment || "Selecciona una fecha"}</Text>
//           </TouchableOpacity>
//           {showNextAppPicker && (
//             <DateTimePicker
//               value={nextAppointment ? new Date(nextAppointment) : new Date()}
//               mode="date"
//               display="default"
//               onChange={onChangeNextAppointment}
//             />
//           )}

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity onPress={onSave} disabled={saving}>
//               <LinearGradient colors={["#4A90E2", "#357ABD"]} style={styles.saveButton}>
//                 {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar</Text>}
//               </LinearGradient>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <LinearGradient colors={["#999", "#777"]} style={styles.cancelButton}>
//                 <Text style={styles.buttonText}>Volver</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </BlurView>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   imageBackground: { flex: 1, width: "100%", height: "100%" },
//   blurContainer: { flex: 1 },
//   label: { fontSize: 16, fontWeight: "bold", marginBottom: 6, marginTop: 12 },
//   input: { backgroundColor: "#f5f5f5", borderRadius: 8, padding: 12, marginBottom: 8 },
//   pickerAndroid: { backgroundColor: "#f5f5f5", borderRadius: 8 },
//   pickerIOS: { backgroundColor: "#f5f5f5", borderRadius: 8 },
//   buttonContainer: { marginTop: 30, marginBottom: 40 },
//   saveButton: { paddingVertical: 14, borderRadius: 8, alignItems: "center", marginBottom: 10 },
//   cancelButton: { paddingVertical: 14, borderRadius: 8, alignItems: "center" },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   dynamicRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
//   infoText: { fontSize: 14, color: "#666", marginTop: 8 },
//   centered: { flex: 1, justifyContent: "center", alignItems: "center" },
// });






import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

export default function EditarLabReportScreen() {
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);
  const [nuevoArchivo, setNuevoArchivo] = useState(null);
  const [base64Archivo, setBase64Archivo] = useState(null);

  // Cargar datos actuales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPaciente(data.paciente);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Seleccionar archivo y convertir a base64
  const seleccionarArchivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name;

      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setNuevoArchivo(fileName);
      setBase64Archivo(base64);
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar el archivo.");
    }
  };

  // Guardar cambios
  const guardarCambios = async () => {
    if (!base64Archivo) {
      Alert.alert("Error", "Debes seleccionar un archivo primero.");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);

      await updateDoc(userRef, {
        "paciente.labReport": {
          fileName: nuevoArchivo,
          fileData: base64Archivo,
        },
      });

      Alert.alert("Éxito", "Archivo actualizado correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el archivo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Reporte de Laboratorio</Text>

      {paciente?.labReport?.fileName ? (
        <Text style={styles.archivoActual}>
          Archivo actual: {paciente.labReport.fileName}
        </Text>
      ) : (
        <Text style={styles.archivoActual}>No hay archivo cargado</Text>
      )}

      <TouchableOpacity style={styles.boton} onPress={seleccionarArchivo}>
        <Text style={styles.botonTexto}>Seleccionar nuevo archivo</Text>
      </TouchableOpacity>

      {nuevoArchivo && (
        <Text style={styles.archivoNuevo}>Nuevo archivo: {nuevoArchivo}</Text>
      )}

      <TouchableOpacity style={styles.botonGuardar} onPress={guardarCambios}>
        <Text style={styles.botonTexto}>Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  archivoActual: { fontSize: 16, marginBottom: 10 },
  archivoNuevo: { fontSize: 16, marginTop: 10 },
  boton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  botonGuardar: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  botonTexto: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
