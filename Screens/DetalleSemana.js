// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Linking,
//   StyleSheet,
//   LayoutAnimation,
//   UIManager,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

// // Habilita animaciones en Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// export default function DetalleSemana({ route, navigation }) {
//   const { contenido, onCompletar } = route.params;
//   const [expandido, setExpandido] = useState(null);

//   const toggleExpand = (index) => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setExpandido(expandido === index ? null : index);
//   };

//   const manejarRecurso = (recurso) => {
//     if (recurso.url) {
//       Linking.openURL(recurso.url);
//     }
//   };

//   const manejarCompletar = () => {
//     onCompletar();
//     navigation.goBack();
//   };

//   // ✅ Mapea íconos por tipo de recurso
//   const getIconoPorTipo = (tipo) => {
//     switch (tipo) {
//       case 'pantalla':
//         return 'book-open-variant';
//       case 'texto':
//         return 'file-document-outline';
//       case 'video':
//         return 'play-circle-outline';
//       case 'formulario':
//         return 'pencil-outline';
//       default:
//         return 'file-outline';
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.semana}>Semana {contenido.semana}</Text>
//       <Text style={styles.titulo}>{contenido.titulo}</Text>
//       <Text style={styles.objetivos}>{contenido.objetivos}</Text>

//       {contenido.recursos.map((recurso, index) => {
//         const tieneContenido = !!recurso.contenido;
//         const estaExpandido = expandido === index;

//         return (
//           <View key={index} style={styles.acordeon}>
//             <TouchableOpacity
//               style={styles.acordeonHeader}
//               onPress={() =>
//                 tieneContenido ? toggleExpand(index) : manejarRecurso(recurso)
//               }
//             >
//               <View style={styles.acordeonContenido}>
//                 <MaterialCommunityIcons
//                   name={getIconoPorTipo(recurso.tipo)}
//                   size={22}
//                   color="#374151"
//                 />
//                 <Text style={styles.acordeonTexto}>{recurso.texto}</Text>
//               </View>
//               {tieneContenido ? (
//                 <Ionicons
//                   name={estaExpandido ? 'chevron-up' : 'chevron-down'}
//                   size={20}
//                   color="#6B7280"
//                 />
//               ) : (
//                 <Feather name="external-link" size={18} color="#4B5563" />
//               )}
//             </TouchableOpacity>

//             {estaExpandido && recurso.contenido && (
//               <View style={styles.acordeonContenidoInterno}>
//                 <Text style={styles.texto}>{recurso.contenido.trim()}</Text>
//               </View>
//             )}
//           </View>
//         );
//       })}

//       <TouchableOpacity style={styles.boton} onPress={manejarCompletar}>
//         <Feather name="check-circle" size={20} color="#fff" />
//         <Text style={styles.botonTexto}>  Marcar como completado</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#F9FAFB',
//     paddingBottom: 50,
//   },
//   semana: {
//     fontSize: 16,
//     color: '#3B82F6',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   titulo: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 12,
//   },
//   objetivos: {
//     fontSize: 15,
//     color: '#374151',
//     lineHeight: 22,
//     marginBottom: 20,
//   },
//   acordeon: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.03,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   acordeonHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//   },
//   acordeonContenido: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   acordeonTexto: {
//     fontSize: 15,
//     color: '#111827',
//     marginLeft: 10,
//     fontWeight: '500',
//     flexShrink: 1,
//   },
//   acordeonContenidoInterno: {
//     backgroundColor: '#F3F4F6',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     paddingHorizontal: 16,
//     paddingBottom: 14,
//     paddingTop: 8,
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//   },
//   texto: {
//     fontSize: 15,
//     color: '#374151',
//     lineHeight: 22,
//   },
//   boton: {
//     marginTop: 20,
//     backgroundColor: '#3B82F6',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   botonTexto: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Linking,
//   StyleSheet,
//   LayoutAnimation,
//   UIManager,
//   Platform,
//   ScrollView
// } from 'react-native';
// import * as Speech from 'expo-speech';
// import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// export default function DetalleSemana({ route, navigation }) {
//   const { contenido, onCompletar } = route.params;
//   const [expandido, setExpandido] = useState(null);
//   const [vozSeleccionada, setVozSeleccionada] = useState(null);
//   const [progresoAudio, setProgresoAudio] = useState(0);
//   const [leyendo, setLeyendo] = useState(false);
//   const progresoRef = useRef(null);
//   const duracionEstimada = useRef(0);

