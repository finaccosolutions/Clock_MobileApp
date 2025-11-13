import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react-native';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
}

export default function StopwatchScreen() {
  const insets = useSafeAreaInsets();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastLapTime = useRef(0);

  const startStop = () => {
    if (isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsRunning(false);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    lastLapTime.current = 0;
  };

  const addLap = () => {
    if (isRunning) {
      const lapTime = time - lastLapTime.current;
      setLaps((prev) => [
        { id: prev.length + 1, time: time, lapTime: lapTime },
        ...prev,
      ]);
      lastLapTime.current = time;
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  const getFastestLap = () => {
    if (laps.length === 0) return null;
    return Math.min(...laps.map((lap) => lap.lapTime));
  };

  const getSlowestLap = () => {
    if (laps.length === 0) return null;
    return Math.max(...laps.map((lap) => lap.lapTime));
  };

  const fastestLapTime = getFastestLap();
  const slowestLapTime = getSlowestLap();

  return (
    <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Stopwatch</Text>

        <View style={styles.timeContainer}>
          <Text style={styles.timeDisplay}>{formatTime(time)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={isRunning ? addLap : reset}
            disabled={!isRunning && time === 0}>
            {isRunning ? (
              <>
                <Flag size={24} color="#F1F5F9" strokeWidth={2} />
                <Text style={styles.buttonText}>Lap</Text>
              </>
            ) : (
              <>
                <RotateCcw size={24} color="#F1F5F9" strokeWidth={2} />
                <Text style={styles.buttonText}>Reset</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={startStop}>
            {isRunning ? (
              <>
                <Pause size={28} color="#1E293B" strokeWidth={2} />
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Stop
                </Text>
              </>
            ) : (
              <>
                <Play size={28} color="#1E293B" strokeWidth={2} />
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Start
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {laps.length > 0 && (
          <View style={styles.lapsContainer}>
            <Text style={styles.lapsTitle}>Laps</Text>
            <ScrollView
              style={styles.lapsList}
              contentContainerStyle={styles.lapsContent}
              showsVerticalScrollIndicator={false}>
              {laps.map((lap, index) => {
                const isFastest =
                  laps.length > 1 && lap.lapTime === fastestLapTime;
                const isSlowest =
                  laps.length > 1 && lap.lapTime === slowestLapTime;

                return (
                  <View
                    key={lap.id}
                    style={[
                      styles.lapItem,
                      isFastest && styles.lapItemFastest,
                      isSlowest && styles.lapItemSlowest,
                    ]}>
                    <View style={styles.lapNumber}>
                      <Text
                        style={[
                          styles.lapNumberText,
                          isFastest && styles.lapTextFastest,
                          isSlowest && styles.lapTextSlowest,
                        ]}>
                        Lap {lap.id}
                      </Text>
                    </View>
                    <View style={styles.lapTimes}>
                      <Text
                        style={[
                          styles.lapTime,
                          isFastest && styles.lapTextFastest,
                          isSlowest && styles.lapTextSlowest,
                        ]}>
                        {formatTime(lap.lapTime)}
                      </Text>
                      <Text style={styles.totalTime}>
                        {formatTime(lap.time)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
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
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 40,
    textAlign: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 30,
  },
  timeDisplay: {
    fontSize: 64,
    fontWeight: '700',
    color: '#F1F5F9',
    letterSpacing: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 50,
    gap: 8,
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#60A5FA',
  },
  secondaryButton: {
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#475569',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  primaryButtonText: {
    color: '#1E293B',
  },
  lapsContainer: {
    flex: 1,
  },
  lapsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 16,
  },
  lapsList: {
    flex: 1,
  },
  lapsContent: {
    paddingBottom: 20,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#475569',
  },
  lapItemFastest: {
    borderColor: '#10B981',
    backgroundColor: '#1E40351A',
  },
  lapItemSlowest: {
    borderColor: '#EF4444',
    backgroundColor: '#3F12121A',
  },
  lapNumber: {
    flex: 1,
  },
  lapNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
  lapTimes: {
    alignItems: 'flex-end',
    gap: 4,
  },
  lapTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  totalTime: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  lapTextFastest: {
    color: '#10B981',
  },
  lapTextSlowest: {
    color: '#EF4444',
  },
});
