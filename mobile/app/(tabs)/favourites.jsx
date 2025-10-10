import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { API_URL } from '../../constants/api';
import { favoritesStyles } from '../../assets/styles/favorites.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import RecipeCard from '../../components/RecipeCard';
import NoFavoritesFound from '../../components/NoFavoritesFound';
import LoadingSpinner from '../../components/LoadingSpinner';

const FavouritesScreen = () => {
	const { signOut } = useClerk();
	const { user } = useUser();
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadFavorites = async () => {
			try {
				const response = await fetch(`${API_URL}/favorites/${user?.id}`);
				if (!response.ok) {
					throw new Error('Failed to fetch favorites');
				}
				const favorites = await response.json();

				// Transform the data to match the expected structure
				const transformedFavorites = favorites.map((favorite) => ({
					...favorite,
					id: favorite.recipeId,
				}));
				setFavorites(transformedFavorites);
			} catch (error) {
				console.error('Error fetching favorites:', error);
			} finally {
				setLoading(false);
			}
		};

		loadFavorites();
	}, [user.id]);

	const handleSignOut = async () => {
		Alert.alert('Log Out', 'Are you sure you want to log out?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Log Out',
				style: 'destructive',
				onPress: signOut,
			},
		]);
	};

	if (loading) {
		return <LoadingSpinner message='Loading your favorites...' />;
	}

	return (
		<View style={favoritesStyles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={favoritesStyles.header}>
					<Text style={favoritesStyles.title}>Favorites</Text>
					<TouchableOpacity
						style={favoritesStyles.logoutButton}
						onPress={handleSignOut}>
						<Ionicons
							name='log-out-outline'
							size={22}
							color={COLORS.text}
						/>
					</TouchableOpacity>
				</View>

				<View style={favoritesStyles.recipesSection}>
					<FlatList
						data={favorites}
						renderItem={({ item }) => <RecipeCard item={item} />}
						keyExtractor={(item) => item.id.toString()}
						columnWrapperStyle={favoritesStyles.row}
						contentContainerStyle={favoritesStyles.recipesGrid}
						scrollEnabled={false}
						numColumns={2}
						ListEmptyComponent={<NoFavoritesFound />}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

export default FavouritesScreen;
