import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const TabsLayout = () => {
	const { isSignedIn } = useAuth();

	if (!isSignedIn) {
		return <Redirect href={'/(auth)/sign-in'} />;
	}
	return <Stack />;
};

export default TabsLayout;
