import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // ✅ ensure env is loaded here ALSO

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("❌ MONGO_URI is still missing. Check your .env file.");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;