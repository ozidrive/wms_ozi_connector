import { Sequelize } from 'sequelize';
import { DB_CONFIG } from './constants';

const sequelize = new Sequelize(
  DB_CONFIG.DB_NAME,
  DB_CONFIG.DB_USER,
  DB_CONFIG.DB_PASSWORD,
  {
    host: DB_CONFIG.DB_HOST,
    port: DB_CONFIG.DB_PORT,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false // Set to console.log for debugging
  }
);

export default sequelize;