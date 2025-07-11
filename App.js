// import React, { useState, useEffect } from 'react';
// import { Platform } from 'react-native';
// import { NavigationContainer, useNavigation } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';

// import * as Notifications from 'expo-notifications';
// // import * as Permissions from 'expo-permissions';

// import { auth, db } from  './firebaseConfig';

// import LoginScreen from './Screens/LoginScreen';
// import RegisterScreen from './Screens/RegisterScreen';
// import HomeScreen from './Screens/HomeScreen';
// import HelpScreen from './Screens/HelpScreen';
// import ProgressScreen from './Screens/ProgressScreen';
// import DetalleSemana from './Screens/DetalleSemana';
// import TallerScreen from './Screens/TallerScreen';
// import SplashScreen from './Screens/SplashScreen';
// import TallerNavigator from './Screens/TallerNavigator';


// import Toast from 'react-native-toast-message';


// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function HomeTabs() {
//   const navigation = useNavigation();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Login' }],
//       });
//     } catch (error) {
//       console.error('Error al cerrar sesión:', error);
//     }
//   };

//   return (
//     <Tab.Navigator screenOptions={{ headerShown: false }}>
//       {/* <Tab.Screen name="Taller" component={TallerScreen} /> */}
//       <Tab.Screen name="Taller" component={TallerNavigator} />

//       <Tab.Screen name="Inicio" component={HomeScreen} />
//       <Tab.Screen name="Ayuda" component={HelpScreen} />
//       <Tab.Screen name="Progreso" component={ProgressScreen} />

//       <Tab.Screen
//         name="Salir"
//         component={HomeScreen}
//         listeners={{
//           tabPress: (e) => {
//             e.preventDefault();
//             handleLogout();
//           },
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
//   let finalStatus = existingStatus;
//   if (existingStatus !== 'granted') {
//     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//     finalStatus = status;
//   }

//   if (finalStatus !== 'granted') {
//     alert('No se pueden recibir notificaciones sin permiso');
//     return;
//   }

//   token = (await Notifications.getExpoPushTokenAsync()).data;
//   console.log('Expo Push Token:', token);
//   return token;
// }

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [authChecked, setAuthChecked] = useState(false);
//   const [showSplash, setShowSplash] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       setAuthChecked(true);


//       if (currentUser) {
//   const token = await registerForPushNotificationsAsync();
//   if (token) {
//     await setDoc(doc(db, 'users', currentUser.uid), { expoPushToken: token }, { merge: true });
//   }

//   // Leer progreso del usuario
//   const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//   if (userDoc.exists()) {
//     const data = userDoc.data();
//     setUser({
//       ...currentUser,
//       ultimaSemanaCompletada: data.ultimaSemanaCompletada || 0, // o 0 si no ha iniciado
//     });
//   } else {
//     setUser({ ...currentUser, ultimaSemanaCompletada: 0 });
//   }
// }

//     });

//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const subscription = Notifications.addNotificationReceivedListener(notification => {
//       console.log('Notificación recibida:', notification);
//     });

//     return () => subscription.remove();
//   }, []);

//   if (showSplash || !authChecked) {
//     return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />;
//   }

//   return (
//     <>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           {user ? (
//             <>
//               <Stack.Screen name="HomeTabs" component={HomeTabs} />
//               <Stack.Screen name="DetalleSemana" component={DetalleSemana} />
//             </>
//           ) : (
//             <>
//               <Stack.Screen name="Login" component={LoginScreen} />
//               <Stack.Screen name="Register" component={RegisterScreen} />
//             </>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>

//       <Toast />
//     </>
//   );
// }








// // App.js posible
// import React, { useState, useEffect } from 'react';
// import { Platform } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import * as Notifications from 'expo-notifications';

// import { auth, db } from './firebaseConfig';

// import SplashScreen from './Screens/SplashScreen';
// import LoginScreen from './Screens/LoginScreen';
// import RegisterScreen from './Screens/RegisterScreen';
// // import HomeTabs from './Screens/HomeTabs'; // Tu navegación con tabs

// const Stack = createNativeStackNavigator();

// async function registerForPushNotificationsAsync() {
//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== 'granted') {
//     alert('No se pueden recibir notificaciones sin permiso');
//     return null;
//   }

//   const token = (await Notifications.getExpoPushTokenAsync()).data;
//   return token;
// }

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [showSplash, setShowSplash] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const pushToken = await registerForPushNotificationsAsync();
//         if (pushToken) {
//           await setDoc(doc(db, 'users', currentUser.uid), {
//             expoPushToken: pushToken
//           }, { merge: true });
//         }

//         const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
//         setUser({ ...currentUser, ...docSnap.data() });
//       } else {
//         setUser(null);
//       }
//     });

//     return unsubscribe;
//   }, []);

