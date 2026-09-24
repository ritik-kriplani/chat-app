import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("MONGODB CONNECTED:", conn.connection.host);

    // Auto-cleanup legacy unique index `username_1` if present in MongoDB collection
    try {
      const usersCollection = conn.connection.db.collection("users");
      const indexes = await usersCollection.indexes();
      if (indexes.some((idx) => idx.name === "username_1")) {
        await usersCollection.dropIndex("username_1");
        console.log("Successfully dropped legacy index: username_1");
      }
    } catch (idxErr) {
      // Ignore if collection doesn't exist yet or index already dropped
    }
  } catch (error) {
    console.error("Error connection to MONGODB:", error);
    process.exit(1); // 1 status code means fail, 0 means success
  }
};
