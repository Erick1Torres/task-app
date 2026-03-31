require('dotenv').config();

module.exports = {
    // Si no hay puerto en el .env, usa el 3000 por defecto
    // En Vercel, esto simplemente se ignorará o se adaptará solo
    PORT: process.env.PORT || 3000 
};