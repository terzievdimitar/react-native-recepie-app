import express from 'express';
import { ENV } from './config/env.js';
import cors from 'cors';
import { db } from './config/db.js';
import { favoritesTable } from './db/schema.js';

const app = express();
const PORT = ENV.PORT;

app.use(express.json());
app.use(cors());

app.get('/api/hello', (req, res) => {
	res.send('Hello World!');
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

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
