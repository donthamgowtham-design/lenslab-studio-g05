// database/db.js
// Member 2: Database Initialization and Connection Management

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'lenslab.db');

let dbInstance = null;

async function getDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Enable foreign key constraints in SQLite
    await dbInstance.run('PRAGMA foreign_keys = ON;');

    return dbInstance;
}

async function initDb() {
    const db = await getDatabase();
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await db.exec(schemaSql);
    return db;
}

module.exports = {
    getDatabase,
    initDb,
    dbPath
};
