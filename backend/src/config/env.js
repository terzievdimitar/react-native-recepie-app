import 'dotenv/config';
export const ENV = {
	PORT: process.env.PORT || 5001,
	DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/myapp',
	NODE_ENV: process.env.NODE_ENV,
};
