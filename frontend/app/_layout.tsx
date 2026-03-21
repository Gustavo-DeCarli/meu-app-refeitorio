import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#15803d' },
        headerTintColor: '#fff'
      }}
    />
  );
}