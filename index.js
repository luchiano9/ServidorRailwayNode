const express = require("express");
const bodyParse = require("body-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
// app.use(express.json());

// app.options('*', cors()) // include before other routes
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match 
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//     });
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads'); // ubicación donde se guardarán los archivos
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname); // nombre del archivo
    }
});
const upload = multer({
    storage: storage, fileFilter: function (req, file, callback) {
        if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            return callback(new Error('Tipo de archivo no permitido. Solo se permiten archivos de Excel.'));
        }
        callback(null, true);
    }
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
  }));
// app.use(cors(), (req, res, next) => {

//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//     res.setHeader('Content-Type', 'application/json');
//     next();

// });
const PORT = process.env.PORT || 3977;

// app.use(express.json());

// Permitir cualquier origen
app.get("/", upload.single('file'), (req, res) => {
    const filePath = path.join(__dirname, './uploads/redpack.xlsx');
    // const file = req.file;
    // Envía el archivo como respuesta
    // const filePath = path.join(__dirname, "uploads", file.filename);
    res.download(filePath, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Error al descargar el archivo');
        }
    });

    // res.status(200).send(file);
});

app.post("/", upload.single('file'), (req, res) => {
    const file = req.file;
    // Envía el archivo como respuesta
    const filePath = path.join(__dirname, "uploads", file.filename);
    res.send({ message: `lo que paso es ${filePath}`});

    // res.status(200).send(file);
});

app.post("/welcome", (req, res) => {
    const { username } = req.body;
    res.status(200).send({ message: `hola ${username}` });
});

app.post("/api/lucho", async (req, res) => {

    const file = req.file;
    if (!file) {
        const error = new Error('Por favor seleccione un archivo de Excel');
        error.status = 400;
        return next(error);
    }
    res.status(200).send(file);
    console.log("entro");
});


app.get('/download', function (req, res) {
    const filePath = path.join(__dirname, './uploads/redpack.xlsx');
    res.download(filePath, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Error al descargar el archivo');
        }
    });
});

app.listen(PORT, () => {
    console.log(`server listo puerto ${PORT}`)
})