import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mystyles } from '../../styles/main';

const splashOverlay = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const splashContent = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function SplashScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(attendees)/event-landing');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={mystyles.container1}>
      {showSplash ? (
        <Animated.View style={[splashOverlay.container, { opacity: splashOpacity }]}>
          <View style={splashContent.container}>
            <Image source={require('../../assets/images/splash-icon - Copy.png')}
            style={{ width: 55, height: 55 }}
            resizeMode="contain"
            />
          </View>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}