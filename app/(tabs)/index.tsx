import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CLOCK_SIZE = Math.min(width * 0.8, 320);

export default function ClockScreen() {
  const insets = useSafeAreaInsets();
  const [time, setTime] = useState(new Date());
  const secondRotation = useSharedValue(0);
  const minuteRotation = useSharedValue(0);
  const hourRotation = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);

      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      secondRotation.value = withTiming((seconds * 6) % 360, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      minuteRotation.value = withTiming(
        (minutes * 6 + seconds * 0.1) % 360,
        {
          duration: 300,
          easing: Easing.out(Easing.ease),
        }
      );
      hourRotation.value = withTiming(
        (hours * 30 + minutes * 0.5) % 360,
        {
          duration: 300,
          easing: Easing.out(Easing.ease),
        }
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const secondStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${secondRotation.value}deg` }],
  }));

  const minuteStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${minuteRotation.value}deg` }],
  }));

  const hourStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${hourRotation.value}deg` }],
  }));

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <Text style={styles.digitalTime}>{formatTime(time)}</Text>
        <Text style={styles.date}>{formatDate(time)}</Text>

        <View style={styles.clockContainer}>
          <View style={styles.clock}>
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const isQuarter = i % 3 === 0;
              const distance = CLOCK_SIZE / 2 - 30;
              const x = Math.sin(angle) * distance;
              const y = -Math.cos(angle) * distance;

              return (
                <View
                  key={i}
                  style={[
                    styles.hourMarker,
                    isQuarter && styles.hourMarkerLarge,
                    {
                      transform: [{ translateX: x }, { translateY: y }],
                    },
                  ]}>
                  <Text
                    style={[
                      styles.hourText,
                      isQuarter && styles.hourTextLarge,
                    ]}>
                    {i === 0 ? 12 : i}
                  </Text>
                </View>
              );
            })}

            <Animated.View style={[styles.hand, styles.hourHand, hourStyle]} />
            <Animated.View
              style={[styles.hand, styles.minuteHand, minuteStyle]}
            />
            <Animated.View
              style={[styles.hand, styles.secondHand, secondStyle]}
            />

            <View style={styles.centerDot} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  digitalTime: {
    fontSize: 56,
    fontWeight: '700',
    color: '#F1F5F9',
    letterSpacing: 2,
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 60,
    fontWeight: '500',
  },
  clockContainer: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clock: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    borderRadius: CLOCK_SIZE / 2,
    backgroundColor: '#1E293B',
    borderWidth: 8,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  hourMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourMarkerLarge: {
    width: 50,
    height: 50,
  },
  hourText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  hourTextLarge: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '700',
  },
  hand: {
    position: 'absolute',
    backgroundColor: '#F1F5F9',
    transformOrigin: 'center bottom',
    borderRadius: 10,
  },
  hourHand: {
    width: 6,
    height: CLOCK_SIZE * 0.25,
    backgroundColor: '#E2E8F0',
    bottom: CLOCK_SIZE / 2,
  },
  minuteHand: {
    width: 4,
    height: CLOCK_SIZE * 0.35,
    backgroundColor: '#CBD5E1',
    bottom: CLOCK_SIZE / 2,
  },
  secondHand: {
    width: 2,
    height: CLOCK_SIZE * 0.38,
    backgroundColor: '#60A5FA',
    bottom: CLOCK_SIZE / 2,
  },
  centerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#60A5FA',
    position: 'absolute',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
});
