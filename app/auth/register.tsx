import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { supabase } from '../../services/supabase';

export default function RegisterScreen({ navigation, route }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const role = route?.params?.role ?? 'tenant';

  async function handleRegister() {
    if (!email || !password) {
      setError('Vul je e-mailadres en wachtwoord in.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (authError) {
      setError('Registreren mislukt. Probeer een ander e-mailadres.');
      return;
    }
    if (role === 'manager') {
      navigation.replace('ManagerDashboard');
    } else {
      navigation.replace('TenantHome');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>Imo's</Text>
        <Text style={styles.subtitle}>Account aanmaken</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mailadres</Text>
          <TextInput
            style={styles.input}
            placeholder="jouw@email.nl"
            placeholderTextColor="#ADB5BD"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Wachtwoord</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#ADB5BD"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={[styles.registerButton, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.registerButtonText}>Registreren</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
          <Text style={styles.loginLinkText}>Al een account? <Text style={styles.loginLinkBold}>Inloggen</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  subtitle: {
    fontSize: 18,
    color: '#6C757D',
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1A1A2E',
  },
  registerButton: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorText: {
    color: '#DC3545',
    fontSize: 14,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#6C757D',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#1A1A2E',
    fontWeight: '600',
  },
});
