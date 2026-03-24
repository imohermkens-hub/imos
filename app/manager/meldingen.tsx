import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  SafeAreaView, ActivityIndicator, TextInput, RefreshControl,
} from 'react-native';
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

const CATEGORIE_ICONEN: Record<string, string> = {
  'Lekkage': '💧', 'Glasbreuk': '🪟', 'Deuren/ramen/kozijnen': '🚪',
  'Stukadoor & tegels': '🧱', 'Schilderwerk': '🖌️', 'CV/warmtepomp': '🔥',
  'Ventilatie': '💨', 'Elektra': '⚡', 'Intercom/videofoon/bel': '🔔',
  'Verstopping': '🚿', 'Brandmeldinstallatie': '🚨', 'Zonnepanelen': '☀️',
  'Keuken & apparatuur': '🍳', 'Sanitair': '🚽', 'Vloeren': '🪵',
  'Zonwering': '🪟', 'Sleutels': '🔑', 'Lift': '🛗', 'Laadpalen': '🔌',
  'Ongedierte': '🐀', 'Huismeester': '👷',
};

const FILTERS = ['Alle', 'open', 'in_behandeling', 'opgelost'];

export default function ManagerMeldingenScreen({ navigation }: any) {
  const [meldingen, setMeldingen] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('Alle');
  const [uitgeklapt, setUitgeklapt] = useState<string | null>(null);
  const [notities, setNotities] = useState<Record<string, string>>({});
  const [opgeslagen, setOpgeslagen] = useState<string | null>(null);

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

  async function onRefresh() {
    setRefreshing(true);
    const { data } = await supabase
      .from('meldingen')
      .select('*')
      .order('aangemaakt_op', { ascending: false });
    setMeldingen(data ?? []);
    setRefreshing(false);
  }

  async function updateStatus(id: string, nieuweStatus: string) {
    await supabase.from('meldingen').update({ status: nieuweStatus }).eq('id', id);
    setMeldingen((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nieuweStatus } : m))
    );
  }

  async function slaNotitieOp(id: string) {
    await supabase.from('meldingen').update({ notitie: notities[id] ?? '' }).eq('id', id);
    setOpgeslagen(id);
    setTimeout(() => setOpgeslagen(null), 2000);
  }

  function toggleUitklap(id: string) {
    setUitgeklapt((prev) => (prev === id ? null : id));
  }

  function aantalVoorStatus(status: string) {
    if (status === 'Alle') return meldingen.length;
    return meldingen.filter((m) => m.status === status).length;
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

      {/* Filters met tellers */}
      <View style={styles.filterRij}>
        {FILTERS.map((f) => {
          const aantal = aantalVoorStatus(f);
          const actief = filter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterKnop, actief && styles.filterKnopActief]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterTekst, actief && styles.filterTekstActief]}>
                {STATUS_LABELS[f] ?? f}
              </Text>
              <View style={[styles.filterTeller, actief && styles.filterTellerActief]}>
                <Text style={[styles.filterTellerTekst, actief && styles.filterTellerTekstActief]}>
                  {aantal}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#1A1A2E" />
      ) : gefilterd.length === 0 ? (
        <View style={styles.leeg}>
          <Text style={styles.leegEmoji}>📭</Text>
          <Text style={styles.leegTekst}>Geen meldingen gevonden.</Text>
        </View>
      ) : (
        <FlatList
          data={gefilterd}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lijst}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => {
            const isOpen = uitgeklapt === item.id;
            const icon = CATEGORIE_ICONEN[item.categorie] ?? '📋';
            const datum = new Date(item.aangemaakt_op);

            return (
              <TouchableOpacity
                style={[styles.kaart, isOpen && styles.kaartOpen]}
                onPress={() => toggleUitklap(item.id)}
                activeOpacity={0.85}
              >
                {/* Kaart header */}
                <View style={styles.kaartHeader}>
                  <View style={styles.kaartLinks}>
                    <Text style={styles.categorieIcon}>{icon}</Text>
                    <View>
                      <Text style={styles.categorie}>{item.categorie}</Text>
                      <Text style={styles.datum}>
                        {datum.toLocaleDateString('nl-NL')} · {datum.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.kaartRechts}>
                    <View style={[styles.statusBadge, { backgroundColor: STATUS_KLEUREN[item.status] ?? '#F8F9FA' }]}>
                      <Text style={styles.statusTekst}>{STATUS_LABELS[item.status] ?? item.status}</Text>
                    </View>
                    <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
                  </View>
                </View>

                {/* Omschrijving preview */}
                <Text style={styles.omschrijving} numberOfLines={isOpen ? undefined : 2}>
                  {item.omschrijving}
                </Text>

                {/* Uitklapbaar detail */}
                {isOpen && (
                  <View style={styles.detail}>
                    <View style={styles.divider} />

                    {/* Status knoppen */}
                    <Text style={styles.detailLabel}>Status wijzigen</Text>
                    <View style={styles.statusKnoppen}>
                      {['open', 'in_behandeling', 'opgelost'].map((s) => (
                        <TouchableOpacity
                          key={s}
                          style={[
                            styles.statusKnop,
                            { backgroundColor: STATUS_KLEUREN[s] },
                            item.status === s && styles.statusKnopActief,
                          ]}
                          onPress={() => updateStatus(item.id, s)}
                        >
                          <Text style={[styles.statusKnopTekst, item.status === s && styles.statusKnopTekstActief]}>
                            {STATUS_LABELS[s]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Notitie beheerder */}
                    <Text style={styles.detailLabel}>Interne notitie</Text>
                    <TextInput
                      style={styles.notitieInput}
                      placeholder="Voeg een notitie toe..."
                      placeholderTextColor="#ADB5BD"
                      value={notities[item.id] ?? item.notitie ?? ''}
                      onChangeText={(t) => setNotities((prev) => ({ ...prev, [item.id]: t }))}
                      multiline
                      textAlignVertical="top"
                    />
                    <TouchableOpacity
                      style={styles.notitieKnop}
                      onPress={() => slaNotitieOp(item.id)}
                    >
                      <Text style={styles.notitieKnopTekst}>
                        {opgeslagen === item.id ? '✓ Opgeslagen' : 'Notitie opslaan'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
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
  filterTeller: {
    backgroundColor: '#DEE2E6',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  filterTellerActief: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterTellerTekst: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6C757D',
  },
  filterTellerTekstActief: {
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
  kaartOpen: {
    borderColor: '#1A1A2E',
  },
  kaartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  kaartLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  categorieIcon: {
    fontSize: 24,
  },
  kaartRechts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categorie: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  datum: {
    fontSize: 11,
    color: '#ADB5BD',
    marginTop: 2,
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
  chevron: {
    fontSize: 10,
    color: '#ADB5BD',
  },
  omschrijving: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  detail: {
    gap: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#DEE2E6',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C757D',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statusKnoppen: {
    flexDirection: 'row',
    gap: 8,
  },
  statusKnop: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusKnopActief: {
    borderColor: '#1A1A2E',
  },
  statusKnopTekst: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  statusKnopTekstActief: {
    fontWeight: '800',
  },
  notitieInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#1A1A2E',
    minHeight: 80,
  },
  notitieKnop: {
    backgroundColor: '#1A1A2E',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  notitieKnopTekst: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  leeg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  leegEmoji: {
    fontSize: 40,
  },
  leegTekst: {
    color: '#6C757D',
    fontSize: 15,
  },
});
