import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Dimensions, ScrollView, Modal} from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from "react-native-vector-icons/Ionicons";


// --- Componente de fondo decorativo ---
const DynamicIslandBackground = () => {
  const { width } = Dimensions.get("window");

  return (
    <>
     {/* Fondo superior */}
      <View
        style={{ position: "absolute", top: 0, left: 0, width, height: 250 }}
      >
        <Svg width={width} height={250} viewBox={`0 0 ${width} 250`}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="10%" stopColor="#A2D5F2" />
              <Stop offset="100%" stopColor="#B8E8D2" />
            </LinearGradient>
          </Defs>
           {/* Curvas SVG para el fondo */}
          <Path
            d={`M0,150 Q${width * 0.25},50 ${width * 0.5},80 Q${
              width * 0.75
            },120 ${width},90 L${width},0 L0,0 Z`}
            fill="url(#grad)"
          />
        </Svg>
      </View>
    {/* Fondo inferior (rotado 180°) */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width,
          height: 150,
          transform: [{ rotate: "180deg" }],
        }}
      >
        <Svg width={width} height={150} viewBox={`0 0 ${width} 150`}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="10%" stopColor="#A2D5F2" />
              <Stop offset="100%" stopColor="#B8E8D2" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0,150 Q${width * 0.25},50 ${width * 0.5},80 Q${
              width * 0.75
            },120 ${width},90 L${width},0 L0,0 Z`}
            fill="url(#grad)"
          />
        </Svg>
      </View>
    </>
  );
};

const calculateAge = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);

  const [termsVisible, setTermsVisible] = useState(false);

  // Tutor
  const [tutorName, setTutorName] = useState("");
  const [tutorBirthDate, setTutorBirthDate] = useState("");
  const [tutorGender, setTutorGender] = useState("");
  const [tutorAddress, setTutorAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

  // Paciente
  const [patientName, setPatientName] = useState("");
  const [patientBirthDate, setPatientBirthDate] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientDiagnosis, setPatientDiagnosis] = useState("");
  const [labReport, setLabReport] = useState(null);

  const [proximaCitaFecha, setProximaCitaFecha] = useState(null);
  const [proximaCitaHora, setProximaCitaHora] = useState(null);

  const [mostrarPickerFechaCita, setMostrarPickerFechaCita] = useState(false);
  const [mostrarPickerHoraCita, setMostrarPickerHoraCita] = useState(false);

  const [nextAppointmentDate, setNextAppointmentDate] = useState(null);
  const [showAppointmentDatePicker, setShowAppointmentDatePicker] =
    useState(false);
  const [showAppointmentTimePicker, setShowAppointmentTimePicker] =
    useState(false);

  const [labReportBase64, setLabReportBase64] = useState(null);

  // Date pickers
  const [showTutorDatePicker, setShowTutorDatePicker] = useState(false);
  const [showPatientDatePicker, setShowPatientDatePicker] = useState(false);

  const [showTimePickerIndex, setShowTimePickerIndex] = useState(null);
  const [showDatePickerIndex, setShowDatePickerIndex] = useState(null);
  const [timePickerValue, setTimePickerValue] = useState(new Date());

  // Nuevo: Estado del paciente y campos dinámicos
  const [status, setStatus] = useState(""); // 'en casa', 'hospitalizado', 'fallecido'
  const [recommendations, setRecommendations] = useState([""]);
  const [visitSchedules, setVisitSchedules] = useState([]);

  // Funciones para recomendaciones dinámicas
  const addRecommendationField = () => {
    setRecommendations([...recommendations, ""]);
  };
  const removeRecommendationField = (index) => {
    setRecommendations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRecommendation = (text, index) => {
    const newRecs = [...recommendations];
    newRecs[index] = text;
    setRecommendations(newRecs);
  };

  // Funciones para horarios de visita dinámicos
  const addVisitSchedule = () => {
    setVisitSchedules([...visitSchedules, { day: "", time: "" }]);
  };
  const removeVisitSchedule = (index) => {
    const newSchedules = visitSchedules.filter((_, i) => i !== index);
    setVisitSchedules(newSchedules);
  };

  const updateVisitSchedule = (field, value, index) => {
    const newSchedules = [...visitSchedules];
    newSchedules[index][field] = value;
    setVisitSchedules(newSchedules);
  };

  const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const TermsModal = ({ visible, onAccept, onClose }) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
    <View style={{ flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"rgba(0,0,0,0.5)" }}>
      <View style={{ width:"85%", height:"70%", padding:20, backgroundColor:"white", borderRadius:12 }}>
        <Text style={{ fontSize:18, fontWeight:"bold", marginBottom:10 }}>Términos y Condiciones</Text>

        <ScrollView style={{ flex:1, marginBottom:10,  }}>
          <Text style={{ marginBottom:10, textAlign:"justify", }}>
            Bienvenido/a a la aplicación <Text style={{ fontWeight: "bold" }}>Arte-Sanos del Cuidado</Text>.
            Al registrarse y utilizar esta aplicación, usted acepta los siguientes términos y condiciones:
          </Text>

          <Text style={{ fontWeight:"bold", marginTop:10, }}>1. Aceptación de términos</Text>
          <Text style={{ marginBottom:10, textAlign:"justify",}}>
            El uso de esta aplicación implica la aceptación plena y sin reservas de todos los términos y condiciones aquí establecidos.
          </Text>

          <Text style={{ fontWeight:"bold", marginTop:10 }}>2. Uso de la aplicación</Text>
          <Text style={{ marginBottom:10, textAlign:"justify", }}>
            Esta aplicación está destinada a cuidadores y administradores.
            Usted se compromete a usarla únicamente con fines personales y respetuosos,
            evitando el uso indebido o fraudulento.
          </Text>

          <Text style={{ fontWeight:"bold", marginTop:10 }}>3. Registro de usuarios</Text>
          <Text style={{ marginBottom:10, textAlign:"justify",}}>
            Al registrarse, usted acepta proporcionar información veraz y actualizada.
            El incumplimiento puede conllevar a la suspensión o eliminación de la cuenta.
          </Text>

          <Text style={{ fontWeight:"bold", marginTop:10 }}>4. Responsabilidad del usuario</Text>
          <Text style={{ marginBottom:10, textAlign:"justify", }}>
            Usted es responsable del uso que haga de la aplicación, incluyendo los datos
            que registre y la información que comparta.
          </Text>

          <Text style={{ fontWeight:"bold", marginTop:10 }}>5. Privacidad y protección de datos</Text>
          <Text style={{ marginBottom:10, textAlign:"justify", }}>
            Los datos proporcionados serán tratados de acuerdo con nuestra Política de Privacidad.
            No compartiremos su información personal con terceros sin su consentimiento.
          </Text>

          <Text style={{ fontWeight:"bold", marginTop:10 }}>6. Modificaciones</Text>
          <Text style={{ marginBottom:10, textAlign:"justify",}}>
            Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
            Las modificaciones serán notificadas en la aplicación.
          </Text>

          <Text style={{ fontWeight:"bold", marginTop:10 }}>7. Contacto</Text>
          <Text style={{ marginBottom:10, textAlign:"justify", }}>
            Para cualquier consulta o reclamo puede escribirnos a: {"\n"}
            <Text style={{ fontWeight: "bold" }}>artesanosdelcuidado.app@gmail.com</Text>
          </Text>
        </ScrollView>

        <TouchableOpacity style={{ backgroundColor:"#8080ff", padding:10, borderRadius:8, marginBottom:10 }} onPress={onAccept}>
          <Text style={{ color:"white", textAlign:"center" }}>Aceptar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ backgroundColor:"gray", padding:10, borderRadius:8 }} onPress={onClose}>
          <Text style={{ color:"white", textAlign:"center" }}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log("Resultado picker:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        const base64String = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setLabReport({
          name: file.name,
          mimeType: file.mimeType || "",
        });

        setLabReportBase64(base64String);
      } else if (result.canceled) {
        Toast.show({
          type: "info",
          text1: "Selección cancelada",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error desconocido en selección",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al seleccionar el archivo",
        text2: error.message,
      });
    }

  };

  // Validaciones y navegación entre pasos
  const handleNext = () => {
    if (
      !tutorName ||
      !tutorBirthDate ||
      !tutorGender ||
      !tutorAddress ||
      !email ||
      !password
    ) {
      Toast.show({
        type: "error",
        text1: "Completa todos los campos del tutor.",
      });
      return;
    }

    if (!isValidEmail(email)) {
    Toast.show({
      type: "error",
      text1: "Ingresa un correo válido.",
    });
    return;
  }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
    setStep(2);
  };

  const handleSecondNext = () => {
    if (!patientName || !patientBirthDate || !patientGender) {
      Toast.show({
        type: "error",
        text1: "Completa todos los campos del paciente.",
      });
      return;
    }
    setStep(3);
  };

  const handleThirdNext = () => {
    // Validación para recomendaciones
    const hasEmptyRecommendation = recommendations.some(
      (rec) => rec.trim() === ""
    );

    if (recommendations.length === 0 || hasEmptyRecommendation) {
      Toast.show({
        type: "error",
        text1: "Completa todas las recomendaciones.",
      });
      return;
    }

    // Validación adicional si está hospitalizado

    if (status === "hospitalizado") {
  const hasEmptySchedule = visitSchedules.some(
    (s) => !s.date || !s.time || s.date.trim?.() === "" || s.time.trim() === ""
  );

  if (visitSchedules.length === 0 || hasEmptySchedule) {
    Toast.show({
      type: "error",
      text1: "Completa todos los horarios de visita.",
    });
    return;
  }
}

    // Si todo está bien, continuar
    setStep(3); // o la siguiente acción
  };

  // Registro final con toda la info
const handleRegister = async () => {
  if (!patientDiagnosis || !labReport || !labReportBase64) {
    Toast.show({
      type: "error",
      text1: "Completa el diagnóstico y adjunta el laboratorio.",
    });
    return;
  }
  if (!status) {
    Toast.show({
      type: "error",
      text1: "Selecciona el estado del paciente.",
    });
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      role: "cuidador",
      rolNumber: 1, // <-- Nuevo campo agregado
      tutor: {
        name: tutorName,
        birthDate: tutorBirthDate,
        gender: tutorGender,
        address: tutorAddress,
        email,
      },
paciente: {
  name: patientName,
  birthDate: patientBirthDate,
  gender: patientGender,
  diagnosis: patientDiagnosis,
  labReport: {
    name: labReport.name,
    mimeType: labReport.mimeType,
    base64: labReportBase64,
  },
  status,
  recommendations: recommendations.filter((r) => r.trim() !== ""),
  visitSchedules:
    status === "hospitalizado"
      ? visitSchedules.filter((v) => v.day && v.time)
      : [],
  // Guardamos la próxima cita como string "YYYY-MM-DD HH:mm"
  nextAppointment:
    proximaCitaFecha && proximaCitaHora
      ? `${proximaCitaFecha.toISOString().split("T")[0]} ${proximaCitaHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : null,
}

    });

    Toast.show({
      type: "success",
      text1: "Registro exitoso",
      text2: "¡Bienvenido!",
    });
    navigation.navigate("Login");
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Error al registrar",
      text2: error.message,
    });
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DynamicIslandBackground />
      <Text style={styles.title}>
        {step === 1
          ? "Registro del Tutor"
          : step === 2
          ? "Registro del Paciente"
          : step === 3
          ? "Diagnóstico y Laboratorio"
          : ""}
      </Text>formatDate

      {/* Paso 1 - Tutor */}

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre del tutor"
            value={tutorName}
            onChangeText={setTutorName}
          />
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTutorDatePicker(true)}
          >
            <Text>{tutorBirthDate || "Fecha de nacimiento"}</Text>
          </TouchableOpacity>
          {showTutorDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowTutorDatePicker(false);
                if (selectedDate) {
                  const age = calculateAge(selectedDate);
                  if (age < 18) {
                    Toast.show({
                      type: "error",
                      text1: "El tutor debe tener al menos 18 años.",
                    });
                    return;
                  }
                  if (age > 80) {
                    Toast.show({
                      type: "error",
                      text1: "Seleccione una fecha correcta.",
                    });
                    return;
                  }
                  setTutorBirthDate(selectedDate.toISOString().split("T")[0]);
                }
              }}
            />
          )}
          <View style={styles.pickerContainer}>
            <Picker selectedValue={tutorGender} onValueChange={setTutorGender}>
              <Picker.Item label="Selecciona género" value="" />
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Femenino" value="femenino" />
              <Picker.Item label="No binario" value="no_binario" />
              <Picker.Item
                label="Prefiero no decirlo"
                value="prefiero_no_decirlo"
              />
              <Picker.Item label="Otro" value="otro" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={tutorAddress}
            onChangeText={setTutorAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          /> */}

          <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>¿Ya tienes cuenta? Ingresa</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Paso 2 - Paciente */}
      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre del paciente"
            value={patientName}
            onChangeText={setPatientName}
          />
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPatientDatePicker(true)}
          >
            <Text>{patientBirthDate || "Fecha de nacimiento"}</Text>
          </TouchableOpacity>
          {showPatientDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowPatientDatePicker(false);
                if (selectedDate) {
                  setPatientBirthDate(selectedDate.toISOString().split("T")[0]);
                }
              }}
            />
          )}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={patientGender}
              onValueChange={setPatientGender}
            >
              <Picker.Item label="Selecciona género" value="" />
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Femenino" value="femenino" />
              <Picker.Item label="No binario" value="no_binario" />
              <Picker.Item
                label="Prefiero no decirlo"
                value="prefiero_no_decirlo"
              />
              <Picker.Item label="Otro" value="otro" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSecondNext}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.buttonVolver}>Volver</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Paso 3 - Diagnóstico, laboratorio y estado */}
      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Diagnóstico"
            multiline
            value={patientDiagnosis}
            onChangeText={setPatientDiagnosis}
          />

          <TouchableOpacity style={styles.input} onPress={pickDocument}>
            <Text style={{ color: labReport ? "#000" : "#999" }}>
              {labReport
                ? `Archivo: ${labReport.name}`
                : "Adjuntar laboratorio"}
            </Text>
          </TouchableOpacity>

