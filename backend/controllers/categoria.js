// Importamos el modelo categoria
let Categoria = require("../models/categoria");

// Registramos categoria POST
const registrarCategoria = (req, res) => {
  // obtenemos los datos del JSON
  let params = req.body;
  // Creamos nueva instancia de categoria
  let categoria = new Categoria();
  // guardamos los datos del req en la coleccion
  categoria.nombre = params.nombre;
  categoria.descripcion = params.descripcion;
  // save - guardamos la info en mongoDB
  categoria.save((err, saveCategoria) => {
    // si llega un error desde el servidor de mongo
    if (err) {
      res.status(500).send({ mensaje: "Error al conectar al servidor" });
    } else {
      if (saveCategoria) {
        res.status(200).send({ categoria: saveCategoria });
      } else {
        res.status(401).send({ mensaje: "No se pudo registrar la categoria" });
      }
    }
  });
};

// Buscar categorias
const buscarCategoria = (req, res) => {
  // obtenemos el id de la categoria
  let id = req.params["id"];
  // buscamos la categoria por el ID
  Categoria.findById({ _id: id }, (err, datosCategoria) => {
    // si hay error al conectar con mongo
    if (err) {
      res.status(500).send({ mensaje: "Error al conectar al servidor" });
    } else {
      if (datosCategoria) {
        res.status(200).send({ categoria: datosCategoria });
      } else {
        res.status(401).send({ mensaje: "La categoria no existe" });
      }
    }
  });
};

// Listar categorias con o sin filtro
const listaCategoria = (req, res) => {
  // si tenemos filtro nombre lo guardamos
  let nombre = req.params["nombre"];
  // Busqueda de las categorias
  Categoria.find({ nombre: new RegExp(nombre, "i") }, (err, datosCategoria) => {
    // si hay error al conectar con mongo
    if (err) {
      res.status(500).send({ mensaje: "Error al conectar al servidor" });
    } else {
      if (datosCategoria) {
        res.status(200).send({ categoria: datosCategoria });
      } else {
        res.status(401).send({ mensaje: "No hay categorias" });
      }
    }
  });
};

// Editar categoria.
const editarCategoria = (req, res) => {
  // obtenemos el id de la categoria
  let id = req.params["id"];
  // Obtenemos los datos que llegan de la API
  let params = req.body;
  // buscar la categoria por ID, y editarla
  Categoria.findByIdAndUpdate(
    { _id: id },
    { nombre: params.nombre, descripcion: params.descripcion },
    (err, datosCategoria) => {
      if (err) {
        res.status(500).send({ mensaje: "Error al conectar al servidor" });
      } else {
        if (datosCategoria) {
          res.status(200).send({ categoria: datosCategoria });
        } else {
          res.status(401).send({ mensaje: "La categoría no se pudo editar" });
        }
      }
    }
  );
};

// Eliminamos una categoria
const eliminarCategoria = (req, res) => {
  // obtener el id de la categoria
  let id = req.params["id"];
  // Eliminamos la categoria por el ID
  Categoria.findByIdAndDelete({ _id: id }, (err, datosCategoria) => {
    if (err) {
      res.status(500).send({ mensaje: "Error al conectar al servidor" });
    } else {
      if (datosCategoria) {
        res.status(200).send({ categoria: datosCategoria });
      } else {
        res.status(401).send({ mensaje: "La categoría no se pudo eliminar" });
      }
    }
  });
};

module.exports = {
  registrarCategoria,
  buscarCategoria,
  listaCategoria,
  editarCategoria,
  eliminarCategoria,
};
