import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';

export default function Index() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
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
