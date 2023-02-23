const express = require("express");
const bodyParse = require("body-parser");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads'); // ubicación donde se guardarán los archivos
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname); // nombre del archivo
    }
});
const upload = multer({ storage: storage, fileFilter: function (req, file, callback) {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return callback(new Error('Tipo de archivo no permitido. Solo se permiten archivos de Excel.'));
    }
    callback(null, true);
}});

const app = express();
const PORT = process.env.PORT || 3977;

app.use(bodyParse.urlencoded({ extended:true}));
app.use(bodyParse.json());

app.get("/", (req,res) => {
    res.status(200).send({ message: "Hola"});
});

app.post("/welcome", (req,res) => {
    const { username } = req.body;
    res.status(200).send({ message: `hola ${username}`});
});

app.post("/api/lucho", upload.single('file') ,async (req, res) => {
  
    const file = req.file;
    if (!file) {
        const error = new Error('Por favor seleccione un archivo de Excel');
        error.status = 400;
        return next(error);
    }
    res.send(file);
    console.log("entro");
  });

app.listen(PORT , () => {
    console.log(`server listo puerto ${PORT}`)
})