//   useEffect(() => {
//     const cargarVoces = async () => {
//       const voces = await Speech.getAvailableVoicesAsync();
//       const vozEspañol = voces.find(
//         (v) => v.language.startsWith('es') && v.quality === 'Enhanced'
//       );
//       setVozSeleccionada(vozEspañol?.identifier || null);
//     };

//     cargarVoces();

//     return () => {
//       detenerLectura();
//     };
//   }, []);

//   const limpiarTexto = (texto) => {
//     return texto.replace(
//       /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
//       ''
//     );
//   };

//   const leerTexto = (texto) => {
//     detenerLectura(); // si estaba leyendo, detenerlo
//     const textoLimpio = limpiarTexto(texto);
//     const palabras = textoLimpio.trim().split(/\s+/).length;
//     duracionEstimada.current = palabras * 500; // 500 ms por palabra (ajustable)

//     setProgresoAudio(0);
//     setLeyendo(true);

//     // Inicia progreso simulado
//     const tiempoTotal = duracionEstimada.current;
//     const inicio = Date.now();

//     progresoRef.current = setInterval(() => {
//       const transcurrido = Date.now() - inicio;
//       const progreso = Math.min((transcurrido / tiempoTotal) * 100, 100);
//       setProgresoAudio(progreso);

//       if (progreso >= 100) {
//         clearInterval(progresoRef.current);
//         setLeyendo(false);
//       }
//     }, 100);

//     // Inicia lectura
//     Speech.speak(textoLimpio, {
//       language: 'es-ES',
//       pitch: 1,
//       rate: 1,
//       voice: vozSeleccionada,
//       onDone: () => {
//         setLeyendo(false);
//         clearInterval(progresoRef.current);
//       },
//     });
//   };

//   const detenerLectura = () => {
//     Speech.stop();
//     setLeyendo(false);
//     clearInterval(progresoRef.current);
//     setProgresoAudio(0);
//   };

//   const toggleExpand = (index) => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setExpandido(expandido === index ? null : index);
//     detenerLectura(); // detener si cambia el recurso
//   };

//   const manejarRecurso = (recurso) => {
//     if (recurso.url) {
//       Linking.openURL(recurso.url);
//     }
//   };

//   const manejarCompletar = () => {
//     detenerLectura();
//     onCompletar();
//     navigation.goBack();
//   };

//   const getIconoPorTipo = (tipo) => {
//     switch (tipo) {
//       case 'pantalla':
//         return 'book-open-variant';
//       case 'texto':
//         return 'file-document-outline';
//       case 'video':
//         return 'play-circle-outline';
//       case 'formulario':
//         return 'pencil-outline';
//       default:
//         return 'file-outline';
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.semana}>Semana {contenido.semana}</Text>
//       <Text style={styles.titulo}>{contenido.titulo}</Text>
//       <Text style={styles.objetivos}>{contenido.objetivos}</Text>

//       {contenido.recursos.map((recurso, index) => {
//         const tieneContenido = !!recurso.contenido;
//         const estaExpandido = expandido === index;

