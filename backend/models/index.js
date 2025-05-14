"use strict";

require("dotenv").config();
const fs = require("fs");

const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

const config = require(path.join(__dirname, "../", "config", "config.json"))[
  env
];

const db = {};

let sequelize;
if (config.use_env_variable) {
  console.log(`config is: ${config}`);
  sequelize = new Sequelize(
    process.env[config.use_env_variable],
    config.dialect,
    (config.logging = false),
    config
  );
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect, // Explicitly include the dialect
    logging: false,
  });
}
// sequelize = new Sequelize(
//   "postgresql://postgres.vzoevdkkjwvfouogmbrj:6d8CrGJ1AwFZR6KM@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
//   {
//     dialect: "postgres",
//     protocol: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false, // For self-signed certificates (Supabase uses SSL)
//       },
//     },
//     logging: false, // Disable logging if not needed
//   }
// );

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// const fs = require('fs');
// const path = require('path');
// const { Sequelize } = require('sequelize');
// const config = require('../config/config'); // Assuming config.js is in the parent directory

// const sequelize = new Sequelize(config.database, config.username, config.password, {
//   host: config.host,
//   dialect: 'postgres',
//   logging: false, // Disable logging
// });

// const models = {};

// fs.readdirSync(__dirname)
//   .filter(file => file.endsWith('.js') && file !== path.basename(__filename))
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     models[model.name] = model;
//   });

// Object.keys(models).forEach(modelName => {
//   if (models[modelName].associate) {
//     models[modelName].associate(models);
//   }
// });

// module.exports = { sequelize, Sequelize, models };
