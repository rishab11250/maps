import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper functions for DB operations
async function readDb() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeDb(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
    res.send('API is running!');
});

// Favorites Endpoints
app.get('/api/favorites', async (req, res) => {
    try {
        const favorites = await readDb();
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read favorites' });
    }
});

app.post('/api/favorites', async (req, res) => {
    try {
        const { name, lat, lng, description } = req.body;
        if (!name || !lat || !lng) {
            return res.status(400).json({ error: 'Name, lat, and lng are required' });
        }

        const newFavorite = {
            id: Date.now().toString(),
            name,
            lat,
            lng,
            description: description || '',
            createdAt: new Date().toISOString()
        };

        const favorites = await readDb();
        favorites.push(newFavorite);
        await writeDb(favorites);

        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save favorite' });
    }
});

app.delete('/api/favorites/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const favorites = await readDb();
        const filteredFavorites = favorites.filter(fav => fav.id !== id);

        if (favorites.length === filteredFavorites.length) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        await writeDb(filteredFavorites);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete favorite' });
    }
});

app.get('/', (req, res) => {
    res.send('API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
