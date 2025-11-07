// data/seedEpisodes.js
require("dotenv").config();
const mongoose = require("mongoose");
const Episode = require("../api/models/Episode.js");
const episodes = require("../utils/Seeds/episodes.seeds.js");

const seedEpisodes = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Conectado a MongoDB Atlas");

    // Eliminar colección previa
    await Episode.deleteMany();
    console.log("🗑️ Colección de episodios eliminada");

    // Insertar nuevos datos
    await Episode.insertMany(episodes);
    console.log("🌱 Episodios insertados correctamente");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al hacer seeding de episodios:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("📴 Desconectado de la DB");
  }
};

seedEpisodes();
