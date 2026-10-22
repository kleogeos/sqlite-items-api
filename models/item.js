const { DataTypes } = require("sequelize");

module.exports = function defineItem(sequelize) {
  return sequelize.define("Item", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
  });
};
