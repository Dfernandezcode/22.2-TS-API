// Cargamos variables de entorno
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config() // loads the .env file.

const DB_CONNECTION = process.env.DB_URL as string; // pass to string
const DB_NAME = process.env.DB_NAME as string;


// Configuración de la conexión
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: DB_NAME,
};

const connect = async (): Promise<mongoose.Mongoose | null> => {
  try {
  const database: typeof mongoose = await mongoose.connect(DB_CONNECTION, config);
  const name = database.connection.name;
  const host = database.connection.host;
  console.log(`Conectado a la base de datos ${name} en el host ${host}`);
  return database;
} catch (error) {
  console.error(error)
  console.log("Error in the conection, trying to connect in 5s...");
  setTimeout(connect, 5000);
  return null
  }
}

module.exports = { connect };
