const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Post = db.define('post', {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'disable'),
    allowNull: false,
    defaultValue: 'active',
  }
});

const postStatus = Object.freeze({
  active: 'active',
  disabled: 'disable',
});

module.exports = {Post, postStatus};
