// notifications.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('No se pudo obtener permisos para notificaciones.');
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Debes usar un dispositivo físico para recibir notificaciones push.');
    return null;
  }

  return token;
}
