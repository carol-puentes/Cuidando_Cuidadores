// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   Image,
//   Dimensions,
//   ImageBackground,
// } from "react-native";
// import { auth, db } from "../firebaseConfig";
// import {
//   doc,
//   getDoc,
//   collection,
//   getDocs,
//   updateDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { useTranslation } from "react-i18next";
// import YoutubePlayer from "react-native-youtube-iframe";
// import { Picker } from "@react-native-picker/picker";
// import { BlurView } from "expo-blur";
// import LottieView from "lottie-react-native";
// import ConfettiCannon from "react-native-confetti-cannon";

// import { Modal } from 'react-native';


// // Utilidades
// const screenWidth = Dimensions.get("window").width;
// const videoWidth = screenWidth * 0.9;
// const videoHeight = (videoWidth * 9) / 16;

// const isBirthday = (birthDateString) => {
//   const today = new Date();
//   const birthDate = new Date(birthDateString);
//   return (
//     today.getDate() === birthDate.getDate() &&
//     today.getMonth() === birthDate.getMonth()
//   );
// };

// export default function HomeScreen({ navigation }) {
//   const { t, i18n } = useTranslation();
//   const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
//   const [playing, setPlaying] = useState(false);
//   const [showVideo, setShowVideo] = useState(false);
//   const [rolNumber, setRolNumber] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showBirthdayMessage, setShowBirthdayMessage] = useState(false);
//   const [birthdayName, setBirthdayName] = useState("");

//     const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         await fetchUserData(user.uid);
//       } else {
//         navigation.replace("Login");
//       }
//     });

//     return unsubscribe;
//   }, []);

//   const fetchUserData = async (uid) => {
//     try {
//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const data = userSnap.data();
//         setUserData(data);
//         setRolNumber(data.rolNumber);

//         if (data.tutor?.birthDate && isBirthday(data.tutor.birthDate)) {
//           setBirthdayName(data.tutor.name);
//           setShowBirthdayMessage(true);
//         } else if (
//           data.paciente?.birthDate &&
//           isBirthday(data.paciente.birthDate)
//         ) {
//           setBirthdayName(data.paciente.name);
//           setShowBirthdayMessage(true);
//         }

//         if (data.rolNumber === 2) fetchCuidadores();
//       }
//     } catch (error) {
//       console.error("Error al obtener datos:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCuidadores = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "users"));
//       const filtered = [];
//       querySnapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         if (data.rolNumber === 1) {
//           filtered.push({ id: docSnap.id, ...data });
//         }
//       });
//       setUsers(filtered);
//     } catch (error) {
//       console.error("Error al obtener cuidadores:", error);
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

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     setSelectedLanguage(lang);
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#FF8C00" />
//       </View>
//     );
//   }

//   if (showBirthdayMessage) {
//     return (
//       <View style={styles.centered}>
//         <LottieView
//           source={require("../assets/animations/birthday.json")}
//           autoPlay
//           loop
//           style={{ width: 250, height: 250 }}
//         />
//         <Text style={styles.birthdayTitle}>
//           🎉 ¡Feliz cumpleaños, {birthdayName}! 🎉
//         </Text>
//         <Text style={styles.birthdayText}>
//           Que tu día esté lleno de alegría y momentos inolvidables.
//         </Text>
//         <TouchableOpacity
//           onPress={() => setShowBirthdayMessage(false)}
//           style={styles.continueButton}
//         >
//           <Text style={styles.continueText}>Continuar</Text>
//         </TouchableOpacity>
//         <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} fadeOut />
//       </View>
//     );
//   }



//   if (rolNumber === 1) {
//   return (    


//     <ImageBackground
//         source={require("../assets/fondo_principal.png")}
//         style={styles.Imagen_blur}
//         resizeMode="cover"
//       >
//         <BlurView intensity={50} tint="light" style={styles.container_usuario}>


//     <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
//       <Text style={styles.title}>Arte-Sanos del Cuidado</Text>
//       <Text style={styles.description}>
//   Esta aplicación ha sido creada pensando en ti, que cuidas con dedicación a una persona con enfermedad crónica o discapacidad.

//   {"\n\n"}Aquí encontrarás mucho más que un taller:
//   {"\n"}📚 Un programa virtual de 6 semanas para fortalecer tu autocuidado, manejo emocional y conocimientos.
//   {"\n"}🤝 Un espacio de comunidad para compartir experiencias, recibir apoyo y sentirte acompañado.
//   {"\n"}🌱 Herramientas prácticas, ejercicios de relajación y momentos de reflexión que puedes integrar a tu día a día.

