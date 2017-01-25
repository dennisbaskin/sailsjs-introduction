/**
 * DefaultController
 *
 * @description :: Server-side logic for managing defaults
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * `DefaultController.index()`
   */
  index: function (req, res) {
    var name = req.param('name') || 'unknown person',
        greeting = 'Hello ' + name;

    return res.json({
      name: name,
      greeting: greeting,
    });
  }
};

