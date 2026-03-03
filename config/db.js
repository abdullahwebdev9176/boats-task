const dotev = require('dotenv');
const { MongoClient } = require('mongodb');
dotev.config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);
let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db();
        console.log('Connected successfully');

    } catch (error) {
        console.error('Connection failed:', error);
    }
}


function getDB() {
    if (!db) {
        throw new Error('Database not connected.');
    }
    return db;
}

module.exports = { connectDB, getDB };