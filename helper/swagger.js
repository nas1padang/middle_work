const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Movie API with Express JS',
            version: '1.0.0',
            description: 'Dokumentasi Movie API'
        },
        host: `localhost:${process.env.PORT}`, 
        basePath: '/',                      
        schemes: ['http'],
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'X-Token-Key',
                in: 'header',
                description: "Sebelum mengakses api pastikan mengisi X-Token-Key pada Headernya."
            }
        }
    },
    apis: ['./routes/*']
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs