import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
    try {


        mongoose.connection.on('connected', () => {
            console.log("Database connected successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("Database connection error:", err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("Database disconnected");
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'e-commerce'
        });

        console.log("Connect method completed");
    } catch (error) {
        console.error("Catch block - Error connecting to the database:", error);
    }
};

export default connectDB;