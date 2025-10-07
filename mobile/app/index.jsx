import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import reactLogo from '../assets/images/react-logo.png';

export default function Index() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>

			<Image
				source={reactLogo}
				style={{ width: 100, height: 100 }}
			/>

			<TextInput
				style={{ borderWidth: 1, padding: 10 }}
				placeholder='Type here...'
				secureTextEntry={true}
			/>

			<TouchableOpacity>
				<Text>Submit</Text>
			</TouchableOpacity>

			<Link href={'/about'}>
				<Text>Go to About</Text>
			</Link>
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