//         return (
//           <View key={index} style={styles.acordeon}>
//             <TouchableOpacity
//               style={styles.acordeonHeader}
//               onPress={() =>
//                 tieneContenido ? toggleExpand(index) : manejarRecurso(recurso)
//               }
//             >
//               <View style={styles.acordeonContenido}>
//                 <MaterialCommunityIcons
//                   name={getIconoPorTipo(recurso.tipo)}
//                   size={22}
//                   color="#374151"
//                 />
//                 <Text style={styles.acordeonTexto}>{recurso.texto}</Text>
//               </View>
//               {tieneContenido ? (
//                 <Ionicons
//                   name={estaExpandido ? 'chevron-up' : 'chevron-down'}
//                   size={20}
//                   color="#6B7280"
//                 />
//               ) : (
//                 <Feather name="external-link" size={18} color="#4B5563" />
//               )}
//             </TouchableOpacity>

//             {estaExpandido && recurso.contenido && (
//               <View style={styles.acordeonContenidoInterno}>
//                 <Text style={styles.texto}>{recurso.contenido.trim()}</Text>

//                 <View style={{ marginTop: 10 }}>
//                   <TouchableOpacity
//                     style={styles.botonAudio}
//                     onPress={() =>
//                       leyendo
//                         ? detenerLectura()
//                         : leerTexto(recurso.contenido)
//                     }
//                   >
//                     <Feather
//                       name={leyendo ? 'square' : 'volume-2'}
//                       size={20}
//                       color="#3B82F6"
//                     />
//                     <Text style={styles.textoAudio}>
//                       {leyendo ? ' Detener lectura' : ' Escuchar en voz alta'}
//                     </Text>
//                   </TouchableOpacity>

//                   {/* Barra de progreso (simulada) */}
//                   {leyendo && (
//                     <View style={styles.barraContenedor}>
//                       <View
//                         style={[
//                           styles.barraProgreso,
//                           { width: `${progresoAudio}%` },
//                         ]}
//                       />
//                     </View>
//                   )}
//                 </View>
//               </View>
//             )}
//           </View>
//         );
//       })}

//       <TouchableOpacity style={styles.boton} onPress={manejarCompletar}>
//         <Feather name="check-circle" size={20} color="#fff" />
//         <Text style={styles.botonTexto}>  Marcar como completado</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#F9FAFB',
//     paddingBottom: 50,
//   },
//   semana: {
//     fontSize: 16,
//     color: '#3B82F6',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   titulo: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 12,
//   },
//   objetivos: {
//     fontSize: 15,
//     color: '#374151',
//     lineHeight: 22,
//     marginBottom: 20,
//   },
//   acordeon: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.03,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   acordeonHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//   },
//   acordeonContenido: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   acordeonTexto: {
//     fontSize: 15,
//     color: '#111827',
//     marginLeft: 10,
//     fontWeight: '500',
//     flexShrink: 1,
//   },
//   acordeonContenidoInterno: {
//     backgroundColor: '#F3F4F6',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     paddingHorizontal: 16,
//     paddingBottom: 14,
//     paddingTop: 8,
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//   },
//   texto: {
//     fontSize: 15,
//     color: '#374151',
//     lineHeight: 22,
//   },
//   botonAudio: {
//     marginTop: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   textoAudio: {
//     color: '#3B82F6',
//     fontSize: 15,
//     marginLeft: 6,
//   },
//   barraContenedor: {
//     height: 6,
//     backgroundColor: '#D1D5DB',
//     borderRadius: 5,
//     marginTop: 8,
//     overflow: 'hidden',
//   },
//   barraProgreso: {
//     height: '100%',
//     backgroundColor: '#3B82F6',
//   },
//   boton: {
//     marginTop: 20,
//     backgroundColor: '#3B82F6',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   botonTexto: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";


