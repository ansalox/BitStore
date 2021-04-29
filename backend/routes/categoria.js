// importamos express
let express = require("express");
// importamos el controlador de categoria
let Categoria = require("../controllers/categoria");

// Creamos la api para controlar las rutas
let api = express.Router();

// Rutas de la API
api.post("/categoria/registrarCategoria", Categoria.registrarCategoria);
api.get("/categoria/:id", Categoria.buscarCategoria);
api.get("/categoria/:nombre?", Categoria.listaCategoria);
api.post("/categoria/:nombre?", Categoria.listaCategoria);
api.put("/categoria/editarCategoria/:id", Categoria.editarCategoria);
api.delete("/categoria/eliminarCategoria/:id", Categoria.eliminarCategoria);
// Exportamos el modulo
module.exports = api;
