import express from 'express';
import { ENV } from './config/env.js';
import cors from 'cors';
import { db } from './config/db.js';
import { favoritesTable } from './db/schema.js';
import { and, eq } from 'drizzle-orm';
import job from './config/cron.js';

const app = express();
const PORT = ENV.PORT;

// Start the cron job
if (ENV.NODE_ENV === 'production') {
	job.start();
}

app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
	res.status(200).send({ success: true });
});

app.post('/api/favourites', async (req, res) => {
	try {
		const { userId, recipeId, title, image, cookTime, servings } = req.body;
		if (!userId || !recipeId || !title) {
			return res.status(400).send('User ID is required');
		}

		const newFavorite = await db.insert(favoritesTable).values({ userId, recipeId, title, image, cookTime, servings }).returning();
		res.status(201).json(newFavorite[0]);
	} catch (error) {
		console.log('Error adding favorite:', error);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

app.get('/api/favourites/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const favorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));
		res.status(200).json(favorites);
	} catch (error) {
		console.log('Error fetching favorites:', error);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

app.delete('/api/favourites/:userId/:recipeId', async (req, res) => {
	try {
		const { userId, recipeId } = req.params;

		await db.delete(favoritesTable).where(and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId))));

		res.status(200).json({ message: 'Favorite deleted successfully' });
	} catch (error) {
		console.log('Error deleting favorite:', error);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
