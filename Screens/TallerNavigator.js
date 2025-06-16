// En TallerNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TallerScreen from './TallerScreen';
import DetalleSemana from './DetalleSemana';

const Stack = createNativeStackNavigator();

export default function TallerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TallerHome" component={TallerScreen} />
      <Stack.Screen name="DetalleSemana" component={DetalleSemana} />
    </Stack.Navigator>
  );
}
