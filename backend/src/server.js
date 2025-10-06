import express from 'express';
import { ENV } from './config/env.js';
import cors from 'cors';

const app = express();
const PORT = ENV.PORT;

app.use(cors());

app.get('/api/hello', (req, res) => {
	res.send('Hello World!');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
