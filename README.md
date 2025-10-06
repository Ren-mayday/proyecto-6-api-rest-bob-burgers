# proyecto-6-api-rest-bob-burgers

Mi primera API. Personajes y episodios de la serie Bob's Burgers.

Descripción
API REST para gestionar personajes y episodios de Bob's Burgers.
Construida con Node.js, Express y MongoDB Atlas usando Mongoose.
Soporta CRUD completo y relaciones entre colecciones.

Tecnologías

- Node.js / Express → servidor y rutas HTTP
- MongoDB Atlas + Mongoose → base de datos y modelos
- dotenv → variables de entorno sensibles
- nodemon → recarga automática en desarrollo

src/
├─ api/
│ ├─ controllers/ # CRUD
│ ├─ models/ # Esquemas y modelos
│ └─ routes/ # Endpoints
├─ config/ # DB y configuración
├─ middleware/ # Middlewares
├─ utils/ # Funciones auxiliares
└─ index.js # Servidor principal
.env # Variables sensibles
.gitignore # Ignora node_modules y .env
package.json # Dependencias y scripts

Configuración
Crear .env con la URL de MongoDB:
DB_URL=<tu_url_de_mongodb_atlas>
Conectar la BBDD en config/db.js y ejecutar en index.js.
También añadir puerto:
PORT=4000

const express = require("express");
const app = express();
app.use(express.json());

const charactersRouter = require("./api/routes/characterRoutes");
app.use("/api/v1/characters", charactersRouter);

const episodesRouter = require("./api/routes/episodeRoutes");
app.use("/api/v1/episodes", episodesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Servidor levantado en: http://localhost:${PORT}`);
});

Modelos y Relaciones
Character
name, age, role, description, img
episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }]

Episode
title, season, episodeNumber, description, img
characters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }]

Relación Characters ↔ Episodes
Character
└── episodes [Episode IDs]
Episode
└── characters [Character IDs]
.populate() reemplaza IDs por documentos completos o campos seleccionados.

Endpoint CRUD
Characters
| Método | Ruta | Acción |
| ------ | ---------------------- | -------------------- |
| GET | /api/v1/characters | Todos los personajes |
| GET | /api/v1/characters/:id | Personaje por ID |
| POST | /api/v1/characters | Crear personaje |
| PUT | /api/v1/characters/:id | Actualizar personaje |
| DELETE | /api/v1/characters/:id | Eliminar personaje |

Episodes
| Método | Ruta | Acción |
| ------ | -------------------- | ------------------- |
| GET | /api/v1/episodes | Todos los episodios |
| GET | /api/v1/episodes/:id | Episodio por ID |
| POST | /api/v1/episodes | Crear episodio |
| PUT | /api/v1/episodes/:id | Actualizar episodio |
| DELETE | /api/v1/episodes/:id | Eliminar episodio |

Consideraciones
Actualizaciones de arrays no borran datos existentes.
Se evita duplicidad en arrays de referencias.
La semilla inicial (seed) aún no está implementada.

Seeds
La carpeta data contiene los archivos con los arrays de objetos de ejemplo, por ejemplo: data/seedEpisodes.js.
El archivo utils/Seeds/episodes.seeds.js contiene el script que inserta estos datos en la base de datos automáticamente.
