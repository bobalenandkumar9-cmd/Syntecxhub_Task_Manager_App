require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined. Copy .env.example to .env and set it.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
