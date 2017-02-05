/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const uuid = require('node-uuid');

module.exports = {
  tableName: 'users',

  attributes: {
    username: {
      maxLength: 16,
      minLength: 3,
      notNull: true,
      required: true,
      type: 'string',
      unique: true,
    },

    email: {
      notNull: true,
      required: true,
      type: 'email',
      unique: true,
    },

    uuid: {
      notNull: true,
      type: 'uuid',
      defaultsTo: () => uuid.v4(),
    },

    password: {
      notNull: true,
      required: true,
      type: 'string',
    },
  }
};
