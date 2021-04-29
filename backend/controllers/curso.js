// Importamos modelo de curso
let Curso = require("../models/curso");
// Importamos modulo file System
let fs = require("fs");
// Importamos modulo path para manejar las rutas de los ficheros en el proyecto
let path = require("path");
// Importamos libreria para fechas
let moment = require("moment");

// Registrar curso
const registrarCurso = (req, res) => {
  console.log("0", req);
  // Obtenemos datos del JSON
  let params = req.body;
  // Instanciamos el curso Modelo
  let curso = new Curso();
  //Validamos los campos
  if (
    params.nombre &&
    params.descripcion &&
    params.precioTotal &&
    params.precioCompra &&
    params.cupos &&
    params.idCategoria &&
    params.puntos
  ) {
    // Ruta donde quedara la imagen en el proyecto
    let imagenPath = req.files.imagen.path;
    // Generamos un codigo para las imagenes
    let nameImg = moment().unix();
    // creamos variable de la nueva ruta
    var rutaServer =
      "./uploads/imgcurso/" + nameImg + path.extname(imagenPath).toLowerCase();
    // copiamos la imagen a la nueva ruta
    fs.createReadStream(imagenPath).pipe(fs.createWriteStream(rutaServer));
    // Nombre del archivo que quedara en BD
    let bdImg = nameImg + path.extname(imagenPath).toLowerCase();
    // llenamos el modelo con los datos del req
    curso.nombre = params.nombre;
    curso.descripcion = params.descripcion;
    curso.imagen = bdImg;
    curso.precioTotal = params.precioTotal;
    curso.precioCompra = params.precioCompra;
    curso.cupos = params.cupos;
    curso.idCategoria = params.idCategoria;
    curso.puntos = params.puntos;
    // Registramos el curso
    curso.save((err, datosCurso) => {
      if (err) {
        res.status(500).send({ mensaje: "Error al conectar al servidor" });
      } else {
        if (datosCurso) {
          res.status(200).send({ curso: datosCurso });
        } else {
          res.status(401).send({ mensaje: "No se pudo registrar el curso" });
        }
      }
    });
  } else {
    res.status(401).send({ mensaje: "Falto alguno de los campos" });
  }
};

// Consultamos todas las categorias
const listaCursos = (req, res) => {
  // si tenemos filtro nombre lo guardamos
  let nombre = req.params["nombre"];
  // Busqueda de las categorias
  Curso.find({ nombre: new RegExp(nombre, "i") })
    .populate("idCategoria")
    .exec((err, datosCurso) => {
      if (err) {
        res.status(500).send({ message: "Error en el servidor" });
      } else {
        if (datosCurso) {
          res.status(200).send({ productos: datosCurso });
        } else {
          res
            .status(403)
            .send({ message: "No hay ningun curso con ese nombre" });
        }
      }
    });
};

// Exportamos el modulo con sus funciones
module.exports = {
  registrarCurso,
  listaCursos,
};
