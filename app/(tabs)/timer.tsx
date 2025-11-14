import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, RotateCcw } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const TIMER_SIZE = Math.min(width * 0.7, 280);

export default function TimerScreen() {
  const insets = useSafeAreaInsets();
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(300);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progress = useRef(new Animated.Value(0)).current;

  const currentSeconds = minutes * 60 + seconds;

  useEffect(() => {
    if (isRunning && currentSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            setMinutes((m) => {
              if (m === 0) {
                setIsRunning(false);
                return 0;
              }
              return m - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, currentSeconds]);

  useEffect(() => {
    const progressValue = totalSeconds > 0 ? currentSeconds / totalSeconds : 0;
    Animated.timing(progress, {
      toValue: progressValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentSeconds, totalSeconds]);

  const handlePlayPause = () => {
    if (currentSeconds > 0) {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(5);
    setSeconds(0);
    setTotalSeconds(300);
  };

  const adjustMinutes = (delta: number) => {
    if (!isRunning) {
      const newMinutes = Math.max(0, Math.min(99, minutes + delta));
      setMinutes(newMinutes);
      setTotalSeconds(newMinutes * 60);
    }
  };

  const formatTime = (m: number, s: number) => {
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Timer</Text>

        <View style={styles.timerContainer}>
          <View style={styles.progressCircle}>
            <View style={styles.progressBackground} />
            <Animated.View
              style={[
                styles.progressFill,
                {
                  transform: [
                    {
                      rotate: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            />
            <View style={styles.timerContent}>
              {!isRunning && currentSeconds === minutes * 60 ? (
                <View style={styles.adjustControls}>
                  <TouchableOpacity
                    style={styles.adjustButton}
                    onPress={() => adjustMinutes(-1)}>
                    <Text style={styles.adjustButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeDisplay}>{formatTime(minutes, 0)}</Text>
                  <TouchableOpacity
                    style={styles.adjustButton}
                    onPress={() => adjustMinutes(1)}>
                    <Text style={styles.adjustButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.timeDisplay}>
                  {formatTime(minutes, seconds)}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}>
            <RotateCcw size={28} color="#F1F5F9" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.playButton,
              currentSeconds === 0 && styles.buttonDisabled,
            ]}
            onPress={handlePlayPause}
            disabled={currentSeconds === 0}>
            {isRunning ? (
              <Pause size={36} color="#1E293B" strokeWidth={2} />
            ) : (
              <Play size={36} color="#1E293B" strokeWidth={2} />
            )}
          </TouchableOpacity>

          <View style={styles.buttonPlaceholder} />
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
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 60,
  },
  timerContainer: {
    marginBottom: 60,
  },
  progressCircle: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
    borderWidth: 8,
    borderColor: '#334155',
  },
  progressFill: {
    position: 'absolute',
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
    borderWidth: 8,
    borderColor: '#60A5FA',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timerContent: {
    width: TIMER_SIZE - 40,
    height: TIMER_SIZE - 40,
    borderRadius: (TIMER_SIZE - 40) / 2,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  adjustControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  adjustButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#475569',
  },
  adjustButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  timeDisplay: {
    fontSize: 56,
    fontWeight: '700',
    color: '#F1F5F9',
    letterSpacing: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resetButton: {
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#475569',
  },
  playButton: {
    backgroundColor: '#60A5FA',
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  buttonDisabled: {
    backgroundColor: '#475569',
    opacity: 0.5,
  },
  buttonPlaceholder: {
    width: 70,
  },
});
