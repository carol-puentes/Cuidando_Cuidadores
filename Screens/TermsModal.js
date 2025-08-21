import React, { useState } from "react";
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from "react-native";
import CheckBox from "@react-native-community/checkbox"; // asegúrate de instalarlo

export default function TermsModal({ visible, onAccept, onClose }) {
  const [checked, setChecked] = useState(false);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Términos y Condiciones</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.text}>
              Bienvenido/a a la aplicación <Text style={{ fontWeight: "bold" }}>AYLLU</Text>. 
              Al registrarse y utilizar esta aplicación, usted acepta los siguientes términos y condiciones:
            </Text>

            <Text style={styles.sectionTitle}>1. Aceptación de términos</Text>
            <Text style={styles.text}>
              El uso de esta aplicación implica la aceptación plena y sin reservas de todos los términos y condiciones aquí establecidos.
            </Text>

            <Text style={styles.sectionTitle}>2. Uso de la aplicación</Text>
            <Text style={styles.text}>
              Esta aplicación está destinada a cuidadores y administradores. 
              Usted se compromete a usarla únicamente con fines personales y respetuosos, 
              evitando el uso indebido o fraudulento.
            </Text>

            <Text style={styles.sectionTitle}>3. Registro de usuarios</Text>
            <Text style={styles.text}>
              Al registrarse, usted acepta proporcionar información veraz y actualizada. 
              El incumplimiento puede conllevar a la suspensión o eliminación de la cuenta.
            </Text>

            <Text style={styles.sectionTitle}>4. Responsabilidad del usuario</Text>
            <Text style={styles.text}>
              Usted es responsable del uso que haga de la aplicación, incluyendo los datos 
              que registre y la información que comparta.
            </Text>

            <Text style={styles.sectionTitle}>5. Privacidad y protección de datos</Text>
            <Text style={styles.text}>
              Los datos proporcionados serán tratados de acuerdo con nuestra Política de Privacidad. 
              No compartiremos su información personal con terceros sin su consentimiento.
            </Text>

            <Text style={styles.sectionTitle}>6. Modificaciones</Text>
            <Text style={styles.text}>
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
              Las modificaciones serán notificadas en la aplicación.
            </Text>

            <Text style={styles.sectionTitle}>7. Contacto</Text>
            <Text style={styles.text}>
              Para cualquier consulta o reclamo puede escribirnos a: {"\n"}
              <Text style={{ fontWeight: "bold" }}>artesanosdelcuidado.app@gmail.com</Text>
            </Text>
          </ScrollView>

          {/* Checkbox */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={checked}
              onValueChange={setChecked}
            />
            <Text style={styles.checkboxText}>He leído y acepto los términos</Text>
          </View>

          {/* Botones */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.acceptButton, { opacity: checked ? 1 : 0.5 }]}
              disabled={!checked}
              onPress={() => {
                setChecked(false);
                onAccept();
              }}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    height: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  scroll: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "justify",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
