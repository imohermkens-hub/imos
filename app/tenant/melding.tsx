import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, ActivityIndicator, Image, Alert,
} from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../services/supabase';

const GROEPEN = [
  {
    titel: 'Onderhoud & Reparaties',
    items: [
      { label: 'Lekkage', icon: '💧' },
      { label: 'Glasbreuk', icon: '🪟' },
      { label: 'Deuren/ramen/kozijnen', icon: '🚪' },
      { label: 'Stukadoor & tegels', icon: '🧱' },
      { label: 'Schilderwerk', icon: '🖌️' },
    ],
  },
  {
    titel: 'Installaties',
    items: [
      { label: 'CV/warmtepomp', icon: '🔥' },
      { label: 'Ventilatie', icon: '💨' },
      { label: 'Elektra', icon: '⚡' },
      { label: 'Intercom/videofoon/bel', icon: '🔔' },
      { label: 'Verstopping', icon: '🚿' },
      { label: 'Brandmeldinstallatie', icon: '🚨' },
      { label: 'Zonnepanelen', icon: '☀️' },
    ],
  },
  {
    titel: 'Woning & Inrichting',
    items: [
      { label: 'Keuken & apparatuur', icon: '🍳' },
      { label: 'Sanitair', icon: '🚽' },
      { label: 'Vloeren', icon: '🪵' },
      { label: 'Zonwering', icon: '🪟' },
    ],
  },
  {
    titel: 'Overig',
    items: [
      { label: 'Sleutels', icon: '🔑' },
      { label: 'Lift', icon: '🛗' },
      { label: 'Laadpalen', icon: '🔌' },
      { label: 'Ongedierte', icon: '🐀' },
      { label: 'Huismeester', icon: '👷' },
    ],
  },
];

export default function MeldingScreen({ navigation }: any) {
  const [categorie, setCategorie] = useState('');
  const [omschrijving, setOmschrijving] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [verzonden, setVerzonden] = useState(false);
  const [error, setError] = useState('');

  async function handleFotoToevoegen() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Geen toegang', 'Geef de app toegang tot je fotobibliotheek.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const nieuweUris = result.assets.map((a) => a.uri);
      setFotos((prev) => [...prev, ...nieuweUris].slice(0, 5));
    }
  }

  function handleFotoVerwijderen(uri: string) {
    setFotos((prev) => prev.filter((f) => f !== uri));
  }

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
          <Text style={styles.successText}>
            Je melding is ontvangen. De beheerder neemt zo snel mogelijk contact met je op.
          </Text>
          <TouchableOpacity style={styles.verzendKnop} onPress={() => navigation.goBack()}>
            <Text style={styles.verzendKnopText}>Terug naar overzicht</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>← Terug</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Melding indienen</Text>
        <Text style={styles.subtitle}>Beschrijf het probleem zo duidelijk mogelijk.</Text>

        {/* Categorie groepen */}
        <Text style={styles.label}>Categorie</Text>
        {GROEPEN.map((groep) => (
          <View key={groep.titel} style={styles.groep}>
            <Text style={styles.groepTitel}>{groep.titel}</Text>
            <View style={styles.itemsGrid}>
              {groep.items.map((item) => {
                const actief = categorie === item.label;
                return (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.itemKnop, actief && styles.itemKnopActief]}
                    onPress={() => setCategorie(item.label)}
                  >
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <Text style={[styles.itemLabel, actief && styles.itemLabelActief]} numberOfLines={2}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Omschrijving */}
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

        {/* Foto's */}
        <Text style={styles.label}>Foto's toevoegen <Text style={styles.optioneel}>(optioneel, max. 5)</Text></Text>
        <View style={styles.fotosRij}>
          {fotos.map((uri) => (
            <TouchableOpacity key={uri} onPress={() => handleFotoVerwijderen(uri)}>
              <Image source={{ uri }} style={styles.fotoPreview} />
              <View style={styles.fotoVerwijder}>
                <Text style={styles.fotoVerwijderText}>✕</Text>
              </View>
            </TouchableOpacity>
          ))}
          {fotos.length < 5 && (
            <TouchableOpacity style={styles.fotoToevoegKnop} onPress={handleFotoToevoegen}>
              <Text style={styles.fotoToevoegIcon}>📷</Text>
              <Text style={styles.fotoToevoegText}>Foto</Text>
            </TouchableOpacity>
          )}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.verzendKnop, loading && styles.verzendKnopDisabled]}
          onPress={handleVerzenden}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.verzendKnopText}>Melding versturen</Text>
          }
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
    paddingBottom: 48,
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
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  optioneel: {
    fontWeight: '400',
    color: '#ADB5BD',
    fontSize: 13,
  },
  groep: {
    marginBottom: 24,
  },
  groepTitel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemKnop: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    width: '30%',
    minHeight: 72,
    justifyContent: 'center',
    gap: 4,
  },
  itemKnopActief: {
    backgroundColor: '#1A1A2E',
    borderColor: '#1A1A2E',
  },
  itemIcon: {
    fontSize: 22,
  },
  itemLabel: {
    fontSize: 11,
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 14,
  },
  itemLabelActief: {
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
    marginBottom: 24,
  },
  fotosRij: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  fotoPreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  fotoVerwijder: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoVerwijderText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fotoToevoegKnop: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  fotoToevoegIcon: {
    fontSize: 22,
  },
  fotoToevoegText: {
    fontSize: 11,
    color: '#6C757D',
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
});