//   {"\n\n"}Te damos la bienvenida a un lugar donde también te cuidamos a ti.
// </Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.buttonText}>Ver más</Text>
//       </TouchableOpacity>

//       <Modal visible={modalVisible} animationType="slide">
//         <View style={styles.modalContainer}>
//           <ScrollView style={styles.scrollContent}>
//             <Text style={styles.modalText}>
//               Las personas que viven con ECNT o algún tipo de discapacidad presentan disminución de sus capacidades funcionales asociadas a los procesos patológicos, creando necesidades dependientes del apoyo de otros sujetos para desarrollar sus actividades diarias. Estas personas que provisionan cuidados son los cuidadores informales, situación que los lleva a asumir múltiples responsabilidades que impactan la calidad de vida del cuidador, su bienestar emocional, su percepción de apoyo social y su nivel de sobrecarga.

//               {"\n\n"}En el marco del proyecto de investigación “Efectos de la tecnología en los procesos de intervención para la adopción del rol de cuidador de la persona con ECNT, en su calidad de vida, apoyo social y niveles de sobrecarga”, se ha diseñado este taller virtual denominado “Arte-Sanos del Cuidado”, con el propósito de acompañar a los cuidadores en el fortalecimiento de habilidades de autocuidado, manejo emocional, construcción de redes de apoyo y búsqueda de sentido en su labor diaria, para optimizar aspectos como: conocimiento sobre la enfermedad que cursa la persona, hábitos de vida saludables, ejercicios de respiración, físicos y mentales y, actividades de relajación.

//               {"\n\n"}Esta actividad se desarrolla 100% virtual, con una duración total de 6 semanas, combinando actividades asincrónicas y encuentros sincrónicos mediante videollamada. Cada semana incluye contenidos teóricos, actividades prácticas, herramientas tecnológicas y espacios de reflexión, para que el cuidador pueda integrar los aprendizajes a su vida cotidiana.
//             </Text>
//           </ScrollView>

//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setModalVisible(false)}
//           >
//             <Text style={styles.buttonText}>Cerrar</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>


//     </ScrollView>


//     </BlurView>
//     </ImageBackground>

    
//   );
  
// }


//   // 🛠️ Rol 2 - Admin
//   if (rolNumber === 2) {
//     return (
//       <ImageBackground
//         source={require("../assets/user.png")}
//         style={styles.Imagen_blur}
//         resizeMode="cover"
//       >
//         <BlurView intensity={50} tint="light" style={styles.container}>
//           <ScrollView contentContainerStyle={styles.container}>
//             <View style={styles.header}>
//               <Text style={styles.headerTitle}>Usuarios</Text>
//             </View>

//             {users.map((user) => (
//               <View key={user.id} style={styles.card}>
//                 <Text style={styles.label}>
//                   <Text style={styles.bold}>Tutor:</Text>{" "}
//                   {user.tutor?.name || "No disponible"}
//                 </Text>
//                 <Text style={styles.label}>
//                   <Text style={styles.bold}>Email:</Text>{" "}
//                   {user.tutor?.email || "No disponible"}
//                 </Text>
//                 <Text style={styles.label}>
//                   <Text style={styles.bold}>Paciente:</Text>{" "}
//                   {user.paciente?.name || "No disponible"}
//                 </Text>
//                 <Text style={styles.label}>
//                   <Text style={styles.bold}>Diagnóstico:</Text>{" "}
//                   {user.paciente?.diagnosis || "No disponible"}
//                 </Text>
//                 <Text style={styles.estado}>
//                   Estado:{" "}
//                   <Text style={{ color: user.disabled ? "red" : "green" }}>
//                     {user.disabled ? "Inactivo" : "Activo"}
//                   </Text>
//                 </Text>

//                 <TouchableOpacity
//                   style={[
//                     styles.button,
//                     { backgroundColor: user.disabled ? "#28a745" : "#dc3545" },
//                   ]}
//                   onPress={() => toggleAccount(user.id, user.disabled)}
//                 >
//                   <Text style={styles.buttonText}>
//                     {user.disabled ? "ACTIVAR CUENTA" : "DESACTIVAR CUENTA"}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </BlurView>
//       </ImageBackground>
//     );
//   }

