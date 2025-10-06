require("dotenv").config(); //Nos traemos el módulo de dotenv y lo configuramos
const express = require("express"); // nos traemos el módulo express
const { connectDB } = require("./config/db"); // importar la función de db.js
const charactersRouter = require("./api/routes/characterRoutes");
const episodesRouter = require("./api/routes/episodeRoutes");

const app = express(); // lo ejecutamos y guardamos en la variable app

connectDB(); //! conectar con la BBDD

//! middleware, línea para configurar que mi servidor sea capaz de recoger datos en formato json
app.use(express.json());

// rutas principales
app.use("/api/v1/characters", charactersRouter);
app.use("/api/v1/episodes", episodesRouter);

// middleware, todas las rutas que no tengan respuesta entrarán por aquí
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
// utilizamos nuestro servidor para ponerlo a escuchar con el método listen,
// le tenemos que pasar un puerto en el primer parámetro y un callback con la función a ejecutar cuando se ponga a escuchar.
app.listen(PORT, () => {
  console.log(`Servidor levantado en: http://localhost:${PORT}`);
});
