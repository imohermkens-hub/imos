import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';

export default function ChatScreen({ navigation }: any) {
  const [bericht, setBericht] = useState('');
  const [berichten, setBerichten] = useState([
    { id: '1', tekst: 'Hallo! Hoe kan ik je helpen?', van: 'beheerder' },
  ]);

  function handleVersturen() {
    if (!bericht.trim()) return;
    setBerichten((prev) => [
      ...prev,
      { id: Date.now().toString(), tekst: bericht.trim(), van: 'huurder' },
    ]);
    setBericht('');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Terug</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Berichten</Text>
          <View style={{ width: 48 }} />
        </View>

        {/* Berichten */}
        <FlatList
          data={berichten}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.berichtenLijst}
          renderItem={({ item }) => (
            <View style={[styles.berichtBubble, item.van === 'huurder' ? styles.huurderBubble : styles.beheerderBubble]}>
              <Text style={[styles.berichtTekst, item.van === 'huurder' ? styles.huurderTekst : styles.beheerderTekst]}>
                {item.tekst}
              </Text>
            </View>
          )}
        />

        {/* Invoer */}
        <View style={styles.invoerRij}>
          <TextInput
            style={styles.invoer}
            placeholder="Typ een bericht..."
            placeholderTextColor="#ADB5BD"
            value={bericht}
            onChangeText={setBericht}
            multiline
          />
          <TouchableOpacity style={styles.verstuurKnop} onPress={handleVersturen}>
            <Text style={styles.verstuurKnopText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  flex: {
    flex: 1,
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
  berichtenLijst: {
    padding: 16,
    gap: 10,
  },
  berichtBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  huurderBubble: {
    backgroundColor: '#1A1A2E',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  beheerderBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  berichtTekst: {
    fontSize: 15,
    lineHeight: 20,
  },
  huurderTekst: {
    color: '#FFFFFF',
  },
  beheerderTekst: {
    color: '#1A1A2E',
  },
  invoerRij: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  invoer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1A1A2E',
    maxHeight: 100,
  },
  verstuurKnop: {
    backgroundColor: '#1A1A2E',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verstuurKnopText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
