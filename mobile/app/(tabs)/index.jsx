import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
			<Link href='/(auth)/sign-in'>Go to Sign In</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		color: 'red',
		fontSize: 16,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
