import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebaseConfig";
import Toast from "react-native-toast-message";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons"; // Asegúrate de tener instalado este paquete

import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// Importa tu configuración personalizada
import { auth, db } from "../firebaseConfig"; // <-- db viene de aquí




const DynamicIslandBackground = () => {
  const { width } = Dimensions.get("window");

  return (
    <>
      {/* Parte superior */}
      <View style={{ position: "absolute", top: 0, left: 0, width, height: 250 }}>
        <Svg width={width} height={250} viewBox={`0 0 ${width} 250`}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="10%" stopColor="#A2D5F2" />
              <Stop offset="100%" stopColor="#B8E8D2" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0,250  
                Q${width * 0.25},125 ${width * 0.5},160  
                Q${width * 0.75},190 ${width},125  
                L${width},0  
                L0,0  
                Z`}
            fill="url(#grad)"
          />
        </Svg>
      </View>

      {/* Parte inferior rotada */}
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
            d={`M0,150  
                Q${width * 0.25},50 ${width * 0.5},80  
                Q${width * 0.75},120 ${width},90  
                L${width},0  
                L0,0  
                Z`}
            fill="url(#grad)"
          />
        </Svg>
      </View>
    </>
  );
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // const handleLogin = async () => {
  //   try {
  //     await signInWithEmailAndPassword(auth, email.trim(), password);
  //     Toast.show({
  //       type: "success",
  //       position: "bottom",
  //       text1: "Inicio de sesión exitoso",
  //       text2: "¡Bienvenido de nuevo!",
  //     });
  //   } catch (error) {
  //     Toast.show({
  //       type: "error",
  //       position: "bottom",
  //       text1: "Error al iniciar sesión",
  //       text2: error.message,
  //     });
  //   }
  // };

  const handleLogin = async () => {
  if (!email || !password) {
    Toast.show({
      type: "error",
      text1: "Campos incompletos",
      text2: "Ingresa tu correo y contraseña.",
    });
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Consultar Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      // Si la cuenta está desactivada
      if (userData.disabled) {
        await signOut(auth);
        Toast.show({
          type: "error",
          text1: "Cuenta desactivada",
          text2: "Contacta con el administrador.",
        });
        return;
      }

      // Navegar según rol (si quieres)
      if (userData.rolNumber === 2) {
        navigation.navigate("Admin");
      } else {
        navigation.navigate("HomeTabs");
      }

      // Toast.show({
      //   type: "success",
      //   text1: "Bienvenido",
      //   text2: `Hola, ${userData.tutor?.name || "usuario"}`,
      // });
    } else {
      // Usuario no encontrado en Firestore
      Toast.show({
        type: "error",
        text1: "Usuario no registrado",
        text2: "No se encontró en Firestore.",
      });
      await signOut(auth);
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Error al iniciar sesión",
      text2: error.message,
    });
  }
};


  return (
    <View style={styles.container}>
      <DynamicIslandBackground />

      <Svg width={80} height={80} viewBox="0 0 24 24" style={{ marginBottom: 20 }}>
        <Circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2" fill="none" />
        <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="black" strokeWidth="2" fill="none" />
      </Svg>

      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerLink}>¿No tienes cuenta? Regístrate</Text>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    width: "80%",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "#8080ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    color: "#555",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
