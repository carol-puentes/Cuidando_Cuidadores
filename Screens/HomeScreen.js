import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import YoutubePlayer from "react-native-youtube-iframe";

const screenWidth = Dimensions.get("window").width;
const videoWidth = screenWidth * 0.9; // 90% del ancho de la pantalla
const videoHeight = (videoWidth * 9) / 16; // Mantiene relación 16:9

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [playing, setPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>


      {/* Miniatura del video */}
      {!showVideo ? (
        <TouchableOpacity onPress={() => setShowVideo(true)} style={{ marginTop: 20 }}>
          <Image
            source={{ uri: "https://img.youtube.com/vi/AdZPmob8wtE/0.jpg" }}
            style={{
              width: videoWidth,
              height: videoHeight,
              borderRadius: 10,
            }}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <YoutubePlayer
            height={videoHeight}
            width={videoWidth}
            play={playing}
            videoId="AdZPmob8wtE"
            webViewProps={{
              scrollEnabled: false, // 🔹 Evita que el video bloquee el desplazamiento
            }}
            onChangeState={(event) => {
              if (event === "ended") setShowVideo(false);
            }}
          />
        </View>
      )}

      <Text style={{ marginTop: 20 }}>{t("selectLanguage")}</Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue) => changeLanguage(itemValue)}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="Español" value="es" />
        <Picker.Item label="English" value="en" />
      </Picker>
    </ScrollView>
  );
}
