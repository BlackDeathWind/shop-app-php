import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const dbConfig = {
  server: process.env.DB_HOST || 'DELL5580\\SQLEXPRESS',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || 'shop',
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '21050043',
  dialect: 'mssql',
  logging: process.env.NODE_ENV === 'development' ? (sql: string) => logger.db.query(sql) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

const sequelize = new Sequelize({
  dialect: 'mssql',
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      server: dbConfig.server
    }
  },
  logging: dbConfig.logging,
  pool: dbConfig.pool
});

const testConnection = async (): Promise<void> => {
  try {
    logger.db.connecting();
    await sequelize.authenticate();
    logger.db.connected();
  } catch (error) {
    logger.db.error(error);
  }
};

export { sequelize, testConnection }; 