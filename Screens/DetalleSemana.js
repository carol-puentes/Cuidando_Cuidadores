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
//   ScrollView
// } from 'react-native';
// import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

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

//   const getIcono = (tipo) => {
//     switch (tipo) {
//       case 'pantalla': return 'book-open-page-variant';
//       case 'texto': return 'file-document-outline';
//       case 'video': return 'play-circle-outline';
//       case 'formulario': return 'pencil-outline';
//       default: return 'file-outline';
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
//               onPress={() => tieneContenido ? toggleExpand(index) : manejarRecurso(recurso)}
//             >
//               <View style={styles.acordeonContenido}>
//                 <MaterialCommunityIcons name={getIcono(recurso.tipo)} size={22} color="#374151" />
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
//     marginBottom: 8,
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
//     marginBottom: 12,
//     paddingTop: 4,
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
//     fontWeight: '500',
//     marginLeft: 10,
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
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#3B82F6',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 30,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 4,
//   },
//   botonTexto: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });


import React, { useState } from 'react';
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
} from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

// Habilita animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DetalleSemana({ route, navigation }) {
  const { contenido, onCompletar } = route.params;
  const [expandido, setExpandido] = useState(null);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandido(expandido === index ? null : index);
  };

  const manejarRecurso = (recurso) => {
    if (recurso.url) {
      Linking.openURL(recurso.url);
    }
  };

  const manejarCompletar = () => {
    onCompletar();
    navigation.goBack();
  };

  // ✅ Mapea íconos por tipo de recurso
  const getIconoPorTipo = (tipo) => {
    switch (tipo) {
      case 'pantalla':
        return 'book-open-variant';
      case 'texto':
        return 'file-document-outline';
      case 'video':
        return 'play-circle-outline';
      case 'formulario':
        return 'pencil-outline';
      default:
        return 'file-outline';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.semana}>Semana {contenido.semana}</Text>
      <Text style={styles.titulo}>{contenido.titulo}</Text>
      <Text style={styles.objetivos}>{contenido.objetivos}</Text>

      {contenido.recursos.map((recurso, index) => {
        const tieneContenido = !!recurso.contenido;
        const estaExpandido = expandido === index;

        return (
          <View key={index} style={styles.acordeon}>
            <TouchableOpacity
              style={styles.acordeonHeader}
              onPress={() =>
                tieneContenido ? toggleExpand(index) : manejarRecurso(recurso)
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
                  name={estaExpandido ? 'chevron-up' : 'chevron-down'}
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
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity style={styles.boton} onPress={manejarCompletar}>
        <Feather name="check-circle" size={20} color="#fff" />
        <Text style={styles.botonTexto}>  Marcar como completado</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    paddingBottom: 50,
  },
  semana: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  objetivos: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 20,
  },
  acordeon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  acordeonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  acordeonContenido: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  acordeonTexto: {
    fontSize: 15,
    color: '#111827',
    marginLeft: 10,
    fontWeight: '500',
    flexShrink: 1,
  },
  acordeonContenidoInterno: {
    backgroundColor: '#F3F4F6',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  texto: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
