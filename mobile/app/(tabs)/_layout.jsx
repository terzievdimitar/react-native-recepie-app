import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const TabsLayout = () => {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return null;
	}

	if (!isSignedIn) {
		return <Redirect href={'/(auth)/sign-in'} />;
	}
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.textLight,
				tabBarStyle: {
					backgroundColor: COLORS.white,
					borderTopColor: COLORS.border,
					borderTopWidth: 1,
					paddingBottom: 24,
					paddingTop: 8,
					height: 110,
				},
				tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Recipes',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='restaurant'
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='search'
				options={{
					title: 'Search',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='search'
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='favourites'
				options={{
					title: 'Favourites',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='heart'
							color={color}
							size={size}
						/>
					),
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
