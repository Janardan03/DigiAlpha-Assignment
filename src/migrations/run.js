const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {

    console.log("Connected to DB");

    const migrationsDir = path.join(__dirname);
    const files = fs.readdirSync(migrationsDir).filter(file => file.match(/^\d{3}.*\.js$/)).sort();

    const db = mongoose.connection.db;

    const collections = await db.listCollections({name: "migrations"}).toArray();

    if(collections.length === 0) {
        await db.createCollection("migrations");
    }

    for(const file of files) {

        if(file === "run.js") continue;

        const migrationName = file.replace(".js", "");
        const migrationExists = await db.collection("migrations").findOne({name: migrationName});

        if(!migrationExists) {
            
            console.log(`Running migration: ${file}`);

            const migration = require(path.join(migrationsDir, file));
            await migration.up(db);

            await db.collection("migrations").insertOne({
                name: migrationName,
                appliedAt: new Date()
            });

            console.log(`Migration ${file} completed`);
        } else {
            console.log(`Skipping migration ${file} (already applied)`);
        }
    }

    console.log('All migrations completed');
    process.exit(0);
})
.catch(err => {
    console.error('Error connecting to DB:', err);
    process.exit(1);
});