//   if (showSplash) {
//     return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />;
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {user ? (
//           <Stack.Screen name="HomeTabs" component={HomeTabs} />
//         ) : (
//           <>
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Register" component={RegisterScreen} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

















// // App.js
// import React, { useState, useEffect } from 'react';
// import { Platform } from 'react-native';
// import { NavigationContainer, useNavigation } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import * as Notifications from 'expo-notifications';

// import { auth, db } from './firebaseConfig';

// import SplashScreen from './Screens/SplashScreen';
// import LoginScreen from './Screens/LoginScreen';
// import RegisterScreen from './Screens/RegisterScreen';
// import HomeScreen from './Screens/HomeScreen';
// import HelpScreen from './Screens/HelpScreen';
// import ProgressScreen from './Screens/ProgressScreen';
// import DetalleSemana from './Screens/DetalleSemana';
// import TallerScreen from './Screens/TallerScreen';
// import TallerNavigator from './Screens/TallerNavigator';

// import Toast from 'react-native-toast-message';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function HomeTabs() {
//   const navigation = useNavigation();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Login' }],
//       });
//     } catch (error) {
//       console.error('Error al cerrar sesión:', error);
//     }
//   };

//   return (
//     <Tab.Navigator screenOptions={{ headerShown: false }}>
//       <Tab.Screen name="Taller" component={TallerNavigator} />
//       <Tab.Screen name="Inicio" component={HomeScreen} />
//       <Tab.Screen name="Ayuda" component={HelpScreen} />
//       <Tab.Screen name="Progreso" component={ProgressScreen} />
//       <Tab.Screen
//         name="Salir"
//         component={HomeScreen}
//         listeners={{
//           tabPress: (e) => {
//             e.preventDefault();
//             handleLogout();
//           },
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== 'granted') {
//     alert('No se pueden recibir notificaciones sin permiso');
//     return;
//   }

//   token = (await Notifications.getExpoPushTokenAsync()).data;
//   console.log('Expo Push Token:', token);
//   return token;
// }

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [authChecked, setAuthChecked] = useState(false);
//   const [showSplash, setShowSplash] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       setAuthChecked(true);

//       if (currentUser) {
//         const token = await registerForPushNotificationsAsync();
//         if (token) {
//           await setDoc(doc(db, 'users', currentUser.uid), { expoPushToken: token }, { merge: true });
//         }

//         const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//         if (userDoc.exists()) {
//           const data = userDoc.data();
//           setUser({
//             ...currentUser,
//             ultimaSemanaCompletada: data.ultimaSemanaCompletada || 0,
//           });
//         } else {
//           setUser({ ...currentUser, ultimaSemanaCompletada: 0 });
//         }
//       }
//     });

//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const subscription = Notifications.addNotificationReceivedListener(notification => {
//       console.log('Notificación recibida:', notification);
//     });

//     return () => subscription.remove();
//   }, []);

//   if (showSplash || !authChecked) {
//     return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />;
//   }

//   return (
//     <>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           {user ? (
//             <>
//               <Stack.Screen name="HomeTabs" component={HomeTabs} />
//               <Stack.Screen name="DetalleSemana" component={DetalleSemana} />
//             </>
//           ) : (
//             <>
//               <Stack.Screen name="Login" component={LoginScreen} />
//               <Stack.Screen name="Register" component={RegisterScreen} />
//             </>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>

//       <Toast />
//     </>
//   );
// }














import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import * as Notifications from 'expo-notifications';
// ❌ Línea eliminada: import * as Permissions from 'expo-permissions';

import { auth, db } from './firebaseConfig';

import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import HomeScreen from './Screens/HomeScreen';
import HelpScreen from './Screens/HelpScreen';
import ProgressScreen from './Screens/ProgressScreen';
import DetalleSemana from './Screens/DetalleSemana';
import TallerScreen from './Screens/TallerScreen';
import SplashScreen from './Screens/SplashScreen';
import TallerNavigator from './Screens/TallerNavigator';

import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Taller" component={TallerNavigator} />
      <Tab.Screen name="Ayuda" component={HelpScreen} />
      <Tab.Screen name="Progreso" component={ProgressScreen} />
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
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('No se pueden recibir notificaciones sin permiso');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);
  return token;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     setUser(currentUser);
  //     setAuthChecked(true);

  //     if (currentUser) {
  //       const token = await registerForPushNotificationsAsync();
  //       if (token) {
  //         await setDoc(doc(db, 'users', currentUser.uid), { expoPushToken: token }, { merge: true });
  //       }

  //       const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
  //       if (userDoc.exists()) {
  //         const data = userDoc.data();
  //         setUser({
  //           ...currentUser,
  //           ultimaSemanaCompletada: data.ultimaSemanaCompletada || 0,
  //         });
  //       } else {
  //         setUser({ ...currentUser, ultimaSemanaCompletada: 0 });
  //       }
  //     }
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setAuthChecked(true);

    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();

        // Verifica si está habilitado
        if (data.enabled === false) {
          Toast.show({
            type: 'error',
            text1: 'Cuenta deshabilitada',
            text2: 'Tu cuenta ha sido inhabilitada por el administrador.',
          });

          await signOut(auth);
          setUser(null);
          return;
        }

        // Guarda token y datos del usuario
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await setDoc(userRef, { expoPushToken: token }, { merge: true });
        }

        setUser({
          ...currentUser,
          ultimaSemanaCompletada: data.ultimaSemanaCompletada || 0,
        });
      } else {
        // Si no existe el documento, crea uno básico
        await setDoc(userRef, { enabled: true }); // Por defecto habilitado
        setUser({ ...currentUser, ultimaSemanaCompletada: 0 });
      }
    } else {
      setUser(null);
    }
  });

  return unsubscribe;
}, []);


  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

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
