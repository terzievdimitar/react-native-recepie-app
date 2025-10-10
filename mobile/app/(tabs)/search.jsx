import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { MealAPI } from '../../services/mealAPI';
import { useDebounce } from '../../hooks/useDebounce';
import { searchStyles } from '../../assets/styles/search.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import RecipeCard from '../../components/RecipeCard';

const SearchScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false); // For loading state during fetch
	const [initialLoading, setInitialLoading] = useState(true); // For loading when pressing on recipe that is in the search screen

	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const performSearch = async (query) => {
		// If the search query is empty, fetch random meals
		if (!query.trim()) {
			const randomMeals = await MealAPI.getRandomMeals(12);
			return randomMeals.map((meal) => MealAPI.transformMealData(meal)).filter((meal) => meal !== null);
		}

		// search by name first and then by ingredient if no results
		const nameResults = await MealAPI.searchMealsByName(query);
		let results = nameResults;

		if (results.length === 0) {
			const ingredientResults = await MealAPI.filterByIngredient(query);
			results = ingredientResults;
		}

		return results
			.slice(0, 12)
			.map((meal) => MealAPI.transformMealData(meal))
			.filter((meal) => meal !== null);
	};

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				const results = await performSearch('');
				setRecipes(results);
			} catch (error) {
				console.error('Error fetching initial data:', error);
			} finally {
				setInitialLoading(false);
			}
		};

		loadInitialData();
	}, []);

	useEffect(() => {
		if (initialLoading) return; // Skip if still loading initial data

		const handleSearch = async () => {
			setLoading(true);
			try {
				const results = await performSearch(debouncedSearchQuery);
				setRecipes(results);
			} catch (error) {
				console.error('Error fetching search results:', error);
			} finally {
				setLoading(false);
			}
		};

		handleSearch();
	}, [debouncedSearchQuery]);

	if (initialLoading) {
		return (
			<View>
				<Text>Loading some data...</Text>
			</View>
		);
	}

	return (
		<View style={searchStyles.container}>
			<View style={searchStyles.searchSection}>
				<View style={searchStyles.searchContainer}>
					<Ionicons
						name='search'
						size={20}
						color={COLORS.textLight}
						style={searchStyles.searchIcon}
					/>
					<TextInput
						placeholderTextColor={COLORS.textLight}
						placeholder='Search for recipes, ingredients...'
						value={searchQuery}
						onChangeText={setSearchQuery}
						style={searchStyles.searchInput}
						returnKeyType='search'
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity
							onPress={() => setSearchQuery('')}
							style={searchStyles.clearButton}>
							<Ionicons
								name='close-circle'
								size={20}
								color={COLORS.textLight}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>

			<View style={searchStyles.resultsSection}>
				<View style={searchStyles.resultsHeader}>
					<Text style={searchStyles.resultsTitle}>{searchQuery ? `Results for "${searchQuery}"` : 'Popular Recipes'}</Text>
					<Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
				</View>

				{loading ? (
					<View style={searchStyles.loadingContainer}>
						<Text style={searchStyles.loadingText}>Loading...</Text>
					</View>
				) : (
					<FlatList
						data={recipes}
						renderItem={({ item }) => <RecipeCard recipe={item} />}
						keyExtractor={(item) => item.id.toString()}
						numColumns={2}
						contentContainerStyle={searchStyles.recipesGrid}
						columnWrapperStyle={searchStyles.row}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={<NoResultsFound />}
					/>
				)}
			</View>
		</View>
	);
};

export default SearchScreen;

function NoResultsFound() {
	return (
		<View style={searchStyles.emptyState}>
			<Ionicons
				name='search-outline'
				size={64}
				color={COLORS.textLight}
			/>
			<Text style={searchStyles.emptyTitle}>No recipes found</Text>
			<Text style={searchStyles.emptyDescription}>Try adjusting your search or try different keywords</Text>
		</View>
	);
}
