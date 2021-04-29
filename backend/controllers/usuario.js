// Variable donde se importa el modulo usuario
let Usuario = require("../models/usuario");
// Variable para importar la libreria encriptar pass
let bcrypt = require("bcrypt-nodejs");
// Importamos jwt
let jwt = require("../libs/jwt");

// Funcion para registrar el usuario
const registrarUsuario = (req, res) => {
  // sacamos los parametros del cuerpo de la API (ruta url)
  let params = req.body;
  // utilizamos el modelo usuario
  let usuario = new Usuario();
  // Si llego el password procedemos hacer el hash (encriptar)
  if (
    params.nombres &&
    params.apellidos &&
    params.edad &&
    params.correo &&
    params.pass &&
    params.rol
  ) {
    // Usamos el bcrypt para encriptar la contraseña
    bcrypt.hash(params.pass, null, null, (err, hash) => {
      // si se encripta registramos el usuario
      if (hash) {
        usuario.nombres = params.nombres;
        usuario.apellidos = params.apellidos;
        usuario.edad = params.edad;
        usuario.correo = params.correo;
        usuario.pass = hash;
        usuario.rol = params.rol;
        // Registramos los datos del usuario (los guardamos para enviarlos a mongo por el modelo)
        usuario.save((err, saveUsuario) => {
          if (err) {
            // si hay un error en el registro
            res.status(500).send({ err: "No se registro el usuario" });
          } else {
            // si el proceso se completo bien procedemos a guardar en el modelo los datos
            res.status(200).send({ usuario: saveUsuario });
          }
        });
      }
    });
  } else {
    // Damos respuesta con codigo HTTP de error y enviamos el error a consola
    res.status(405).send({ err: "Faltaron campos por llenar" });
  }
};

// Login
const login = (req, res) => {
  // Variable para los parametros que llegan
  let params = req.body;
  // Buscamos el usuario en BD
  Usuario.findOne({ correo: params.correo }, (err, datosUsuario) => {
    if (err) {
      res.status(500).send({ mensaje: "Error del servidor" });
    } else {
      if (datosUsuario) {
        bcrypt.compare(params.pass, datosUsuario.pass, (err, confirm) => {
          if (confirm) {
            if (params.getToken) {
              res.status(200).send({
                jwt: jwt.createToken(datosUsuario),
                //Usuario: datosUsuario,
              });
            } else {
              res
                .status(200)
                .send({ Usuario: datosUsuario, mensaje: "Sin token" });
            }
          } else {
            res.status(401).send({ mensaje: " Correo o password incorrectos" });
          }
        });
      } else {
        res.status(401).send({ mensaje: " Correo o password incorrectos" });
      }
    }
  });
};

// Lista de usuarios
const listarUsuario = (req, res) => {
  // Cargamos todos los datos de la coleccion usuario
  Usuario.find((err, datosUsuario) => {
    if (datosUsuario) {
      res.status(200).send({ usuarios: datosUsuario });
    }
  });
};

// Buscamos usuario por id
const obtenerUsuario = (req, res) => {
  // id del usuario
  let id = req.params["id"];
  // Buscamos usuario
  Usuario.findById(id, (err, datosUsuario) => {
    if (datosUsuario) {
      res.status(200).send({ user: datosUsuario });
    } else {
      res.status(403).send({ message: "No se encontro ningun registro" });
    }
  });
};

// Editar usuario
const editarUsuario = (req, res) => {
  // Obtener id del usuario enviado en request
  let id = req.params["id"];
  // Obtenemos todos los parametos
  let params = req.body;
  // Buscamos el Usuario para editarlo
  if (params.pass) {
    bcrypt.hash(params.pass, null, null, (err, hash) => {
      if (hash) {
        Usuario.findByIdAndUpdate(
          id,
          {
            nombres: params.nombres,
            apellidos: params.apellidos,
            edad: params.edad,
            correo: params.correo,
            pass: hash,
            rol: params.rol,
          },
          (err, datosUsuario) => {
            if (datosUsuario) {
              res.status(200).send({ Usuario: datosUsuario });
            } else {
              res.status(500).send({ message: "El usuario no se pudo editar" });
            }
          }
        );
      }
    });
  } else {
    res.status(500).send({ message: "Faltaron datos" });
  }
};

// Eliminamos usuario
const eliminarUsuario = (req, res) => {
  // obtener el id del usuario
  let id = req.params["id"];
  // Eliminamos el usuario por el ID
  Usuario.findByIdAndDelete({ _id: id }, (err, datosUsuario) => {
    if (err) {
      res.status(500).send({ mensaje: "Error al conectar al servidor" });
    } else {
      if (datosUsuario) {
        res.status(200).send({ Usuario: datosUsuario });
      } else {
        res.status(401).send({ mensaje: "El usuario no se pudo eliminar" });
      }
    }
  });
};

// Exportamos el modulo
module.exports = {
  registrarUsuario,
  login,
  listarUsuario,
  obtenerUsuario,
  editarUsuario,
  eliminarUsuario,
};
