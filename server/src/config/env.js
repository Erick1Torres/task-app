require('dotenv').config();

if (!process.env.PORT) {
    throw new Error ('El puerto El puerto (PORT) no está definido en el archivo .env esta definido')
}

module.exports = {
    PORT: process.env.PORT
};