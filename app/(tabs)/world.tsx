import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin } from 'lucide-react-native';

interface WorldClock {
  city: string;
  timezone: string;
  offset: number;
}

const WORLD_CLOCKS: WorldClock[] = [
  { city: 'New York', timezone: 'America/New_York', offset: -5 },
  { city: 'London', timezone: 'Europe/London', offset: 0 },
  { city: 'Paris', timezone: 'Europe/Paris', offset: 1 },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', offset: 9 },
  { city: 'Sydney', timezone: 'Australia/Sydney', offset: 11 },
  { city: 'Dubai', timezone: 'Asia/Dubai', offset: 4 },
  { city: 'Singapore', timezone: 'Asia/Singapore', offset: 8 },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles', offset: -8 },
];

export default function WorldClockScreen() {
  const insets = useSafeAreaInsets();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeForTimezone = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(currentTime);
  };

  const getDateForTimezone = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(currentTime);
  };

  return (
    <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>World Clocks</Text>
        <Text style={styles.subtitle}>Time around the globe</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {WORLD_CLOCKS.map((clock, index) => (
          <View key={index} style={styles.clockCard}>
            <LinearGradient
              colors={['#334155', '#1E293B']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <View style={styles.cardHeader}>
                <View style={styles.cityContainer}>
                  <MapPin size={20} color="#60A5FA" strokeWidth={2} />
                  <Text style={styles.cityName}>{clock.city}</Text>
                </View>
                <Text style={styles.date}>
                  {getDateForTimezone(clock.timezone)}
                </Text>
              </View>
              <Text style={styles.time}>
                {getTimeForTimezone(clock.timezone)}
              </Text>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  clockCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  date: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  time: {
    fontSize: 42,
    fontWeight: '700',
    color: '#60A5FA',
    letterSpacing: 2,
  },
});
