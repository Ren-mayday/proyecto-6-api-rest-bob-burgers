const {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  removeEpisodesFromCharacter,
  deleteCharacter,
} = require("../controllers/characterControllers");

// Crear enrutado de express (nuestro servidor)
const charactersRouter = require("express").Router();

//Declarar las  rutas que va a tener, para las solicitudes. Llama a funciones del controlador
charactersRouter.get("/", getAllCharacters); // GET todos
charactersRouter.get("/:id", getCharacterById); // GET por id
charactersRouter.post("/", createCharacter); // POST crear
charactersRouter.put("/:id", updateCharacter); // PUT actualizar
charactersRouter.delete("/:id/episodes", removeEpisodesFromCharacter); // eliminar episodios del personaje sin borrar el personaje
charactersRouter.delete("/:id", deleteCharacter); // DELETE eliminar

module.exports = charactersRouter;
