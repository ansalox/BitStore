// Variables de modulos (importamos librerias)
let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
// Variable para puerto de conexion del servidor
let port = process.env.PORT || 3001;



// variable de la aplicacion que ejecuta el server
let app = express();



// Routes
let Usuario = require("./routes/usuario");
let Categoria = require("./routes/categoria");
let Curso = require("./routes/curso");
let Estudiante = require("./routes/estudiante");
let Compra = require("./routes/compra");

// Conexion a DB
mongoose.connect(
  "mongodb://localhost:27017/bitstoredb",
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("Servidor DB: ON");
      app.listen(port, function () {
        console.log("Servidor Backend funcionando en el puerto :" + port);
      });
    }
  }
);

// Analizar la codificacion de las url
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Usar las rutas (API)
app.use("/api", Usuario);
app.use("/api", Categoria);
app.use("/api", Curso);
app.use("/api", Estudiante);
app.use("/api", Compra);

// Creamos modulo para importar
module.exports = app;
