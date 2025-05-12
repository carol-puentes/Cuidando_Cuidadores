import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Dimensions,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

// import DateTimePicker from "@react-native-datetimepicker/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";


import { Picker } from "@react-native-picker/picker";

const DynamicIslandBackground = () => {
  const { width } = Dimensions.get("window");

  return (
    <>
      <View style={{ position: "absolute", top: 0, left: 0, width, height: 250 }}>
        <Svg width={width} height={250} viewBox={`0 0 ${width} 250`}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="10%" stopColor="#A2D5F2" />
              <Stop offset="100%" stopColor="#B8E8D2" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0,150 Q${width * 0.25},50 ${width * 0.5},80 Q${width * 0.75},120 ${width},90 L${width},0 L0,0 Z`}
            fill="url(#grad)"
          />
        </Svg>
      </View>

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
            d={`M0,150 Q${width * 0.25},50 ${width * 0.5},80 Q${width * 0.75},120 ${width},90 L${width},0 L0,0 Z`}
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

  // Tutor
  const [tutorName, setTutorName] = useState("");
  const [tutorBirthDate, setTutorBirthDate] = useState("");
  const [tutorGender, setTutorGender] = useState("");
  const [tutorAddress, setTutorAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Paciente
  const [patientName, setPatientName] = useState("");
  const [patientBirthDate, setPatientBirthDate] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientDiagnosis, setPatientDiagnosis] = useState("");

  // Date pickers
  const [showTutorDatePicker, setShowTutorDatePicker] = useState(false);
  const [showPatientDatePicker, setShowPatientDatePicker] = useState(false);

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

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    setStep(2);
  };

  const handleRegister = async () => {
    if (
      !patientName ||
      !patientBirthDate ||
      !patientGender ||
      !patientDiagnosis
    ) {
      Toast.show({
        type: "error",
        text1: "Completa todos los campos del paciente.",
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
        },
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
    <View style={styles.container}>
      <DynamicIslandBackground />
      <Text style={styles.title}>
        {step === 1 ? "Registro del Tutor" : "Registro del Paciente"}
      </Text>

      {step === 1 ? (
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
                  setTutorBirthDate(selectedDate.toISOString().split("T")[0]);
                }
              }}
            />
          )}

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tutorGender}
              onValueChange={(itemValue) => setTutorGender(itemValue)}
            >
              <Picker.Item label="Selecciona género" value="" />
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Femenino" value="femenino" />
              <Picker.Item label="No binario" value="no_binario" />
              <Picker.Item label="Prefiero no decirlo" value="prefiero_no_decirlo" />
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
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </>
      ) : (
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
              onValueChange={(itemValue) => setPatientGender(itemValue)}
            >
              <Picker.Item label="Selecciona género" value="" />
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Femenino" value="femenino" />
              <Picker.Item label="No binario" value="no_binario" />
              <Picker.Item label="Prefiero no decirlo" value="prefiero_no_decirlo" />
              <Picker.Item label="Otro" value="otro" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Diagnóstico"
            value={patientDiagnosis}
            onChangeText={setPatientDiagnosis}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <Button title="Volver" onPress={() => setStep(1)} />
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>¿Ya tienes cuenta? Ingresa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loginLink: {
    color: "#555",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },
});


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Button,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { auth, db } from "../firebaseConfig";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import Toast from "react-native-toast-message";
// import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";

// const DynamicIslandBackground = () => {
//   const { width } = Dimensions.get("window");

//   return (
//     <>
//       <View style={{ position: "absolute", top: 0, left: 0, width, height: 250 }}>
//         <Svg width={width} height={250} viewBox={`0 0 ${width} 250`}>
//           <Defs>
//             <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
//               <Stop offset="10%" stopColor="#A2D5F2" />
//               <Stop offset="100%" stopColor="#B8E8D2" />
//             </LinearGradient>
//           </Defs>
//           <Path
//             d={`M0,150 Q${width * 0.25},50 ${width * 0.5},80 Q${width * 0.75},120 ${width},90 L${width},0 L0,0 Z`}
//             fill="url(#grad)"
//           />
//         </Svg>
//       </View>

//       <View
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           width,
//           height: 150,
//           transform: [{ rotate: "180deg" }],
//         }}
//       >
//         <Svg width={width} height={150} viewBox={`0 0 ${width} 150`}>
//           <Defs>
//             <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
//               <Stop offset="10%" stopColor="#A2D5F2" />
//               <Stop offset="100%" stopColor="#B8E8D2" />
//             </LinearGradient>
//           </Defs>
//           <Path
//             d={`M0,150 Q${width * 0.25},50 ${width * 0.5},80 Q${width * 0.75},120 ${width},90 L${width},0 L0,0 Z`}
//             fill="url(#grad)"
//           />
//         </Svg>
//       </View>
//     </>
//   );
// };

// const calculateAge = (dateString) => {
//   const today = new Date();
//   const birthDate = new Date(dateString);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// };

// export default function RegisterScreen({ navigation }) {
//   const [step, setStep] = useState(1);

//   // Tutor
//   const [tutorName, setTutorName] = useState("");
//   const [tutorBirthDate, setTutorBirthDate] = useState("");
//   const [tutorGender, setTutorGender] = useState("");
//   const [tutorAddress, setTutorAddress] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // Paciente
//   const [patientName, setPatientName] = useState("");
//   const [patientBirthDate, setPatientBirthDate] = useState("");
//   const [patientGender, setPatientGender] = useState("");
//   const [patientDiagnosis, setPatientDiagnosis] = useState("");

//   // Date pickers
//   const [showTutorDatePicker, setShowTutorDatePicker] = useState(false);
//   const [showPatientDatePicker, setShowPatientDatePicker] = useState(false);

//   const handleNext = () => {
//     if (
//       !tutorName ||
//       !tutorBirthDate ||
//       !tutorGender ||
//       !tutorAddress ||
//       !email ||
//       !password
//     ) {
//       Toast.show({
//         type: "error",
//         text1: "Completa todos los campos del tutor.",
//       });
//       return;
//     }

//     if (password.length < 6) {
//       Toast.show({
//         type: "error",
//         text1: "La contraseña debe tener al menos 6 caracteres.",
//       });
//       return;
//     }

//     setStep(2);
//   };

//   const handleRegister = async () => {
//     if (
//       !patientName ||
//       !patientBirthDate ||
//       !patientGender ||
//       !patientDiagnosis
//     ) {
//       Toast.show({
//         type: "error",
//         text1: "Completa todos los campos del paciente.",
//       });
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       await setDoc(doc(db, "users", user.uid), {
//         role: "cuidador",
//         tutor: {
//           name: tutorName,
//           birthDate: tutorBirthDate,
//           gender: tutorGender,
//           address: tutorAddress,
//           email,
//         },
//         paciente: {
//           name: patientName,
//           birthDate: patientBirthDate,
//           gender: patientGender,
//           diagnosis: patientDiagnosis,
//         },
//       });

//       Toast.show({
//         type: "success",
//         text1: "Registro exitoso",
//         text2: "¡Bienvenido!",
//       });
//       navigation.navigate("Login");
//     } catch (error) {
//       Toast.show({
//         type: "error",
//         text1: "Error al registrar",
//         text2: error.message,
//       });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <DynamicIslandBackground />
//       <Text style={styles.title}>
//         {step === 1 ? "Registro del Tutor" : "Registro del Paciente"}
//       </Text>

//       {step === 1 ? (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Nombre del tutor"
//             value={tutorName}
//             onChangeText={setTutorName}
//           />

//           <TouchableOpacity
//             style={styles.input}
//             onPress={() => setShowTutorDatePicker(true)}
//           >
//             <Text>{tutorBirthDate || "Fecha de nacimiento"}</Text>
//           </TouchableOpacity>

//           {showTutorDatePicker && (
//             <DateTimePicker
//               value={new Date()}
//               mode="date"
//               display="default"
//               maximumDate={new Date()}
//               onChange={(event, selectedDate) => {
//                 if (event.type === "dismissed") {
//                   setShowTutorDatePicker(false);
//                   return;
//                 }

//                 if (selectedDate) {
//                   const age = calculateAge(selectedDate);
//                   if (age < 18) {
//                     Toast.show({
//                       type: "error",
//                       text1: "Edad no válida",
//                       text2: "El tutor debe tener al menos 18 años.",
//                     });
//                   } else {
//                     setTutorBirthDate(selectedDate.toISOString().split("T")[0]);
//                   }
//                 }

//                 setShowTutorDatePicker(false);
//               }}
//             />
//           )}

//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={tutorGender}
//               onValueChange={(itemValue) => setTutorGender(itemValue)}
//             >
//               <Picker.Item label="Selecciona género" value="" />
//               <Picker.Item label="Masculino" value="masculino" />
//               <Picker.Item label="Femenino" value="femenino" />
//               <Picker.Item label="No binario" value="no_binario" />
//               <Picker.Item label="Prefiero no decirlo" value="prefiero_no_decirlo" />
//               <Picker.Item label="Otro" value="otro" />
//             </Picker>
//           </View>

//           <TextInput
//             style={styles.input}
//             placeholder="Dirección"
//             value={tutorAddress}
//             onChangeText={setTutorAddress}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Correo electrónico"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Contraseña"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />

//           <TouchableOpacity style={styles.button} onPress={handleNext}>
//             <Text style={styles.buttonText}>Continuar</Text>
//           </TouchableOpacity>
//         </>
//       ) : (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Nombre del paciente"
//             value={patientName}
//             onChangeText={setPatientName}
//           />

//           <TouchableOpacity
//             style={styles.input}
//             onPress={() => setShowPatientDatePicker(true)}
//           >
//             <Text>{patientBirthDate || "Fecha de nacimiento"}</Text>
//           </TouchableOpacity>

//           {showPatientDatePicker && (
//             <DateTimePicker
//               value={new Date()}
//               mode="date"
//               display="default"
//               maximumDate={new Date()}
//               onChange={(event, selectedDate) => {
//                 setShowPatientDatePicker(false);
//                 if (selectedDate) {
//                   setPatientBirthDate(selectedDate.toISOString().split("T")[0]);
//                 }
//               }}
//             />
//           )}

//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={patientGender}
//               onValueChange={(itemValue) => setPatientGender(itemValue)}
//             >
//               <Picker.Item label="Selecciona género" value="" />
//               <Picker.Item label="Masculino" value="masculino" />
//               <Picker.Item label="Femenino" value="femenino" />
//               <Picker.Item label="No binario" value="no_binario" />
//               <Picker.Item label="Prefiero no decirlo" value="prefiero_no_decirlo" />
//               <Picker.Item label="Otro" value="otro" />
//             </Picker>
//           </View>

//           <TextInput
//             style={styles.input}
//             placeholder="Diagnóstico"
//             value={patientDiagnosis}
//             onChangeText={setPatientDiagnosis}
//           />

//           <TouchableOpacity style={styles.button} onPress={handleRegister}>
//             <Text style={styles.buttonText}>Registrarse</Text>
//           </TouchableOpacity>
//           <Button title="Volver" onPress={() => setStep(1)} />
//         </>
//       )}

//       <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//         <Text style={styles.loginLink}>¿Ya tienes cuenta? Ingresa</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   input: {
//     width: "80%",
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     marginBottom: 10,
//   },
//   pickerContainer: {
//     width: "80%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     marginBottom: 10,
//     backgroundColor: "#fff",
//   },
//   button: {
//     backgroundColor: "#8080ff",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: "center",
//     width: "80%",
//     marginBottom: 10,
//   },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   loginLink: {
//     color: "#555",
//     fontSize: 16,
//     marginTop: 10,
//     textDecorationLine: "underline",
//   },
// });
