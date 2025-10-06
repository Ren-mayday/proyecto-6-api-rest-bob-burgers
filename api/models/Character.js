// Schema, plantilla
const mongoose = require("mongoose");

const roles = [
  "Belcher family",
  "Father",
  "Mother",
  "Sister",
  "Brother",
  "Belcher's Family Friend",
  "Chef",
  "Owner of a Restaurant",
  "Landlord",
  "Archenemy",
  "Teacher",
  "Neighbor",
  "Handyman",
  "Customer",
  "Funeral Director",
  "Unemployed",
  "Other",
];

// 1. Defino el Schema
const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number },
    role: { type: [String], enum: roles, default: ["Other"] },
    description: { type: String, trim: true },
    img: {
      type: String,
      validate: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: (props) => `${props.value} no es una URL válida de imagen`,
    },
    // Relación entre Character y Episodes
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
  },
  {
    timestamps: true,
  }
);

// 2. Creo el modelo a partir del Schema
const Character = mongoose.model("Character", characterSchema, "characters");
module.exports = Character;
