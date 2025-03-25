import { MongoClient } from "mongodb";

// Check if MongoDB URI is available
if (!process.env.MONGODB_URI) {
  // In development, show a clear error message
  if (process.env.NODE_ENV === "development") {
    console.error(
      "MongoDB URI is missing. Please add MONGODB_URI to your .env.local file"
    );
    throw new Error("Please add your MongoDB URI to .env.local");
  } else {
    // In production, log the error but don't crash the app immediately
    console.error(
      "MongoDB URI is missing. Please add MONGODB_URI to your environment variables in Vercel"
    );
  }
}

const uri = process.env.MONGODB_URI || "";
let client;
let clientPromise;

// Only create a new client if one doesn't already exist
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global;

  if (!globalWithMongo._mongoClientPromise && process.env.MONGODB_URI) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
