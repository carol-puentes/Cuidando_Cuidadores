import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, setDoc, getDoc } from 'firebase/firestore';
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

import * as Notifications from "expo-notifications";
// ❌ Línea eliminada: import * as Permissions from 'expo-permissions';

import { auth, db } from "./firebaseConfig";

import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import HomeScreen from "./Screens/HomeScreen";
import HelpScreen from "./Screens/HelpScreen";
import ProgressScreen from "./Screens/ProgressScreen";
import DetalleSemana from "./Screens/DetalleSemana";
import TallerScreen from "./Screens/TallerScreen";
import SplashScreen from "./Screens/SplashScreen";
import TallerNavigator from "./Screens/TallerNavigator";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Inicio") {
            iconName = "home";
          } else if (route.name === "Taller") {
            iconName = "school";
          } else if (route.name === "Comunidad") {
            return (
              <MaterialCommunityIcons
                name="account-group"
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Perfil") {
            iconName = "person";
          } else if (route.name === "Salir") {
            iconName = "log-out";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Taller" component={TallerNavigator} />
      <Tab.Screen name="Comunidad" component={HelpScreen} />
      <Tab.Screen name="Perfil" component={ProgressScreen} />
      <Tab.Screen
        name="Salir"
        component={HomeScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Tab.Navigator>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("No se pueden recibir notificaciones sin permiso");
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);
  return token;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setAuthChecked(true);
      setUser(null); // Siempre limpiar primero

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        // Escuchar en tiempo real el documento del usuario
        const unsubscribeSnapshot = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();

            if (data.disabled === true) {
              Toast.show({
                type: "error",
                text1: "Cuenta deshabilitada",
                text2: "Tu cuenta fue inhabilitada por el administrador.",
              });
              await signOut(auth);
              setUser(null);
              return;
            }

            const token = await registerForPushNotificationsAsync();
            if (token) {
              await setDoc(userRef, { expoPushToken: token }, { merge: true });
            }

            setUser({
              ...currentUser,
              ultimaSemanaCompletada: data.ultimaSemanaCompletada || 0,
            });
          } else {
            // Documento no existe aún, crearlo con valores por defecto
            await setDoc(userRef, {
              rolNumber: 1,
              disabled: false,
              ultimaSemanaCompletada: 0,
            });
            setUser({
              ...currentUser,
              ultimaSemanaCompletada: 0,
            });
          }
        });

        // Limpieza cuando el usuario cierre sesión
        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificación recibida:", notification);
      }
    );

    return () => subscription.remove();
  }, []);

  if (showSplash || !authChecked) {
    return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="HomeTabs" component={HomeTabs} />
              <Stack.Screen name="DetalleSemana" component={DetalleSemana} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      <Toast />
    </>
  );
}