{/* Borrar */}
          <View style={styles.date}>
            <Text style={{ marginBottom: 8, color: "#5a5a5a" }}>
              Próxima cita:
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >

              <TouchableOpacity
                style={{
                  flex: 1,
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 4,
                  marginRight: 8,
                }}
                onPress={() => setMostrarPickerFechaCita(true)}
              >
                <Text>
                  {proximaCitaFecha
                    ? proximaCitaFecha.toLocaleDateString()
                    : "Fecha"}
                </Text>
              </TouchableOpacity>
              {mostrarPickerFechaCita && (
                <DateTimePicker
                  value={proximaCitaFecha || new Date()}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setMostrarPickerFechaCita(false);
                    if (selectedDate) {
                      setProximaCitaFecha(selectedDate);
                    }
                  }}
                />
              )}

              <TouchableOpacity
                style={{ flex: 1, borderWidth: 1, padding: 8, borderRadius: 4 }}
                onPress={() => setMostrarPickerHoraCita(true)}
              >
                <Text>
                  {proximaCitaHora
                    ? proximaCitaHora.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Hora"}
                </Text>
              </TouchableOpacity>
              {mostrarPickerHoraCita && (
                <DateTimePicker
                  value={proximaCitaHora || new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setMostrarPickerHoraCita(false);
                    if (selectedTime) {
                      setProximaCitaHora(selectedTime);
                    }
                  }}
                />
              )}
            </View>
          </View>

          {/* Estado del paciente */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={(value) => {
                setStatus(value);
                if (value === "en casa" || value === "hospitalizado") {
                  setStep(4); // Ir a nuevo paso
                }
              }}
            >
              <Picker.Item label="Seleccione estado" value="" />
              <Picker.Item label="En casa" value="en casa" />
              <Picker.Item label="Hospitalizado" value="hospitalizado" />
              <Picker.Item label="Fallecido" value="fallecido" />
            </Picker>
          </View>

          <TouchableOpacity
  style={styles.button}
  onPress={() => setTermsVisible(true)}
>
  <Text style={styles.buttonText}>Registrar</Text>
</TouchableOpacity>

<TermsModal
  visible={termsVisible}
  onAccept={() => {
    setTermsVisible(false);
    handleRegister(); // aquí sí se registra
  }}
  onClose={() => setTermsVisible(false)}
/>

        </>
      )}
      {/* Paso 4 - Recomendaciones y horarios si aplica */}

      {step === 4 && (
        <>
          {status === "en casa" && (
            <Text style={styles.title}>Cuidados en casa</Text>
          )}
          {status === "hospitalizado" && (
            <Text style={styles.title}>Cuidados en hospital</Text>
          )}

          {/* Recomendaciones */}
          <View style={styles.Divrecomendation}>
            <Text style={{ marginBottom: 8, color: "#5a5a5a" }}>
              Recomendaciones
            </Text>
            {recommendations.map((rec, i) => (
              <View key={i} style={styles.recommendationRow}>
                <TextInput
                  style={styles.recommendationInput}
                  placeholder={`Recomendación #${i + 1}`}
                  value={rec}
                  onChangeText={(text) => updateRecommendation(text, i)}
                />
                <TouchableOpacity
                  onPress={() => removeRecommendationField(i)}
                  style={[styles.circleButton, styles.deleteButton]}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>−</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View
            style={{ alignItems: "center", width: "80%", marginBottom: 50 }}
          >
            <TouchableOpacity onPress={addRecommendationField}>
              <Text style={styles.buttonVolver}>+ Añadir otra</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (status === "hospitalizado") {
                setStep(5); // Mostrar horarios de visita
              } else {
                handleThirdNext(); // Continuar normalmente
              }
            }}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep(3)}>
            <Text style={styles.buttonVolver}>Volver</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 5 && status === "hospitalizado" && (
        <>
          <Text style={styles.title}>Cuidados en hospital</Text>

          <View style={styles.date}>
            <Text style={{ marginBottom: 8, color: "#5a5a5a" }}>
              Horarios de visitas:
            </Text>

            {visitSchedules.map((schedule, i) => (
              <View key={i} style={{ marginBottom: 15 }}>
                {/* Día y Hora */}
                <View style={{ flexDirection: "row", marginBottom: 6 }}>
                  {/* Fecha */}
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginRight: 5,
                      borderWidth: 1,
                      padding: 8,
                      borderRadius: 4,
                    }}
                    onPress={() => setShowDatePickerIndex(i)}
                  >
                    <Text>
                      {schedule.date
                        ? new Date(schedule.date).toLocaleDateString()
                        : "Fecha"}
                    </Text>
                  </TouchableOpacity>

                  {/* Hora */}
                  <TouchableOpacity
                    style={{ flex: 1, marginLeft: 5, borderWidth: 1, padding: 8, borderRadius: 4, justifyContent: "center",}}
                    onPress={() => { setShowTimePickerIndex(i);
                      if (schedule.time) {
                        const [hours, minutes] = schedule.time.split(":");
                        const date = new Date();
                        date.setHours(parseInt(hours), parseInt(minutes));
                        setTimePickerValue(date);
                      } else {
                        setTimePickerValue(new Date());
                      }
                    }}
                  >
                    <Text>{schedule.time || "Hora"}</Text>
                  </TouchableOpacity>

                   <TouchableOpacity
                  onPress={() => removeVisitSchedule(i)}
                  style={[styles.circleButton, styles.deleteButton]}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>−</Text>
                </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Date Picker */}
            {showDatePickerIndex !== null && (
              <DateTimePicker
                value={
                  visitSchedules[showDatePickerIndex].date
                    ? new Date(visitSchedules[showDatePickerIndex].date)
                    : new Date()
                }
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePickerIndex(null);
                  if (selectedDate) {
                    updateVisitSchedule(
                      "date",
                      selectedDate.toISOString(),
                      showDatePickerIndex
                    );
                  }
                }}
              />
            )}

            {/* Time Picker */}
{showTimePickerIndex !== null && (
  <DateTimePicker
    value={timePickerValue}
    mode="time"
    is24Hour={true}
    display="default"
    onChange={(event, selectedTime) => {
      if (event.type === "set" && selectedTime) {
        const hours = selectedTime.getHours().toString().padStart(2, "0");
        const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;
        updateVisitSchedule("time", formattedTime, showTimePickerIndex);
      }
      setShowTimePickerIndex(null);
    }}
  />
)}

            {/* Botón añadir */}
            <View
              style={{ alignItems: "center", width: "80%", marginBottom: 50 }}
            >
              <TouchableOpacity onPress={addVisitSchedule}>
                <Text style={styles.buttonVolver}>+ Añadir otra</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleThirdNext}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep(4)}>
            <Text style={styles.buttonVolver}> Volver </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  date: {
    width: "80%",
    marginBottom: 10,
    color: "#ccc",
  },

  Divrecomendation: {
    marginTop: 40,
    width: "80%",
    marginBottom: 1,
    color: "#ccc",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  pickerContainer: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#8080ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
    marginBottom: 10,
  },
  buttonVolver: {
    color: "#8080ff",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loginLink: {
    color: "#555",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },

  recommendationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },

  recommendationInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "80%",
    backgroundColor: "#aaa",
  },

  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  deleteButton: {
    backgroundColor: "#dc3545",
  },

  addButton: {
    color: "#8080ff",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "80%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },

});


