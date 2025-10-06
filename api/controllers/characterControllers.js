//! CRUD -> CREATE, READ, UPDATE, DELETE
const Character = require("../models/Character"); // me traigo mi modelo Character

// GET Obtener todos los personajes
const getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find().populate("episodes", "title season episodeNumber");
    res.status(200).json(characters);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener personajes", error: error.message });
  }
};

// GET /characters/:id
const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate("episodes", "title season episodeNumber");
    if (!character) return res.status(404).json({ message: "Character not found" });
    res.status(200).json(character);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener personaje", error: error.message });
  }
};

//POST /character Crear personaje
const createCharacter = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "El campo 'name' es obligatorio" });
    }
    const newCharacter = await Character.create(req.body);
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(400).json({ message: "Error al crear personaje", error: error.message });
  }
};

// PUT /character/:id Actualizar un personaje
const updateCharacter = async (req, res) => {
  try {
    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // devuelve el documento actualizado
    );
    if (!updatedCharacter) return res.status(404).json({ message: "Character not found" });
    res.status(200).json(updatedCharacter);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar personaje", error: error.message });
  }
};

// DELETE /character/:id Borrar personaje
const deleteCharacter = async (req, res) => {
  try {
    const deletedCharacter = await Character.findByIdAndDelete(req.params.id);
    if (!deletedCharacter) return res.status(404).json({ message: "Character not found" });
    res.status(200).json({ message: "Character deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error al borrar personaje", error: error.message });
  }
};

module.exports = {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
