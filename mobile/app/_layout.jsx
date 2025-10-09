import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from 'expo-router';
import SafeScreen from '../components/SafeScreen';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
	return (
		<ClerkProvider tokenCache={tokenCache}>
			<SafeScreen>
				<Slot />
				<StatusBar style='dark' />
			</SafeScreen>
		</ClerkProvider>
	);
}
