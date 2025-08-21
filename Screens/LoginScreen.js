import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth"; // Función de Firebase para iniciar sesión con email y contraseña
import Toast from "react-native-toast-message"; // Librería para mostrar notificaciones tipo "toast"
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg"; // Librería para gráficos vectoriales
import Ionicons from "react-native-vector-icons/Ionicons"; // Íconos

// Firebase config (debe estar configurado en otro archivo: firebaseConfig.js)
import { auth, db } from "../firebaseConfig";

// --- Componente de fondo decorativo ---
const DynamicIslandBackground = () => {
  const { width } = Dimensions.get("window");

  return (
    <>
      {/* Fondo superior */}
      <View style={{ position: "absolute", top: 0, left: 0, width, height: 250 }}>
        <Svg width={width} height={250} viewBox={`0 0 ${width} 250`}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="10%" stopColor="#A2D5F2" />
              <Stop offset="100%" stopColor="#B8E8D2" />
            </LinearGradient>
          </Defs>
          {/* Curvas SVG para el fondo */}
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

// --- Pantalla principal de Login ---
export default function LoginScreen({ navigation }) {
  // Estados locales para email, password y visibilidad de contraseña
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      // Firebase: autenticar con email y contraseña
      await signInWithEmailAndPassword(auth, email.trim(), password);

    } catch (error) {
      // Mostrar error en caso de fallo
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error al iniciar sesión",
        text2: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Fondo decorativo */}
      <DynamicIslandBackground />

      {/* Ícono de usuario */}
      <Svg width={80} height={80} viewBox="0 0 24 24" style={{ marginBottom: 20 }}>
        <Circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2" fill="none" />
        <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="black" strokeWidth="2" fill="none" />
      </Svg>

      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* Input de correo */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Input de contraseña con botón para mostrar/ocultar */}
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

      {/* Botón de login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* Link para ir a registro */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerLink}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Estilos ---
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
