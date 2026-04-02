import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from the environment");
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected");
  } catch (error) {
    const message = error?.message || "Unknown MongoDB connection error";
    if (
      message.includes("IP that isn't whitelisted") ||
      message.includes("IP address is not allowed")
    ) {
      throw new Error(
        "MongoDB Atlas rejected the connection because this IP is not whitelisted. Add this machine's public IP to your Atlas access list, then try again."
      );
    }

    throw new Error(`MongoDB connection failed: ${message}`);
  }
}
