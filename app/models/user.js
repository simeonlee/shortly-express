var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



var User = db.Model.extend({
  tableName: 'users',
  links: function() {
    return this.hasMany(Link);
  },
  clicks: function() {
    return this.hasMany(Click);
  }
});

module.exports = User;