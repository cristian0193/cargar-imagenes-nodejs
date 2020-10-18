const connection = require('../config/db').connection;
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Funcion para obtener los item
const consultItems = async(request, response) => {
    connection.query('SELECT id, item, precio as price, url_images FROM product', (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows == 0) {
            response.status(401).json(results)
        } else {
            response.status(200).json(results)
        }
    });
}

// Funcion para guardar imagen localmente y en base de datos
const createItem = (request, response) => {

    const { item, price, imagenBase64 } = request.body

    // Estas vaibles permite obtener la ruta donde sera guardada la imagen
    var imageTypeRegularExpression = /\/(.*?)$/;
    var imageBuffer = decodeBase64Image(imagenBase64);
    var uploadedFeedMessagesLocation = '/Users/christianrodriguez/Proyectos/CargarImagenesAngular/cargar-imagen/src/assets/images/';
    var databaseMessagesLocation = 'assets/images/';
    var uniqueRandomImageName = 'image-' + uuidv4();
    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
    var uploadedImagePath = uploadedFeedMessagesLocation + uniqueRandomImageName + '.' + imageTypeDetected[1];
    var databaseImagePath = databaseMessagesLocation + uniqueRandomImageName + '.' + imageTypeDetected[1];

    try {
        // Se guarda imagen en la ruta definida Path
        fs.writeFile(uploadedImagePath, imageBuffer.data, function() {
            console.log('Imagen Guardada con exito: ', uploadedImagePath);
        });
        // Se persiste en la base de datos
        connection.query('INSERT INTO product (item, precio, url_images) VALUES ("' + item + '", ' + price + ' , "' + databaseImagePath + '")', (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`Recurso Creado : ${item}`)
        });
    } catch (error) {
        console.log('ERROR:', error);
    }
    console.log(imageBuffer);
}

// Permite decodificar la imagen de base64 a buffer
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

module.exports = {
    consultItems,
    createItem
}