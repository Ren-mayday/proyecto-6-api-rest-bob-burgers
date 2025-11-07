require("dotenv").config();
const mongoose = require("mongoose");
const Character = require("../api/models/Character.js"); // Modelo de Mongoose
const characters = require("../utils/Seeds/characters.seeds.js");

const seedCharacters = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Conectado a la DB ✅");

    const allCharacters = await Character.find();

    if (allCharacters.length) {
      await Character.collection.drop();
      console.log("Colección de personajes eliminada 🗑️");
    }

    await Character.insertMany(characters);
    console.log("Personajes insertados correctamente 🌱");
  } catch (error) {
    console.error("❌ Error en el proceso de seed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado de la DB 📴");
  }
};

seedCharacters();
