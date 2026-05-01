import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

// Check if MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  // In production, we'll handle this more gracefully
  if (process.env.NODE_ENV === "production") {
    console.error(
      "MongoDB URI is not defined. Using fallback for build process.",
    );
  } else {
    throw new Error("Please add your MongoDB URI to .env.local");
  }
}

// Create a mock client promise for build time
const createMockClientPromise = () => {
  console.warn("Using mock MongoDB client for build process");
  return Promise.resolve({
    db: () => ({
      collection: () => ({
        findOne: () => Promise.resolve(null),
        find: () => ({
          toArray: () => Promise.resolve([]),
          sort: () => ({
            limit: () => ({ toArray: () => Promise.resolve([]) }),
          }),
          limit: () => ({ toArray: () => Promise.resolve([]) }),
        }),
        insertOne: () => Promise.resolve({ insertedId: "mock-id" }),
        insertMany: () => Promise.resolve({ insertedCount: 0 }),
        updateOne: () => Promise.resolve({ modifiedCount: 0 }),
        deleteOne: () => Promise.resolve({ deletedCount: 0 }),
      }),
    }),
    close: () => Promise.resolve(),
  } as unknown as MongoClient);
};

// Handle connection based on environment
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    if (!uri) {
      global._mongoClientPromise = createMockClientPromise();
    } else {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        return createMockClientPromise();
      });
    }
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  if (!uri) {
    clientPromise = createMockClientPromise();
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
      return createMockClientPromise();
    });
  }
}

export default clientPromise;
