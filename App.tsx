import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './app/auth/login';
import RegisterScreen from './app/auth/register';
import ForgotPasswordScreen from './app/auth/forgot-password';
import TenantHomeScreen from './app/tenant/home';
import ManagerDashboardScreen from './app/manager/dashboard';

const Stack = createStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Imo's</Text>
        <Text style={styles.tagline}>Jouw slimme vastgoedbeheer app</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate('Login', { role: 'tenant' })}
        >
          <Text style={styles.buttonPrimaryText}>Inloggen als huurder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('Login', { role: 'manager' })}
        >
          <Text style={styles.buttonSecondaryText}>Inloggen als beheerder</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="TenantHome" component={TenantHomeScreen} />
        <Stack.Screen name="ManagerDashboard" component={ManagerDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  tagline: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 8,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  buttonPrimary: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  buttonSecondaryText: {
    color: '#1A1A2E',
    fontSize: 16,
    fontWeight: '600',
  },
});