//   // Rol indefinido
//   return (
//     <View style={styles.centered}>
//       <Text>No se pudo determinar el rol del usuario.</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 20,
//   },
//   birthdayTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#8080FF",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   birthdayText: {
//     textAlign: "center",
//     fontSize: 16,
//     marginTop: 10,
//     color: "#333",
//   },
//   continueButton: {
//     marginTop: 25,
//     padding: 12,
//     backgroundColor: "#8080FF",
//     borderRadius: 10,
//   },
//   continueText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 40,
//     marginBottom: 20,
//   },
//   headerTitle: { fontSize: 30, fontWeight: "bold", color: "#333" },
//   container: { flex: 1, padding: 20 },
//   Imagen_blur: { flex: 1 },
//   card: {
//     backgroundColor: "#f5f7fa",
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//     elevation: 3,
//   },
//   label: { marginBottom: 5, color: "#333" },
//   bold: { fontWeight: "bold" },
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
 




//   container_usuario: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#8080ff",
//     marginTop: 40,
//     marginBottom: 20,
//     textAlign: "center",
//   },

//   description: {
//     fontSize: 16,
//     color: "#555",
//     textAlign:"justify",
//     marginTop:25,
//     marginBottom: 25,
//     lineHeight: 24,
//   },
//   button: {
//     backgroundColor: "#8080FF",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     alignSelf: "center",
//     marginTop: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2, // para Android
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

 
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//     justifyContent: "space-between",
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   modalText: {
//     fontSize: 16,
//     color: "#444",
//     lineHeight: 24,
//     textAlign:"justify",
//   },
//   closeButton: {
//     backgroundColor: "#8080FF",
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 10,
//   },

  
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  ImageBackground,
  Modal,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
import ConfettiCannon from "react-native-confetti-cannon";

// 📏 Utilidades
const screenWidth = Dimensions.get("window").width;

const isBirthday = (birthDate) => {
  if (!birthDate) return false;

  // Si es Timestamp de Firestore, lo convertimos a Date
  const birthDateObj = birthDate.toDate
    ? birthDate.toDate()
    : new Date(birthDate);

  const today = new Date();

  // Usamos UTC para evitar problemas de zona horaria
  const todayDay = today.getUTCDate();
  const todayMonth = today.getUTCMonth();
  const birthDay = birthDateObj.getUTCDate();
  const birthMonth = birthDateObj.getUTCMonth();

  return todayDay === birthDay && todayMonth === birthMonth;
};

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [rolNumber, setRolNumber] = useState(null);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBirthdayMessage, setShowBirthdayMessage] = useState(false);
  const [birthdayName, setBirthdayName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user.uid);
      } else {
        navigation.replace("Login");
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setRolNumber(data.rolNumber);

        if (data.tutor?.birthDate && isBirthday(data.tutor.birthDate)) {
          setBirthdayName(data.tutor.name);
          setShowBirthdayMessage(true);
        } else if (data.paciente?.birthDate && isBirthday(data.paciente.birthDate)) {
          setBirthdayName(data.paciente.name);
          setShowBirthdayMessage(true);
        }

        if (data.rolNumber === 2) fetchCuidadores();
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCuidadores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const filtered = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.rolNumber === 1) {
          filtered.push({ id: docSnap.id, ...data });
        }
      });
      setUsers(filtered);
    } catch (error) {
      console.error("Error al obtener cuidadores:", error);
    }
  };

  const toggleAccount = async (userId, currentDisabledState) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        disabled: !currentDisabledState,
      });
      fetchCuidadores();
    } catch (error) {
      console.error("Error actualizando cuenta:", error);
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  if (showBirthdayMessage) {
    return (
      <View style={styles.centered}>
        <LottieView
          source={require("../assets/animations/birthday.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
        <Text style={styles.birthdayTitle}>
          🎉 ¡Feliz cumpleaños, {birthdayName}! 🎉
        </Text>
        <Text style={styles.birthdayText}>
          Que tu día esté lleno de alegría y momentos inolvidables.
        </Text>
        <TouchableOpacity
          onPress={() => setShowBirthdayMessage(false)}
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>Continuar</Text>
        </TouchableOpacity>
        <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} fadeOut />
      </View>
    );
  }

  // 🧑‍🦱 Rol 1 - Cuidador
  if (rolNumber === 1) {
    return (
      <ImageBackground
        source={require("../assets/fondo_principal.png")}
        style={styles.Imagen_blur}
        resizeMode="cover"
      >
        <BlurView intensity={50} tint="light" style={styles.container_usuario}>
          <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
            <Text style={styles.title}>Arte-Sanos del Cuidado</Text>
            <Text style={styles.description}>
              Esta aplicación ha sido creada pensando en ti, que cuidas con dedicación a una persona con enfermedad crónica o discapacidad.

              {"\n\n"}Aquí encontrarás mucho más que un taller:
              {"\n"}📚 Un programa virtual de 6 semanas para fortalecer tu autocuidado, manejo emocional y conocimientos.
              {"\n"}🤝 Un espacio de comunidad para compartir experiencias, recibir apoyo y sentirte acompañado.
              {"\n"}🌱 Herramientas prácticas, ejercicios de relajación y momentos de reflexión que puedes integrar a tu día a día.

              {"\n\n"}Te damos la bienvenida a un lugar donde también te cuidamos a ti.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Ver más</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
              <View style={styles.modalContainer}>
                <ScrollView style={styles.scrollContent}>
                  <Text style={styles.modalText}>
                    Las personas que viven con ECNT o algún tipo de discapacidad presentan disminución de sus capacidades funcionales asociadas a los procesos patológicos, creando necesidades dependientes del apoyo de otros sujetos para desarrollar sus actividades diarias. Estas personas que provisionan cuidados son los cuidadores informales, situación que los lleva a asumir múltiples responsabilidades que impactan la calidad de vida del cuidador, su bienestar emocional, su percepción de apoyo social y su nivel de sobrecarga.

                    {"\n\n"}En el marco del proyecto de investigación “Efectos de la tecnología en los procesos de intervención para la adopción del rol de cuidador de la persona con ECNT, en su calidad de vida, apoyo social y niveles de sobrecarga”, se ha diseñado este taller virtual denominado “Arte-Sanos del Cuidado”, con el propósito de acompañar a los cuidadores en el fortalecimiento de habilidades de autocuidado, manejo emocional, construcción de redes de apoyo y búsqueda de sentido en su labor diaria, para optimizar aspectos como: conocimiento sobre la enfermedad que cursa la persona, hábitos de vida saludables, ejercicios de respiración, físicos y mentales y, actividades de relajación.

                    {"\n\n"}Esta actividad se desarrolla 100% virtual, con una duración total de 6 semanas, combinando actividades asincrónicas y encuentros sincrónicos mediante videollamada. Cada semana incluye contenidos teóricos, actividades prácticas, herramientas tecnológicas y espacios de reflexión, para que el cuidador pueda integrar los aprendizajes a su vida cotidiana.
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </ScrollView>
        </BlurView>
      </ImageBackground>
    );
  }

  // 👨‍💻 Rol 2 - Admin
  if (rolNumber === 2) {
    return (
      <ImageBackground
        source={require("../assets/user.png")}
        style={styles.Imagen_blur}
        resizeMode="cover"
      >
        <BlurView intensity={50} tint="light" style={styles.container}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Usuarios</Text>
            </View>

            {users.map((user) => (
              <View key={user.id} style={styles.card}>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Tutor:</Text>{" "}
                  {user.tutor?.name || "No disponible"}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Email:</Text>{" "}
                  {user.tutor?.email || "No disponible"}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Paciente:</Text>{" "}
                  {user.paciente?.name || "No disponible"}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Diagnóstico:</Text>{" "}
                  {user.paciente?.diagnosis || "No disponible"}
                </Text>
                <Text style={styles.estado}>
                  Estado:{" "}
                  <Text style={{ color: user.disabled ? "red" : "green" }}>
                    {user.disabled ? "Inactivo" : "Activo"}
                  </Text>
                </Text>

                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: user.disabled ? "#28a745" : "#dc3545" },
                  ]}
                  onPress={() => toggleAccount(user.id, user.disabled)}
                >
                  <Text style={styles.buttonText}>
                    {user.disabled ? "ACTIVAR CUENTA" : "DESACTIVAR CUENTA"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </BlurView>
      </ImageBackground>
    );
  }

  // Rol indefinido
  return (
    <View style={styles.centered}>
      <Text>No se pudo determinar el rol del usuario.</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  birthdayTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8080FF",
    textAlign: "center",
    marginTop: 20,
  },
  birthdayText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    color: "#333",
  },
  continueButton: {
    marginTop: 25,
    padding: 12,
    backgroundColor: "#8080FF",
    borderRadius: 10,
  },
  continueText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 30, fontWeight: "bold", color: "#333" },
  container: { flex: 1, padding: 20 },
  Imagen_blur: { flex: 1 },
  card: {
    backgroundColor: "#f5f7fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  label: { marginBottom: 5, color: "#333" },
  bold: { fontWeight: "bold" },
  estado: {
    fontStyle: "italic",
    color: "#666",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
 




  container_usuario: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#8080ff",
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    color: "#555",
    textAlign:"justify",
    marginTop:25,
    marginBottom: 25,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#8080FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // para Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

 
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign:"justify",
  },
  closeButton: {
    backgroundColor: "#8080FF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  
});