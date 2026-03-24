import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

const STATUS_KLEUREN: Record<string, string> = {
  open: '#FFF3CD',
  in_behandeling: '#CCE5FF',
  opgelost: '#D4EDDA',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_behandeling: 'In behandeling',
  opgelost: 'Opgelost',
};

const FILTERS = ['Alle', 'open', 'in_behandeling', 'opgelost'];

export default function ManagerMeldingenScreen({ navigation }: any) {
  const [meldingen, setMeldingen] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Alle');

  useEffect(() => {
    laadMeldingen();
  }, []);

  async function laadMeldingen() {
    setLoading(true);
    const { data } = await supabase
      .from('meldingen')
      .select('*')
      .order('aangemaakt_op', { ascending: false });
    setMeldingen(data ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, nieuweStatus: string) {
    await supabase.from('meldingen').update({ status: nieuweStatus }).eq('id', id);
    setMeldingen((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nieuweStatus } : m))
    );
  }

  const gefilterd = filter === 'Alle' ? meldingen : meldingen.filter((m) => m.status === filter);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Terug</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meldingen</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Filters */}
      <View style={styles.filterRij}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterKnop, filter === f && styles.filterKnopActief]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTekst, filter === f && styles.filterTekstActief]}>
              {STATUS_LABELS[f] ?? f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#1A1A2E" />
      ) : gefilterd.length === 0 ? (
        <View style={styles.leeg}>
          <Text style={styles.leegTekst}>Geen meldingen gevonden.</Text>
        </View>
      ) : (
        <FlatList
          data={gefilterd}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lijst}
          renderItem={({ item }) => (
            <View style={styles.kaart}>
              <View style={styles.kaartHeader}>
                <Text style={styles.categorie}>{item.categorie}</Text>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_KLEUREN[item.status] ?? '#F8F9FA' }]}>
                  <Text style={styles.statusTekst}>{STATUS_LABELS[item.status] ?? item.status}</Text>
                </View>
              </View>
              <Text style={styles.omschrijving}>{item.omschrijving}</Text>
              <Text style={styles.datum}>{new Date(item.aangemaakt_op).toLocaleDateString('nl-NL')}</Text>

              {/* Status knoppen */}
              <View style={styles.knoppen}>
                {item.status !== 'in_behandeling' && (
                  <TouchableOpacity style={styles.knopBlauw} onPress={() => updateStatus(item.id, 'in_behandeling')}>
                    <Text style={styles.knopTekst}>In behandeling</Text>
                  </TouchableOpacity>
                )}
                {item.status !== 'opgelost' && (
                  <TouchableOpacity style={styles.knopGroen} onPress={() => updateStatus(item.id, 'opgelost')}>
                    <Text style={styles.knopTekst}>Opgelost</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DEE2E6',
    backgroundColor: '#FFFFFF',
  },
  backText: {
    color: '#6C757D',
    fontSize: 15,
    width: 48,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  filterRij: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DEE2E6',
  },
  filterKnop: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  filterKnopActief: {
    backgroundColor: '#1A1A2E',
    borderColor: '#1A1A2E',
  },
  filterTekst: {
    fontSize: 12,
    color: '#6C757D',
  },
  filterTekstActief: {
    color: '#FFFFFF',
  },
  lijst: {
    padding: 16,
    gap: 12,
  },
  kaart: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    gap: 8,
  },
  kaartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorie: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusTekst: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  omschrijving: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  datum: {
    fontSize: 12,
    color: '#ADB5BD',
  },
  knoppen: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  knopBlauw: {
    backgroundColor: '#CCE5FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  knopGroen: {
    backgroundColor: '#D4EDDA',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  knopTekst: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  leeg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leegTekst: {
    color: '#6C757D',
    fontSize: 15,
  },
});
