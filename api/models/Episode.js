// Schema - Plantilla
const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    season: { type: Number, required: true },
    episodeNumber: { type: Number, required: true },
    description: { type: String, trim: true },
    // Relación entre Episodes y Characters
    characters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }],
  },
  {
    timestamps: true,
  }
);

//Modelo/Colección
const Episode = mongoose.model("Episode", episodeSchema, "episodes");
module.exports = Episode;
