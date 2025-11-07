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
  "Singer",
  "Unemployed",
  "Other",
];

// 1. Defino el Schema
const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    role: {
      type: [String],
      enum: roles,
      required: true,
      default: ["Other"],
      set: (values) => {
        if (Array.isArray(values))
          return values.map((v) => {
            // primera letra mayúscula, resto minúscula
            const lower = v.toLowerCase();
            const found = roles.find((r) => r.toLowerCase() === lower);
            return found || v; // usa la versión oficial del enum si existe
          });
        return ["Other"]; // Por seguridad si no es array
      },
    },
    description: { type: String, trim: true },
    img: {
      type: String,
      validate: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: (props) => `${props.value} no es una URL válida de imagen`,
    },
    // Relación entre Character y Episodes
    episodes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
      set: (values) => {
        // Si no es un array (por ejemplo, un solo ObjectId), conviértelo en array
        const array = Array.isArray(values) ? values : [values];

        // Eliminar ducplicados (convertimos los IDs a string para comparar)
        const uniqueIds = [...new Set(array.map((v) => v.toString()))];

        return uniqueIds;
      },
    },
  },
  {
    timestamps: true,
  }
);

// 2. Creo el modelo a partir del Schema
const Character = mongoose.model("Character", characterSchema, "characters");
module.exports = Character;