if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DetalleSemana({ route, navigation }) {
  const { contenido, onCompletar } = route.params;
  const [expandido, setExpandido] = useState(null);
  const [vozSeleccionada, setVozSeleccionada] = useState(null);
  const [progresoAudio, setProgresoAudio] = useState(0);
  const [leyendo, setLeyendo] = useState(false);
  const [modulosVistos, setModulosVistos] = useState([]);
  const [completado, setCompletado] = useState(false);
  const progresoRef = useRef(null);
  const duracionEstimada = useRef(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const voces = await Speech.getAvailableVoicesAsync();
      const vozEspañol = voces.find(
        (v) => v.language.startsWith("es") && v.quality === "Enhanced"
      );
      setVozSeleccionada(vozEspañol?.identifier || null);

      try {
        const progresoGuardado = await AsyncStorage.getItem(
          `progreso-${contenido.semana}`
        );
        if (progresoGuardado) {
          setModulosVistos(JSON.parse(progresoGuardado));
        }

        const completadoGuardado = await AsyncStorage.getItem(
          `completado-${contenido.semana}`
        );
        if (completadoGuardado === "true") {
          setCompletado(true);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();

    return () => {
      detenerLectura();
    };
  }, []);

  const limpiarTexto = (texto) => {
    return texto.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
      ""
    );
  };

  const leerTexto = (texto) => {
    detenerLectura();
    const textoLimpio = limpiarTexto(texto);
    const palabras = textoLimpio.trim().split(/\s+/).length;
    duracionEstimada.current = palabras * 500;

    setProgresoAudio(0);
    setLeyendo(true);
    const tiempoTotal = duracionEstimada.current;
    const inicio = Date.now();

    progresoRef.current = setInterval(() => {
      const transcurrido = Date.now() - inicio;
      const progreso = Math.min((transcurrido / tiempoTotal) * 100, 100);
      setProgresoAudio(progreso);

      if (progreso >= 100) {
        clearInterval(progresoRef.current);
        setLeyendo(false);
      }
    }, 100);

    Speech.speak(textoLimpio, {
      language: "es-ES",
      pitch: 1,
      rate: 1,
      voice: vozSeleccionada,
      onDone: () => {
        setLeyendo(false);
        clearInterval(progresoRef.current);
      },
    });
  };

  const detenerLectura = () => {
    Speech.stop();
    setLeyendo(false);
    clearInterval(progresoRef.current);
    setProgresoAudio(0);
  };

  const toggleExpand = async (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandido(expandido === index ? null : index);
    detenerLectura();

    if (!modulosVistos.includes(index)) {
      const nuevosVistos = [...modulosVistos, index];
      setModulosVistos(nuevosVistos);
      try {
        await AsyncStorage.setItem(
          `progreso-${contenido.semana}`,
          JSON.stringify(nuevosVistos)
        );
      } catch (error) {
        console.error("Error al guardar progreso:", error);
      }
    }
  };

  const manejarRecurso = async (recurso, index) => {
    if (!modulosVistos.includes(index)) {
      const nuevosVistos = [...modulosVistos, index];
      setModulosVistos(nuevosVistos);
      try {
        await AsyncStorage.setItem(
          `progreso-${contenido.semana}`,
          JSON.stringify(nuevosVistos)
        );
      } catch (error) {
        console.error("Error al guardar progreso:", error);
      }
    }
    if (recurso.url) {
      Linking.openURL(recurso.url);
    }
  };

  const manejarCompletar = async () => {
    detenerLectura();
    setCompletado(true);
    onCompletar();
    try {
      await AsyncStorage.setItem(`completado-${contenido.semana}`, "true");
    } catch (error) {
      console.error("Error al guardar estado completado:", error);
    }
    navigation.goBack();
  };

  const getIconoPorTipo = (tipo) => {
    switch (tipo) {
      case "pantalla":
        return "book-open-variant";
      case "texto":
        return "file-document-outline";
      case "video":
        return "play-circle-outline";
      case "formulario":
        return "pencil-outline";
      case "videollamada":
        return "video-outline"; 
      default:
        return "file-outline";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.semana}>Semana {contenido.semana}</Text> */}

      <View style={styles.filaSemana}>
        <Text style={styles.semana}>Semana {contenido.semana}</Text>
        <TouchableOpacity
          onPress={() => {
            detenerLectura(); // Detener audio si está activo
            navigation.goBack();
          }}
        >
          <View style={styles.botonVolver}>
            <Ionicons name="arrow-back" size={24} color="#8080ff" />
          </View>
          
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>{contenido.titulo}</Text>
      <Text style={styles.objetivos}>{contenido.objetivos}</Text>

      {contenido.recursos.map((recurso, index) => {
        const tieneContenido = !!recurso.contenido;
        const estaExpandido = expandido === index;
        const estaVisto = modulosVistos.includes(index);

        return (
          <View
            key={index}
            style={[
              styles.acordeon,
              estaVisto && { borderColor: "#8080FF", borderWidth: 2 },
            ]}
          >
            <TouchableOpacity
              style={styles.acordeonHeader}
              onPress={() =>
                tieneContenido
                  ? toggleExpand(index)
                  : manejarRecurso(recurso, index)
              }
            >
              <View style={styles.acordeonContenido}>
                <MaterialCommunityIcons
                  name={getIconoPorTipo(recurso.tipo)}
                  size={22}
                  color="#374151"
                />
                <Text style={styles.acordeonTexto}>{recurso.texto}</Text>
              </View>
              {tieneContenido ? (
                <Ionicons
                  name={estaExpandido ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6B7280"
                />
              ) : (
                <Feather name="external-link" size={18} color="#4B5563" />
              )}
            </TouchableOpacity>

            {estaExpandido && recurso.contenido && (
              <View style={styles.acordeonContenidoInterno}>
                <Text style={styles.texto}>{recurso.contenido.trim()}</Text>

                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity
                    style={styles.botonAudio}
                    onPress={() =>
                      leyendo ? detenerLectura() : leerTexto(recurso.contenido)
                    }
                  >
                    <Feather
                      name={leyendo ? "square" : "volume-2"}
                      size={20}
                      color="#3B82F6"
                    />
                    <Text style={styles.textoAudio}>
                      {leyendo ? " Detener lectura" : " Escuchar en voz alta"}
                    </Text>
                  </TouchableOpacity>

                  {leyendo && (
                    <View style={styles.barraContenedor}>
                      <View
                        style={[
                          styles.barraProgreso,
                          { width: `${progresoAudio}%` },
                        ]}
                      />
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        style={[
          styles.boton,
          (modulosVistos.length !== contenido.recursos.length ||
            completado) && { opacity: 0.5 },
        ]}
        onPress={manejarCompletar}
        disabled={
          modulosVistos.length !== contenido.recursos.length || completado
        }
      >
        <Feather name="check-circle" size={20} color="#fff" />
        <Text style={styles.botonTexto}>
          {" "}
          {completado ? "Semana completada" : "Marcar como completado"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9FAFB",
    paddingBottom: 50,
  },
  semana: {
    fontSize: 30,
    color: "#8080ff",
    fontWeight: "600",
    marginTop: 40,
    marginBottom: 20,

  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  objetivos: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 20,
  },
  acordeon: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  acordeonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  acordeonContenido: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  acordeonTexto: {
    fontSize: 15,
    color: "#111827",
    marginLeft: 10,
    fontWeight: "500",
    flexShrink: 1,
  },
  acordeonContenidoInterno: {
    backgroundColor: "#F3F4F6",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  texto: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  botonAudio: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textoAudio: {
    color: "#3B82F6",
    fontSize: 15,
    marginLeft: 6,
  },
  barraContenedor: {
    height: 6,
    backgroundColor: "#D1D5DB",
    borderRadius: 5,
    marginTop: 8,
    overflow: "hidden",
  },
  barraProgreso: {
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  boton: {
    marginTop: 20,
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  filaSemana: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  botonVolver: {
    flexDirection: "row",
    alignItems: "center",
  },
});
