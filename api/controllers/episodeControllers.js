//! CRUD -> CREATE, READ, UPDATE, DELETE
//me traigo mi modelo Episode
const Episode = require("../models/Episode");
const Character = require("../models/Character"); // Importar para validar IDs

// GET todos los episodios
const getAllEpisodes = async (req, res) => {
  try {
    const episodes = await Episode.find().populate("characters", "name role");
    return res.status(200).json(episodes);
  } catch (error) {
    return res.status(400).json({ message: "Error al obtener episodios", error: error.message });
  }
};

// GET un episodio por ID
const getEpisodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const episode = await Episode.findById(id).populate("characters", "name role");
    if (!episode) return res.status(404).json({ message: "Episodio no encontrado" });
    return res.status(200).json(episode);
  } catch (error) {
    return res.status(400).json({ message: "Error al obtener episodio", error: error.message });
  }
};

// POST nuevo episodio
const createEpisode = async (req, res) => {
  try {
    const { title, season, episodeNumber, duration, characters } = req.body;

    // Validaciones básicas
    if (!title || !season || !episodeNumber || !duration) {
      return res.status(400).json({
        message: "Faltan campos obligatorios: title, season, episodeNumber o duration",
      });
    }

    // Validar que los personajes existen
    if (characters && Array.isArray(characters) && characters.length > 0) {
      const existingCharacters = await Character.find({ _id: { $in: characters } });
      if (existingCharacters.length !== characters.length) {
        return res.status(400).json({ message: "Algunos personajes no existen en la base de datos" });
      }
    }

    const newEpisode = new Episode.create(req.body);
    return res.status(201).json(newEpisode);
  } catch (error) {
    return res.status(400).json({ message: "Error al crear episodio", error: error.message });
  }
};

// PUT actualizar episodio
const updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    // separo el array del resto de campos
    const { characters, ...rest } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "El body no puede estar vacío" });
    }

    //Base de actualización
    const updateData = { ...rest };

    // Si se envían personajes, agregarlos sin duplicados
    if (characters && Array.isArray(characters) && characters.length > 0) {
      const existingCharacters = await Character.find({ _id: { $in: characters } });
      if (existingCharacters.length !== characters.length) {
        return res.status(400).json({ message: "Algunos personajes no existen en la de datos" });
      }

      updateData.$addToSet = { characters: { $each: characters } };
    }

    const updatedEpisode = await Episode.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEpisode) {
      return res.status(404).json({ message: "Episodio no encontrado" });
    }

    return res.status(200).json(updatedEpisode);
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar episodio", error: error.message });
  }
};

// DELETE /episodio/:id/characters - eliminar personajes del episodio
const removeCharactersFromEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const { characters } = req.body; // array de IDs a eliminar

    if (!Array.isArray(characters) || characters.length === 0) {
      return res.status(400).json({ message: "Debes enviar un array de personajes a eliminar" });
    }

    const updatedEpisode = await Episode.findByIdAndUpdate(
      id,
      { $pull: { characters: { $in: characters } } },
      { new: true }
    );

    if (!updatedEpisode) {
      return res.status(404).json({ message: "Episodio no encontrado" });
    }

    return res.status(200).json(updatedEpisode);
  } catch (error) {
    return res.status(400).json({
      message: "Error al eliminar personajes del episodio",
      error: error.message,
    });
  }
};

// DELETE episodio
const deleteEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const episodeDeleted = await Episode.findByIdAndDelete(id);
    if (!episodeDeleted) return res.status(404).json({ message: "Episodio no encontrado" });
    return res.status(200).json({ message: "Episodio eliminado", element: episodeDeleted });
  } catch (error) {
    return res.status(400).json({ message: "Error al eliminar episodio", error: error.message });
  }
};

module.exports = {
  getAllEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  removeCharactersFromEpisode,
  deleteEpisode,
};
