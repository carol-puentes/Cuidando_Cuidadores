import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Dimensions, View } from "react-native";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationEnd }) => {
  const position = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(position, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 90,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationEnd();
    });
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 90],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.container}>
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="rgba(162, 213, 242, 0.1)" />
            <Stop offset="1" stopColor="rgba(184, 232, 210, 1)" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>

      <Animated.Image
        source={require('../assets/logo.jpg')}
        style={[
          styles.logo,
          {
            transform: [
              { translateY: position },
              { scale: scale },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
