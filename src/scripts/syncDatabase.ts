// Dynamic import all models
import { readdirSync } from 'fs';
import { join } from 'path';
import sequelize from '../database';

const models = readdirSync(join(__dirname, '../models'))

console.log(`Found ${models.length} models`)

// Load all models
models.forEach(model => {
    import(join(__dirname, '../models', model.replace('.ts', '')))
});

// Sync all models
sequelize.sync();
