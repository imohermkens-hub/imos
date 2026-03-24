import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

export default function TenantHomeScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigation.replace('Home');
  }

  const voornaam = email.split('@')[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hoi, {voornaam}</Text>
            <Text style={styles.subGreeting}>Welkom in je portaal</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Uitloggen</Text>
          </TouchableOpacity>
        </View>

        {/* Woning kaart */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Jouw woning</Text>
          <Text style={styles.cardAddress}>Koppeling volgt</Text>
          <View style={styles.cardRow}>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>Huurder</Text>
            </View>
          </View>
        </View>

        {/* Acties */}
        <Text style={styles.sectionTitle}>Wat wil je doen?</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Melding')}>
            <Text style={styles.actionIcon}>🔧</Text>
            <Text style={styles.actionTitle}>Melding indienen</Text>
            <Text style={styles.actionSub}>Reparatie of klacht</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionTitle}>Berichten</Text>
            <Text style={styles.actionSub}>Contact met beheerder</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionTitle}>Documenten</Text>
            <Text style={styles.actionSub}>Huurcontract & meer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>💶</Text>
            <Text style={styles.actionTitle}>Betalingen</Text>
            <Text style={styles.actionSub}>Huuroverzicht</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#6C757D',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
  },
  cardLabel: {
    fontSize: 12,
    color: '#ADB5BD',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  cardAddress: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  actionSub: {
    fontSize: 12,
    color: '#6C757D',
  },
});
