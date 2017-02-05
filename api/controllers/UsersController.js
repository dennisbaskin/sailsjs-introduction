/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  // post /users
  create: (req, res) => {
    return withErrorHandling(req, res, (params) => {
      return User.create(params);
    });
  },

  // get /users
  list: (req, res) => {
    return withErrorHandling(req, res, (_params) => {
      return User.find();
    });
  },

  // get /users/:id
  show: (req, res) => {
    return withErrorHandling(req, res, (params) => {
      return User.find(params.id);
    });
  },

  // patch /users/:id
  update: (req, res) => {
    return withErrorHandling(req, res, (params) => {
      return User.update(params.id, params);
    });
  }
};

const withErrorHandling = (req, res, promise, responseFilter = (r) => r) => {
  const params = req.allParams();
  return promise(params)
    .then((response) => res.json(responseFilter(response)))
    .catch((err) => res.json({error: err, params: params}));
};
