// screens/EditarSemana.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function EditarSemana({ route, navigation }) {
  const { contenido } = route.params;
  const [titulo, setTitulo] = useState(contenido.titulo);
  const [objetivos, setObjetivos] = useState(contenido.objetivos);
  const [recursos, setRecursos] = useState(contenido.recursos);

  const actualizarRecurso = (index, campo, valor) => {
    const nuevos = [...recursos];
    nuevos[index][campo] = valor;
    setRecursos(nuevos);
  };



  const guardarCambios = async () => {
  try {
    await setDoc(doc(db, 'semanas', contenido.id), {
      semana: contenido.semana,
      titulo,
      objetivos,
      recursos,
    });

    Alert.alert(
      'Éxito',
      'Los cambios se guardaron en Firestore.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(), // ← Regresa a la pantalla anterior
        },
      ]
    );

    if (route.params?.onGuardar) {
      route.params.onGuardar();
    }
  } catch (error) {
    console.error('Error al guardar en Firestore:', error);
    Alert.alert('Error', 'No se pudieron guardar los cambios.');
  }
};


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Editar Semana {contenido.semana}</Text>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#8080ff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        multiline
      />

      <Text style={styles.label}>Objetivos:</Text>
      <TextInput
        style={styles.input}
        value={objetivos}
        onChangeText={setObjetivos}
        multiline
      />

      {recursos.map((recurso, index) => (
        <View key={index} style={styles.recursoContainer}>
          <Text style={styles.recursoTitulo}>
            Recurso {index + 1} ({recurso.tipo}):
          </Text>

          <Text style={styles.subLabel}>Texto:</Text>
          <TextInput
            style={styles.input}
            value={recurso.texto}
            onChangeText={(text) => actualizarRecurso(index, "texto", text)}
            multiline
          />

          {recurso.url !== undefined && (
            <>
              <Text style={styles.subLabel}>URL:</Text>
              <TextInput
                style={styles.input}
                value={recurso.url}
                onChangeText={(url) => actualizarRecurso(index, "url", url)}
              />
            </>
          )}

          {recurso.contenido !== undefined && (
            <>
              <Text style={styles.subLabel}>Contenido:</Text>
              <TextInput
                style={styles.inputArea}
                value={recurso.contenido}
                onChangeText={(contenido) =>
                  actualizarRecurso(index, "contenido", contenido)
                }
                multiline
              />
            </>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.boton} onPress={guardarCambios}>
        <Feather name="save" size={20} color="#fff" />
        <Text style={styles.botonTexto}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9FAFB",
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  headerText: {
    fontSize: 30,
    color: "#8080ff",
    fontWeight: "600",
    marginTop: 40,
    marginBottom: 20,
  },

  botonVolver: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 6,
    fontWeight: "600",
  },
  subLabel: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    marginBottom: 12,
  },
  inputArea: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  recursoContainer: {
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  recursoTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1F2937",
  },
  boton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

