import { Stack } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';

export default function Layout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: '#15803d' },
          headerTintColor: '#fff'
        }}
      />
    </UserProvider>
  );
}