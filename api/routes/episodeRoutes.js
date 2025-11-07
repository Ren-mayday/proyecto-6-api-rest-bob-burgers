const {
  getAllEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  removeCharactersFromEpisode,
  deleteEpisode,
} = require("../controllers/episodeControllers");

const episodesRouter = require("express").Router();

// Rutas CRUD para episodios
episodesRouter.get("/", getAllEpisodes); // GET todos los episodios
episodesRouter.get("/:id", getEpisodeById); // GET un episodio por ID
episodesRouter.post("/", createEpisode); // POST crear un episodio
episodesRouter.put("/:id", updateEpisode); // PUT actualizar un episodio
episodesRouter.delete("/:id/characters", removeCharactersFromEpisode); // DELETE eliminar personajes de un episodio (sin borrarlo)
episodesRouter.delete("/:id", deleteEpisode); // DELETE eliminar un episodio

module.exports = episodesRouter;
