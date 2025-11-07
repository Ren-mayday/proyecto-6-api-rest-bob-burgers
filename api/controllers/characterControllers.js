//! CRUD -> CREATE, READ, UPDATE, DELETE
const Character = require("../models/Character"); // me traigo mi modelo Character
const Episode = require("../models/Episode"); // modelo Episode

// GET Obtener todos los personajes
const getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find().populate("episodes", "title season episodeNumber");
    return res.status(200).json(characters);
  } catch (error) {
    return res.status(400).json({ message: "Error al obtener personajes", error: error.message });
  }
};

// GET /characters/:id
const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate("episodes", "title season episodeNumber");
    if (!character) return res.status(404).json({ message: "Character not found" });
    return res.status(200).json(character);
  } catch (error) {
    return res.status(400).json({ message: "Error al obtener personaje", error: error.message });
  }
};

//POST /character Crear personaje
const createCharacter = async (req, res) => {
  try {
    // Validación: el body debe tener al menos name y age
    const { name, age, episodes } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "El campo 'name' es obligatorio" });
    }

    if (!age || typeof age !== "number") {
      return res.status(400).json({ message: "El campo 'age' es obligatorio y debe ser un número" });
    }

    // Validar episodios (si se proporcionan)
    if (episodes && Array.isArray(episodes) && episodes.length > 0) {
      const episodesExist = await Episode.find({ _id: { $in: episodes } });
      if (episodesExist.length !== episodes.length) {
        return res.status(400).json({
          message: "Algunos episodios no existen en la base de datos",
        });
      }
    }

    const newCharacter = await Character.create(req.body);
    return res.status(201).json(newCharacter);
  } catch (error) {
    return res.status(400).json({ message: "Error al crear personaje", error: error.message });
  }
};

// PUT /character/:id Actualizar un personaje
const updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const { episodes, role, ...rest } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "El body no puede estar vacío" });
    }

    const updateData = { ...rest }; // Campos simples

    // Inicializar $addToSet si hay arrays que actualizar
    let addToSet = {};

    // Manejo de episodios
    if (episodes && Array.isArray(episodes) && episodes.length > 0) {
      // Validar que existan
      const episodesExist = await Episode.find({ _id: { $in: episodes } });
      if (episodesExist.length !== episodes.length) {
        return res.status(400).json({
          message: "Algunos episodios no existen en la base de datos",
        });
      }
      // Añadir sin duplicados
      addToSet.episodes = { $each: episodes };
    }

    // Manejo de roles
    if (role && Array.isArray(role) && role.length > 0) {
      // Normalizar los roles antes de añadir
      const rolesEnum = [
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

      const normalizedRoles = role.map((r) => {
        const lower = r.toLowerCase();
        const found = rolesEnum.find((roleEnum) => roleEnum.toLowerCase() === lower);
        return found || r;
      });

      addToSet.role = { $each: normalizedRoles };
    }

    // Añadir $addToSet si tiene contenido
    if (Object.keys(addToSet).length > 0) {
      updateData.$addToSet = addToSet;
    }

    const updatedCharacter = await Character.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCharacter) {
      return res.status(404).json({ message: "Character not found" });
    }

    return res.status(200).json(updatedCharacter);
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar personaje", error: error.message });
  }
};

// DELETE /character/:id/episodes - Eliminar episodios del personaje
const removeEpisodesFromCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const { episodes } = req.body;

    if (!Array.isArray(episodes) || episodes.length === 0) {
      return res.status(400).json({
        message: "Debes enviar un array con los episodios que deseas eliminar",
      });
    }

    // Validar que los episodios existen
    const episodesExist = await Episode.find({ _id: { $in: episodes } });
    if (episodesExist.length !== episodes.length) {
      return res.status(400).json({
        message: "Algunos episodios no existen en la base de datos",
      });
    }

    const updatedCharacter = await Character.findByIdAndUpdate(
      id,
      { $pull: { episodes: { $in: episodes } } },
      { new: true }
    );

    if (!updatedCharacter) {
      return res.status(404).json({ message: "Character not found" });
    }

    return res.status(200).json(updatedCharacter);
  } catch (error) {
    return res.status(400).json({
      message: "Error al eliminar episodios del personaje",
      error: error.message,
    });
  }
};

// DELETE /character/:id - Borrar personaje
const deleteCharacter = async (req, res) => {
  try {
    const deletedCharacter = await Character.findByIdAndDelete(req.params.id);
    if (!deletedCharacter) return res.status(404).json({ message: "Character not found" });
    res.status(200).json({ message: "Personaje eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al borrar personaje", error: error.message });
  }
};

module.exports = {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  removeEpisodesFromCharacter,
  deleteCharacter,
};
