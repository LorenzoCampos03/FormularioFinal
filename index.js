const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;
const ip = 'localhost';

// Middleware para analizar cuerpos de solicitud
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const conexion = mysql.createConnection({
    host: "localhost",
    port: 33060,
    database: "formulario",
    user: "root",
    password: "lorenzo"
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos.');
});

// Ruta POST para agregar usuarios
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    
    conexion.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error al insertar datos de usuario:', err);
            res.status(500).send('Ocurrió un error al procesar tu solicitud: ' + err.message);
            return;
        }

        console.log('Usuario insertado correctamente.');
        res.status(200).send('Tu registro se ha completado correctamente.');
    });
});

// Ruta GET para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) {
            console.error('Error al enviar index.html:', err);
            res.status(500).send('Error interno del servidor: ' + err.message);
        } else {
            console.log('Se ha enviado index.html correctamente.');
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${ip}:${PORT}`);
});
