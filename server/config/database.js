require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Pool } = require('pg');

// Database connection details
const dbName = process.env.DB_NAME || 'elgenio';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

// Create Sequelize instance directly
const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// First, connect to the default 'postgres' database to create our app database if needed
const createDbIfNotExists = async () => {
  try {
    // Connect to default postgres database
    const pool = new Pool({
      user: dbUser,
      password: dbPassword,
      host: dbHost,
      port: dbPort,
      database: 'postgres'
    });

    // Check if our database exists
    const result = await pool.query(`
      SELECT 1 FROM pg_database WHERE datname='${dbName}'
    `);

    // Create database if it doesn't exist
    if (result.rowCount === 0) {
      console.log(`Database ${dbName} does not exist, creating it now...`);
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }

    // Close the pool
    await pool.end();
  } catch (err) {
    console.error('Error creating database:', err);
    throw err;
  }
};

module.exports = {
  sequelize,
  createDbIfNotExists
};
