//! CRUD -> CREATE, READ, UPDATE, DELETE
//me traigo mi modelo Episode
const Episode = require("../models/Episode");

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
    const newEpisode = new Episode(req.body);
    const episodeSaved = await newEpisode.save();
    return res.status(201).json(episodeSaved);
  } catch (error) {
    return res.status(400).json({ message: "Error al crear episodio", error: error.message });
  }
};

// PUT actualizar episodio
const updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const episodeUpdated = await Episode.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!episodeUpdated) return res.status(404).json({ message: "Episodio no encontrado" });
    return res.status(200).json(episodeUpdated);
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar episodio", error: error.message });
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
  deleteEpisode,
};
