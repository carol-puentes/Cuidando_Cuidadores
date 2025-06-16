// // firebaseConfig.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // 🔹 Importar Firestore

// const firebaseConfig = {
//   apiKey: "AIzaSyB6-6ei3uqT6Xd0Q0x9u8VEYbglLqeV8gE",
//   authDomain: "app-independiente.firebaseapp.com",
//   projectId: "app-independiente",
//   storageBucket: "app-independiente.appspot.com", // 🔹 Corrección aquí
//   messagingSenderId: "621100125899",
//   appId: "1:621100125899:web:ca2d170245831bbeb4954e"
// };

// // Inicializar Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app); // 🔹 Para autenticación con Firebase
// export const db = getFirestore(app); // 🔹 Inicializar Firestore
// export default app;
// firebaseConfig.js

// firebaseConfig.js


// import { initializeApp } from "firebase/app";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyB6-6ei3uqT6Xd0Q0x9u8VEYbglLqeV8gE",
//   authDomain: "app-independiente.firebaseapp.com",
//   projectId: "app-independiente",
//   storageBucket: "app-independiente.appspot.com",
//   messagingSenderId: "621100125899",
//   appId: "1:621100125899:web:ca2d170245831bbeb4954e"
// };

// const app = initializeApp(firebaseConfig);

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// const db = getFirestore(app);

// export { auth, db };



// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB6-6ei3uqT6Xd0Q0x9u8VEYbglLqeV8gE",
  authDomain: "app-independiente.firebaseapp.com",
  projectId: "app-independiente",
  storageBucket: "app-independiente.appspot.com",
  messagingSenderId: "621100125899",
  appId: "1:621100125899:web:ca2d170245831bbeb4954e"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
