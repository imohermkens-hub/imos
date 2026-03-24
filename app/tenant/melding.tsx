import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { supabase } from '../../services/supabase';

const CATEGORIEEN = ['Loodgieterij', 'Elektra', 'Verwarming', 'Inbraak/veiligheid', 'Overig'];

export default function MeldingScreen({ navigation }: any) {
  const [categorie, setCategorie] = useState('');
  const [omschrijving, setOmschrijving] = useState('');
  const [loading, setLoading] = useState(false);
  const [verzonden, setVerzonden] = useState(false);
  const [error, setError] = useState('');

  async function handleVerzenden() {
    if (!categorie || !omschrijving) {
      setError('Kies een categorie en vul een omschrijving in.');
      return;
    }
    setError('');
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: dbError } = await supabase.from('meldingen').insert({
      user_id: user?.id,
      categorie,
      omschrijving,
      status: 'open',
    });
    setLoading(false);
    if (dbError) {
      setError('Verzenden mislukt. Probeer het opnieuw.');
      return;
    }
    setVerzonden(true);
  }

  if (verzonden) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Melding ingediend!</Text>
          <Text style={styles.successText}>Je melding is ontvangen. De beheerder neemt zo snel mogelijk contact met je op.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Terug naar overzicht</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>← Terug</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Melding indienen</Text>
        <Text style={styles.subtitle}>Beschrijf het probleem zo duidelijk mogelijk.</Text>

        <Text style={styles.label}>Categorie</Text>
        <View style={styles.categorieenGrid}>
          {CATEGORIEEN.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categorieKnop, categorie === cat && styles.categorieKnopActief]}
              onPress={() => setCategorie(cat)}
            >
              <Text style={[styles.categorieKnopText, categorie === cat && styles.categorieKnopTextActief]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Omschrijving</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Wat is er aan de hand?"
          placeholderTextColor="#ADB5BD"
          value={omschrijving}
          onChangeText={setOmschrijving}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={[styles.verzendKnop, loading && styles.verzendKnopDisabled]} onPress={handleVerzenden} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.verzendKnopText}>Melding versturen</Text>}
        </TouchableOpacity>
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
  backLink: {
    marginBottom: 20,
  },
  backLinkText: {
    color: '#6C757D',
    fontSize: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 10,
  },
  categorieenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categorieKnop: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  categorieKnopActief: {
    backgroundColor: '#1A1A2E',
    borderColor: '#1A1A2E',
  },
  categorieKnopText: {
    fontSize: 13,
    color: '#1A1A2E',
  },
  categorieKnopTextActief: {
    color: '#FFFFFF',
  },
  textarea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1A1A2E',
    minHeight: 120,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC3545',
    fontSize: 14,
    marginBottom: 12,
  },
  verzendKnop: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  verzendKnopDisabled: {
    opacity: 0.7,
  },
  verzendKnopText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  successIcon: {
    fontSize: 56,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  successText: {
    fontSize: 15,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
