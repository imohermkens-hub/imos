import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

export default function ManagerDashboardScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState({ open: 0, inBehandeling: 0, opgelost: 0 });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
    laadStats();
  }, []);

  async function laadStats() {
    const { data } = await supabase.from('meldingen').select('status');
    if (!data) return;
    setStats({
      open: data.filter((m) => m.status === 'open').length,
      inBehandeling: data.filter((m) => m.status === 'in_behandeling').length,
      opgelost: data.filter((m) => m.status === 'opgelost').length,
    });
  }

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
            <Text style={styles.subGreeting}>Beheerder portaal</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Uitloggen</Text>
          </TouchableOpacity>
        </View>

        {/* Statistieken */}
        <Text style={styles.sectionTitle}>Overzicht meldingen</Text>
        <View style={styles.statsRij}>
          <View style={[styles.statKaart, { backgroundColor: '#FFF3CD' }]}>
            <Text style={styles.statGetal}>{stats.open}</Text>
            <Text style={styles.statLabel}>Open</Text>
          </View>
          <View style={[styles.statKaart, { backgroundColor: '#CCE5FF' }]}>
            <Text style={styles.statGetal}>{stats.inBehandeling}</Text>
            <Text style={styles.statLabel}>In behandeling</Text>
          </View>
          <View style={[styles.statKaart, { backgroundColor: '#D4EDDA' }]}>
            <Text style={styles.statGetal}>{stats.opgelost}</Text>
            <Text style={styles.statLabel}>Opgelost</Text>
          </View>
        </View>

        {/* Acties */}
        <Text style={styles.sectionTitle}>Beheer</Text>
        <View style={styles.actiesLijst}>
          <TouchableOpacity style={styles.actieKaart} onPress={() => navigation.navigate('ManagerMeldingen')}>
            <View style={styles.actieLinks}>
              <Text style={styles.actieIcon}>🔧</Text>
              <View>
                <Text style={styles.actieTitle}>Meldingen</Text>
                <Text style={styles.actieSub}>Bekijk en verwerk alle meldingen</Text>
              </View>
            </View>
            <Text style={styles.actieChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actieKaart}>
            <View style={styles.actieLinks}>
              <Text style={styles.actieIcon}>🏠</Text>
              <View>
                <Text style={styles.actieTitle}>Woningen</Text>
                <Text style={styles.actieSub}>Beheer het vastgoedportfolio</Text>
              </View>
            </View>
            <Text style={styles.actieChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actieKaart}>
            <View style={styles.actieLinks}>
              <Text style={styles.actieIcon}>👥</Text>
              <View>
                <Text style={styles.actieTitle}>Huurders</Text>
                <Text style={styles.actieSub}>Overzicht van alle huurders</Text>
              </View>
            </View>
            <Text style={styles.actieChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actieKaart}>
            <View style={styles.actieLinks}>
              <Text style={styles.actieIcon}>💶</Text>
              <View>
                <Text style={styles.actieTitle}>Financiën</Text>
                <Text style={styles.actieSub}>Huurbetalingen en kosten</Text>
              </View>
            </View>
            <Text style={styles.actieChevron}>›</Text>
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
    marginBottom: 28,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 14,
  },
  statsRij: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statKaart: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  statGetal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  statLabel: {
    fontSize: 11,
    color: '#1A1A2E',
    marginTop: 2,
    textAlign: 'center',
  },
  actiesLijst: {
    gap: 10,
  },
  actieKaart: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  actieLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actieIcon: {
    fontSize: 26,
  },
  actieTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  actieSub: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 1,
  },
  actieChevron: {
    fontSize: 22,
    color: '#ADB5BD',
  },
});
