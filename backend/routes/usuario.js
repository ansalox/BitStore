// Variable express
let express = require("express");
// Importamos el controlador de usaurio
let Usuario = require("../controllers/usuario");

// Creamos la api
let api = express.Router();

// Servicio POST (registrar)   http://localhost:3001/api/registrarUsuario
api.post("/registrarUsuario", Usuario.registrarUsuario);
api.post("/login", Usuario.login);
api.get("/usuario", Usuario.listarUsuario);
api.put("/usuario/editarUsuario/:id", Usuario.editarUsuario);
api.get("/usuario/:id", Usuario.obtenerUsuario);
api.delete("/usuario/eliminarUsuario/:id", Usuario.eliminarUsuario);

// Exportamos el modulo
module.exports = api;
