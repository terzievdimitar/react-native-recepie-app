import { View, Text, Alert, Platform, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { authStyles } from '../../assets/styles/auth.styles';
import { Image } from 'expo-image';

const VerifyEmail = ({ email, onBack }) => {
	const { isLoaded, signUp, setActive } = useSignUp();
	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);

	const handleVerification = async () => {
		if (!isLoaded) return;

		setLoading(true);

		try {
			const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

			if (signUpAttempt.status === 'complete') {
				await setActive({ session: signUpAttempt.createdSessionId });
			} else {
				Alert.alert('Error', 'Verification not complete. Please try again.');
				console.error(JSON.stringify(signUpAttempt, null, 2));
			}
		} catch (error) {
			Alert.alert('Error', 'An error occurred. Please try again.');
			console.error(JSON.stringify(error, null, 2));
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={authStyles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={authStyles.keyboardView}
				KeyboardAvoidingView={Platform.OS === 'ios' ? 64 : 32}>
				<ScrollView
					contentContainerStyle={authStyles.scrollContent}
					showVerticalScrollIndicator={false}>
					{/* Image Container */}
					<View>
						<Image
							source={require('../../assets/images/i3.png')}
							style={authStyles.image}
							contentFit='contain'
						/>
					</View>

					{/* Title */}
					<Text style={authStyles.title}>Verify your email</Text>
					<Text style={authStyles.subtitle}>
						We sent a verification code to{'\n'}
						<Text style={{ fontWeight: 'bold' }}>{email}</Text>
					</Text>

					{/* Form Container */}
					<View style={authStyles.formContainer}>
						{/* Verification Code Input */}
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter verification code'
								value={code}
								onChangeText={setCode}
								keyboardType='number-pad'
								autoCapitalize='none'
								autoCorrect={false}
							/>
						</View>
						{/* Verify Button */}
						<TouchableOpacity
							style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
							onPress={handleVerification}
							disabled={loading}>
							<Text style={authStyles.buttonText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
						</TouchableOpacity>

						{/* Back to Sign In */}
						<TouchableOpacity
							style={authStyles.linkContainer}
							onPress={onBack}>
							<Text style={authStyles.linkText}>
								<Text style={authStyles.link}>Back to Sign In</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default VerifyEmail;
