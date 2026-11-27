const dotenv  = require('dotenv');
dotenv.config();

const CONFIG = {
  PORT: process.env.PORT,
  DEFAULT_LIMIT: process.env.DEFAULT_LIMIT || 20,
  DEFAULT_SKIP: process.env.DEFAULT_SKIP || 0,
  DATABASE: {
    HOST: process.env.DATABASE_HOST,
    NAME: process.env.DATABASE_NAME,
    USERNAME: process.env.DATABASE_USERNAME,
    PASSWORD: process.env.DATABASE_PASSWORD,
    DIALECT: process.env.DATABASE_DIALECT
  }
}

module.exports = CONFIG;
