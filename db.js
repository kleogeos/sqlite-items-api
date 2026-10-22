const { Sequelize } = require("sequelize");
const defineItem = require("./models/item");

function createDb(storage) {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: storage || "./data.sqlite",
    logging: false,
  });
  const Item = defineItem(sequelize);
  return { sequelize, Item };
}

module.exports = { createDb };
