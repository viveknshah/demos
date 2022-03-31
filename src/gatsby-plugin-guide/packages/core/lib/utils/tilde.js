// Generated by CoffeeScript 2.6.1
var path, tilde;

tilde = require('tilde-expansion');

path = require('path');

/*
Not, those function are not aware of an SSH connection
and can't use `path.posix` when appropriate over SSH.
It could be assumed that a path starting with `~` is 
always posix but this is not yet handled and tested.
*/
module.exports = {
  normalize: function(location) {
    return new Promise(function(accept, reject) {
      return tilde(location, function(location) {
        return accept(path.normalize(location));
      });
    });
  },
  resolve: async function(...locations) {
    var location, normalized;
    normalized = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = locations.length; i < len; i++) {
        location = locations[i];
        results.push(module.exports.normalize(location));
      }
      return results;
    })();
    normalized = (await Promise.all(normalized));
    return path.resolve(...normalized);
  }
};
