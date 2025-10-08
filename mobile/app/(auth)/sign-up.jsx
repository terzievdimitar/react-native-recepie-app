import { View, Text, Alert, Platform, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import VerifyEmail from './verify-email';

const SignUpScreen = () => {
	const router = useRouter();
	const { signUp, isLoaded } = useSignUp();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pendingVerification, setPendingVerification] = useState(false);

	const handleSignUp = async () => {
		if (!email || !password) {
			return Alert.alert('Error', 'Email and password are required.');
		}
		if (password.length < 6) {
			return Alert.alert('Error', 'Password must be at least 6 characters long.');
		}
		if (!isLoaded) return;

		setLoading(true);
		try {
			await signUp.create({ emailAddress: email, password });

			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
			setPendingVerification(true);
		} catch (error) {
			Alert.alert('Error', 'Failed to sign up. Please try again.');
			console.error(JSON.stringify(error, null, 2));
		} finally {
			setLoading(false);
		}
	};

	if (pendingVerification) {
		return (
			<VerifyEmail
				email={email}
				onBack={() => setPendingVerification(false)}
			/>
		);
	}

	return (
		<View style={authStyles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={authStyles.keyboardView}
				KeyboardAvoidingView={Platform.OS === 'ios' ? 64 : 32}>
				<ScrollView
					contentContainerStyle={authStyles.scrollContent}
					showVerticalScrollIndicator={false}>
					<View style={authStyles.imageContainer}>
						<Image
							source={require('../../assets/images/i2.png')}
							style={authStyles.image}
							contentFit='contain'
						/>
					</View>
					<Text style={authStyles.title}>Create an account</Text>

					{/* Form Container */}
					<View style={authStyles.formContainer}>
						{/* Email Input */}
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder='Email'
								placeholderTextColor={COLORS.textLight}
								keyboardType='email-address'
								autoCapitalize='none'
								value={email}
								onChangeText={setEmail}
							/>
						</View>

						{/* Password Input */}
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder='Password'
								placeholderTextColor={COLORS.textLight}
								secureTextEntry={!showPassword}
								value={password}
								onChangeText={setPassword}
							/>
							<TouchableOpacity
								style={authStyles.eyeButton}
								onPress={() => setShowPassword(!showPassword)}>
								<Ionicons
									name={showPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color={COLORS.textLight}
								/>
							</TouchableOpacity>
						</View>
						{/* Sign Up Button */}
						<TouchableOpacity
							style={authStyles.authButton}
							onPress={handleSignUp}
							disabled={loading}
							activeOpacity={0.8}>
							<Text style={authStyles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
						</TouchableOpacity>

						{/* Navigate to Sign In */}
						<TouchableOpacity
							style={authStyles.linkContainer}
							onPress={() => router.push('/(auth)/sign-in')}>
							<Text style={authStyles.linkText}>
								Already have an account? <Text style={authStyles.link}>Sign In</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default SignUpScreen;
