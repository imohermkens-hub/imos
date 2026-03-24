import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../services/supabase';

export default function ManagerDashboardScreen({ navigation }: any) {
  async function handleLogout() {
    await supabase.auth.signOut();
    navigation.replace('Home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welkom, beheerder</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Uitloggen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1A1A2E',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#1A1A2E',
    fontSize: 16,
    fontWeight: '600',
  },
});
