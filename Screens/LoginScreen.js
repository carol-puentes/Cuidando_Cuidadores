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
// import { auth } from "../firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import Toast from "react-native-toast-message";
// import Svg, { Path, Defs, LinearGradient, Stop,Circle } from "react-native-svg";


// // Componente para el efecto de marco con degradado
// const DynamicIslandBackground = () => {
//   const { width } = Dimensions.get("window");

//   return (
//     <>
//     <View style={{ position: "absolute", top: 0, left: 0, width, height: 250 }}>
//         <Svg width={width} height={250} viewBox={`0 0 ${width} 250`}>
//             <Defs>
//                 <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
//                     <Stop offset="10%" stopColor="#fff7ad" />
//                     <Stop offset="100%" stopColor="#ffa9f9" />
//                 </LinearGradient>
//             </Defs>
            
//             {/* SECION FORMA  */}
//             <Path
//                 d={`
//                     M0,250  
//                     Q${width * 0.25},125 ${width * 0.5},160  
//                     Q${width * 0.75},190 ${width},125  
//                     L${width},0  
//                     L0,0  
//                     Z
//                   `}
//                 fill="url(#grad)"
//             />
//       </Svg>

//     </View>

//     {/* Fondo en la parte inferior (rotado 180°) */}
//     <View 
//         style={{ 
//           position: "absolute", 
//           bottom: 0, 
//           left: 0, 
//           width, 
//           height: 150, 
//           transform: [{ rotate: "180deg" }]  // Rotamos la vista
//         }}
//       >
//         <Svg width={width} height={150} viewBox={`0 0 ${width} 150`}>
//           <Defs>
//             <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
//               <Stop offset="10%" stopColor="#fff7ad" />
//               <Stop offset="100%" stopColor="#ffa9f9" />
//             </LinearGradient>
//           </Defs>
          
//           <Path
//             d={`
//               M0,150  
//               Q${width * 0.25},50 ${width * 0.5},80  
//               Q${width * 0.75},120 ${width},90  
//               L${width},0  
//               L0,0  
//               Z
//             `}
//             fill="url(#grad)"
//           />
//         </Svg>
//       </View>
//   </>

//   );
// };

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       Toast.show({
//         type: "success",
//         position: "bottom",
//         text1: "Inicio de sesión exitoso",
//         text2: "¡Bienvenido de nuevo!",
//       });
//     } catch (error) {
//       Toast.show({
//         type: "error",
//         position: "bottom",
//         text1: "Error al iniciar sesión",
//         text2: error.message,
//       });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Agrega el efecto de marco superior */}
//       <DynamicIslandBackground />

//       {/* SVG del icono de usuario */}
//       <Svg width={80} height={80} viewBox="0 0 24 24">
//         <Circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2" fill="none" />
//         <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="black" strokeWidth="2" fill="none" />
//       </Svg>

      
//       <Text style={styles.title}>Iniciar Sesión</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Correo electrónico"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Contraseña"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       {/* Botón Personalizado */}
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Ingresar</Text>
//       </TouchableOpacity>


//       <Button
//         title="Registrarse"  color="#8080ff" 
//         onPress={() => navigation.navigate("Register")}
//       />
//     </View>
//   );
// }



// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 24, marginBottom: 20 },
//   input: { width: "80%", padding: 10, borderWidth: 1, marginBottom: 10 },

//   button: {
//     backgroundColor: "#8080ff",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "80%",
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });


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
import { auth } from "../firebaseConfig";
import Toast from "react-native-toast-message";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";

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

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Inicio de sesión exitoso",
        text2: "¡Bienvenido de nuevo!",
      });
    } catch (error) {
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

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

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






// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from "../firebaseConfig";

// export default function LoginScreen({ navigation }) {  // Asegúrate de que `navigation` esté disponible
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email.trim(), password);
//       // Firebase maneja el cambio de usuario automáticamente con onAuthStateChanged
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error al iniciar sesión', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Iniciar Sesión</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Correo electrónico"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Contraseña"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <Button title="Ingresar" onPress={handleLogin} />

//       <View style={styles.registerContainer}>
//         <Text style={styles.registerText}>¿No tienes cuenta?</Text>
//         <Button
//           title="Regístrate"
//           onPress={() => navigation.navigate('Register')}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 28,
//     marginBottom: 24,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     marginBottom: 16,
//     borderRadius: 8,
//   },
//   registerContainer: {
//     marginTop: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   registerText: {
//     fontSize: 16,
//   },
// });
