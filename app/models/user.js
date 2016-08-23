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
  },
  initialize: function() {
    this.on('creating', function(model, attrs, options) {
      var salt = bcrypt.genSaltSync(10);
      // save user salt to database
      model.set('salt', salt);
      var hash = bcrypt.hashSync(model.get('password'), salt);
      console.log('---> PASSWORD:');
      console.log(model.get('password'));
      console.log('---> HASH:');
      console.log(hash);
      model.set('password', hash);
      console.log('---> HASH FROM DATABASE:');
      console.log(model.get('password'));
    });
  }
});

module.exports = User;